'use client';

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Code2Icon, FileJsonIcon, PlusIcon, Redo2, Save, Undo2 } from "lucide-react";
import axios from "axios";
import { Project } from "@/lib/types";
import { toast } from "sonner";

type ToolbarProps = {
    project: Project | null;
    addTable: () => void;
    exportJSON: () => void;
    importJSON: () => void;
    generateCode: () => void;
    saveSchema: () => void;
}

export default function CanvasToolbar({ project, addTable, exportJSON, importJSON, generateCode, saveSchema }: ToolbarProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editedName, setEditedName] = useState<string>('Untitled Project');
    const [tempName, setTempName] = useState<string>(editedName);

    useEffect(() => {
        if (project?.name) {
            setEditedName(project?.name);
        }
    }, [project?.name]);


    useEffect(() => {
        if (isEditing) {
            setTempName(editedName)
        }
    }, [isEditing, editedName]);

    async function handleSave() {
        if(!project?.id) {
            console.error("Project ID is not available");
            return
        }

        const trimmed = tempName.trim() || "Untitled Project";

        await axios.patch(`/api/projects/${project.id}`, {
            name: trimmed
        });

        setEditedName(trimmed);
        setIsEditing(false);
        toast.success(`Project name updated to "${trimmed}"`);
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
                        {editedName}
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
                <Button variant={"default"} onClick={saveSchema}>
                    <Save className="w-5 h-5 mr-1" />
                    Save
                </Button>
            </div>
        </div>
    )
}
