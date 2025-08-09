import Canvas from "@/app/Components/Canvas/Canvas";
import { getAuthSession } from "@/lib/auth";
import { redirect, useParams } from "next/navigation";

export default async function Project({ params }: { params: { projectId: string } }) {
    const session = getAuthSession();
    if (!session) {
        redirect('/auth/signin');
    }

    const { projectId } = await params;

    return (
        <div>
            <Canvas projectId={projectId} />
        </div>
    )
}
