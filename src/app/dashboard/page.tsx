
import Dashboard from "../Components/Dashboard";
import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function dashboard() {
    const session = await getAuthSession();
    if(!session) {
        redirect('/auth/signin');
    }

    return (
        <div>
            <Dashboard />
        </div>
    )
}
