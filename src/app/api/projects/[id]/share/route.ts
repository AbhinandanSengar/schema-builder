import { getAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
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
            where: { id }
        });
        if(!project) {
            return NextResponse.json(
                {
                    message: "Project not found."
                },
                {
                    status: 404
                }
            )
        }

        const existingToken = await prisma.shareToken.findFirst({
            where: { projectId: id }
        });
        if(existingToken) {
            return NextResponse.json(
                {
                    message: "Project already shared.",
                    shareToken: existingToken.token
                },
                {
                    status: 200
                }
            )
        }

        //generate a share token, if not already exists
        const shareToken = randomUUID();
        console.log(shareToken);

        const share = await prisma.shareToken.create({
            data: {
                token: shareToken,
                projectId: id,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // Expires in 24 hours
            }
        });

        return NextResponse.json(
            {
                message: "Project shared successfully",
                shareToken: share.token
            },
            {
                status: 200
            }
        );

    } catch (error) {
        console.error("Error sharing project:", error);
        return NextResponse.json(
            {
                message: "Failed to share project."
            },
            {
                status: 500
            }
        );
    }
}