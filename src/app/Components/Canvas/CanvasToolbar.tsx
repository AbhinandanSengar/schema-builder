'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Code2Icon, FileJsonIcon, PlusIcon, Redo2, Undo2 } from "lucide-react";

type ToolbarProps = {
    addTable: () => void;
    exportJSON: () => void;
    importJSON: () => void;
    generateCode: () => void;
}

export default function CanvasToolbar({ addTable, exportJSON, importJSON, generateCode }: ToolbarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [projectName, setProjectName] = useState<string>("Untitled Project");
    const [tempName, setTempName] = useState<string>(projectName);

    useEffect(() => {
        if(isEditing) {
            setTempName(projectName)
        }
    }, [isEditing, projectName]);

    function handleSave() {
        const trimmed = tempName.trim() || "Untitled Project";
        setProjectName(trimmed);
        setIsEditing(false);
    }

    return (
        <div className="flex items-center justify-between px-10 py-2 border-b border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <div className="flex items-center gap-3">
                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter')
                                handleSave();
                            else if (e.key === 'Escape')
                                setIsEditing(false);
                        }}
                        onBlur={handleSave}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                ) : (
                    <span
                        className="text-lg font-medium truncate max-w-[300px] cursor-pointer"
                        onClick={() => setIsEditing(true)}
                    >
                        {projectName}
                    </span>
                )}
                <div className="flex items-center gap-1">
                    <Button variant={"outline"}>
                        <Undo2 className="w-4 h-4" />
                    </Button>
                    <Button variant={"outline"}>
                        <Redo2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant={"outline"} onClick={addTable}>
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Table
                </Button>
                <Button variant={"outline"} onClick={importJSON}>
                    <FileJsonIcon className="w-4 h-4 mr-1" />
                    Import JSON
                </Button>
                <Button variant={"outline"} onClick={exportJSON}>
                    <FileJsonIcon className="w-4 h-4 mr-1" />
                    Export JSON
                </Button>
                <Button variant={"default"} onClick={generateCode}>
                    <Code2Icon className="w-5 h-5 mr-1" />
                    Generate Code
                </Button>
            </div>
        </div>
    )
}