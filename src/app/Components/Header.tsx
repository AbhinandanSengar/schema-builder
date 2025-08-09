'use client';

import { Database, Users } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Header() {
    const { status } = useSession();
    const router = useRouter();

    if (status === 'unauthenticated') {
        return null;
    }

    const handleLogOut = async () => {
        await signOut({ redirect: false });
        toast.success("Logged out successfully");
        router.push("/auth/signin")
    }

    return (
        <div className="px-4 py-2 h-14 flex justify-between items-center border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="flex gap-2 items-center">
                <Button
                    variant="ghost"
                    onClick={() => window.location.reload()}
                    className="flex items-center space-x-3 hover:opacity-90 hover:bg-transparent transition-opacity duration-200"
                >
                    <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                        <Database className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h1 className="text-xl font-bold text-foreground">
                        Schema Builder
                    </h1>
                </Button>
            </div>

            <div className="flex gap-2 items-center">
                <ThemeToggle />

                <Button
                    variant="default"
                    onClick={handleLogOut}
                    className="cursor-pointer gap-2"
                >
                    Log Out
                </Button>
            </div>
        </div>
    );
}
