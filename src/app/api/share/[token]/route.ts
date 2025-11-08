import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
    _req: Request,
    context: { params: { token: string } }
) {
    const { token } = context.params;

    try {
        const share = await prisma.shareToken.findUnique({
            where: { token },
            include: { project: true },
        });

        if (!share) {
            return NextResponse.json({ error: "Invalid share token" }, { status: 404 });
        }

        if (new Date() > share.expires) {
            return NextResponse.json({ error: "Share token has expired" }, { status: 410 });
        }

        const project = await prisma.project.findUnique({
            where: { id: share.projectId },
        });

        if (!project) {
            return NextResponse.json({ error: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ project }, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching shared project:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
