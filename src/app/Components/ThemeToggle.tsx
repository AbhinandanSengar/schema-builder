'use client';

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isDarkMode = localStorage.getItem("theme") === "dark";
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    });

    const toggleDarkMode = () => {
        const newMode = !isDark;
        setIsDark(newMode);
        if (newMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    };

    return (
        <Button
            onClick={toggleDarkMode}
            variant="outline"
            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
            {isDark ? (
                <Sun size={20} className="w-4 h-4 text-yellow-400" />
            ) : (
                <Moon size={20} className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            )}
        </Button>

    );
}
