import { z } from "zod";
import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const UpdateProjectSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  schema: z.record(z.string(), z.any()).optional(),
  isPublic: z.boolean().optional(),
});

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
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
        const project = await prisma.project.findUnique({
            where: {
                id,
                ownerId: session.user.id,
            }
        });

        if (!project) {
            return NextResponse.json(
                {
                    message: "Project not found or you do not have permission to access it."
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(
            {
                message: "Project fetched successfully",
                project,
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error fetching project:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred."
            },
            {
                status: 500
            }
        );
    }
}

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
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
    const parsedData = UpdateProjectSchema.safeParse(body);
    if (!parsedData.success) {
        return NextResponse.json(
            {
                message: "Invalid inputs",
                error: parsedData.error.flatten().fieldErrors,
            },
            {
                status: 401
            }
        );
    }

    try {
        const project = await prisma.project.findUnique({
            where: {
                id,
                ownerId: session.user.id,
            }
        });
        if (!project) {
            return NextResponse.json(
                {
                    message: "Project not found or you do not have permission to update it."
                },
                {
                    status: 404
                }
            );
        }

        const updatedProject = await prisma.project.update({
            where: {
                id,
            },
            data: parsedData.data,
        });

        return NextResponse.json(
            {
                message: "Project updated successfully",
                project: updatedProject,
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred."
            },
            {
                status: 500
            }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;
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
        const project = await prisma.project.findUnique({
            where: {
                id,
                ownerId: session.user.id,
            }
        });
        if (!project) {
            return NextResponse.json(
                {
                    message: "Project not found or you do not have permission to delete it."
                },
                {
                    status: 404
                }
            );
        }

        await prisma.project.delete({
            where: {
                id,
            },
        });

        return NextResponse.json(
            {
                message: "Project deleted successfully",
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            {
                error: "An unexpected error occurred."
            },
            {
                status: 500
            }
        );
    }
}
