import CanvasWrapper from "@/app/Components/CanvasWrapper";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Project() {
    const session = await getAuthSession();
    if (!session) {
        redirect('/auth/signin');
    }

    return (
        <div>
            <CanvasWrapper />
        </div>
    )
}
