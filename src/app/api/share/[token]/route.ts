import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"; // adjust if your prisma instance is elsewhere

export async function GET(
    req: Request,
    { params }: { params: { token: string } }
) {
    try {
        const { token } = params;

        const share = await prisma.shareToken.findUnique({
            where: { token },
            include: { project: true },
        });

        if (!share) {
            return NextResponse.json(
                {
                    error: "Invalid share token"
                },
                {
                    status: 404
                }
            );
        }

        if (new Date() > share.expires) {
            return NextResponse.json(
                {
                    error: "Share token has expired"
                },
                {
                    status: 410
                }
            );
        }

        const project = await prisma.project.findUnique({
            where: { id: share.projectId },
        });

        if (!project) {
            return NextResponse.json(
                {
                    error: "Project not found"
                },
                {
                    status: 404
                }
            );
        }

        return NextResponse.json(
            {
                project
            },
            {
                status: 200
            }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
