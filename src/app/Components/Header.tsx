import { Users } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
    return (
        <div className="px-4 py-2 h-14 flex justify-between items-center border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="flex gap-2 items-center">
                <div className="p-2 text-2xl font-semibold text-gray-800 dark:text-white transition-colors duration-300">
                    Schema Designer
                </div>
            </div>

            <div className="flex gap-2 items-center">
                <Button size="lg" variant="outline" className="cursor-pointer gap-2">
                    <Users className="w-4 h-4" />
                    <span>Invite</span>
                </Button>

                <ThemeToggle />
            </div>
        </div>
    );
}
