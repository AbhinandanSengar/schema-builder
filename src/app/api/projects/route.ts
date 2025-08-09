import { z } from "zod";
import prisma from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth";
import { formatDistanceToNow } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

import { Prisma } from '@prisma/client';

type SchemaType = {
    nodes?: {
        id: string;
        position: { x: number; y: number };
        type: string;
        data: {
            tableName: string;
            fields: Array<{
                id: string;
                name: string;
                type: string;
                isPrimary?: boolean;
                isRequired?: boolean;
                isUnique?: boolean;
                isForeign?: boolean;
                relationType?: string;
            }>;
        };
    }[];
    edges?: {
        id: string;
        source: string;
        target: string;
        sourceHandle?: string;
        targetHandle?: string;
        type: string;
        data: {
            relationship: string;
        };
    }[];
};

const ProjectSchema = z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().optional(),
    schema: z.custom<Prisma.JsonValue & SchemaType>((data) => {
        try {
            const parsed = JSON.parse(JSON.stringify(data));
            return true;
        } catch {
            return false;
        }
    }, "Invalid schema format"),
    isPublic: z.boolean(),
});

export async function POST(request: NextRequest) {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return NextResponse.json(
            {
                message: "Unauthorized access. Please log in."
            },
            {
                status: 401
            }
        );
    }

    const body = await request.json();
    const parsedProjectData = ProjectSchema.safeParse(body);
    if (!parsedProjectData.success) {
        return NextResponse.json(
            {
                message: "Invalid inputs",
                error: parsedProjectData.error.flatten().fieldErrors,
            },
            {
                status: 400
            }
        );
    }

    try {
        const { name, description, schema, isPublic } = parsedProjectData.data;

        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                schema,
                isPublic,
                ownerId: session.user.id,
            },
        });

        return NextResponse.json(
            {
                message: "Project created successfully",
                project: newProject,
            },
            {
                status: 201
            }
        );
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json(
            {
                error: "An error occurred while creating the project."
            },
            {
                status: 500
            }
        );
    }
}

export async function GET(request: NextRequest) {
    const session = await getAuthSession();
    if (!session?.user?.id) {
        return NextResponse.json(
            {
                message: "Unauthorized access. Please log in."

            },
            {
                status: 401
            }
        );
    }

    try {
        const projects = await prisma.project.findMany({
            where: {
                OR: [
                    { ownerId: session.user.id },
                    { members: { some: { userId: session.user.id } } }
                ]
            },
            include: {
                owner: {
                    select: { id: true, name: true, email: true, image: true }
                },
                members: {
                    include: {
                        user: { select: { id: true, name: true, email: true, image: true } }
                    }
                }
            },
            orderBy: { updatedAt: "desc" }
        });

        const transformed = projects.map(project => {
            const schemaData = project.schema as { nodes?: { id: string }[] };
            const tablesCount = Array.isArray(schemaData?.nodes) ? schemaData.nodes.length : 0;
            const collaboratorsCount = (project.members?.length || 0) + 1;

            return {
                id: project.id,
                name: project.name,
                description: project.description || "",
                lastModified: project.updatedAt ? formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true }) : "unknown",
                collaborators: collaboratorsCount,
                tables: tablesCount,
                owner: project.owner,
                members: project.members
            };
        });

        return NextResponse.json(
            {
                message: "Projects fetched successfully",
                projects: transformed
            },
            {
                status: 200

            }
        );
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json(
            {
                error: "An error occurred while fetching projects."
            },
            {
                status: 500

            }
        );
    }
}
