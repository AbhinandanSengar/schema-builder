import clsx from 'clsx';
import { Panel } from "@xyflow/react";
import { Project } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import * as Toolbar from '@radix-ui/react-toolbar';
import { ChevronLeftIcon, LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons';
import { Code2Icon, FileDownIcon, FileUpIcon, PlusIcon, Redo2Icon, Save, Undo2Icon, UsersIcon } from "lucide-react";
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';

type ToolbarProps = {
    project: Project | null;
    canvasLock: boolean;
    addTable: () => void;
    exportJSON: () => void;
    importJSON: () => void;
    generateCode: () => void;
    saveSchema: () => void;
    handleCanvasMove: () => void;
}

export default function CanvasToolbar({ project, canvasLock, addTable, exportJSON, importJSON, generateCode, saveSchema, handleCanvasMove }: ToolbarProps) {
    const router = useRouter();

    return (
        <>
            <Panel position="top-left">
                <div className='flex items-center gap-2'>
                    <div
                        onClick={() => router.push('/dashboard')}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-400"
                        role="button"
                        tabIndex={0}
                        aria-label="Back to dashboard"
                        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') router.push('/dashboard'); }}
                    >
                        <ChevronLeftIcon className="w-7 h-7 text-gray-700 dark:text-gray-200" />
                    </div>
                    <div className='px-2 py-1 text-lg font-semibold text-gray-700 dark:text-gray-200'>
                        {project?.name || "Untitled Project"}
                    </div>
                </div>
            </Panel>

            <Panel position='top-center'>
                <Toolbar.Root
                    className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                >
                    <Toolbar.Button
                        onClick={handleCanvasMove}
                        className={clsx(
                            "p-2 rounded transition-colors",
                            canvasLock
                                ? "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                                : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        title={canvasLock ? "Unlock Canvas" : "Lock Canvas"}
                    >
                        {canvasLock ? (
                            <LockClosedIcon className="w-4 h-4" />
                        ) : (
                            <LockOpen1Icon className="w-4 h-4" />
                        )}
                    </Toolbar.Button>

                    <Toolbar.Separator
                        orientation="vertical"
                        className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1"
                    />

                    <Toolbar.Button
                        onClick={addTable}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Add Table"
                    >
                        <PlusIcon className="w-4 h-4 border border-[#555454] rounded" />
                    </Toolbar.Button>

                    <Toolbar.Separator
                        orientation="vertical"
                        className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1"
                    />

                    <Toolbar.Button
                        onClick={importJSON}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Import JSON"
                    >
                        <FileDownIcon className="w-4 h-4" />
                    </Toolbar.Button>

                    <Toolbar.Button
                        onClick={exportJSON}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Export JSON"
                    >
                        <FileUpIcon className="w-4 h-4" />
                    </Toolbar.Button>

                    <Toolbar.Separator
                        orientation="vertical"
                        className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1"
                    />

                    <Toolbar.Button
                        onClick={generateCode}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Generate Code"
                    >
                        <Code2Icon className="w-4 h-4" />
                    </Toolbar.Button>

                    <Toolbar.Separator
                        orientation="vertical"
                        className="h-5 w-px bg-gray-300 dark:bg-gray-700 mx-1"
                    />

                    <Toolbar.Button
                        onClick={saveSchema}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Generate Code"
                    >
                        <Save className="w-4 h-4" />
                    </Toolbar.Button>
                </Toolbar.Root>
            </Panel>

            <Panel position='top-right' className='flex items-center gap-2'>
                <AnimatedThemeToggler />

                <Button
                    variant="default"
                    onClick={() => {}}
                >
                    <UsersIcon className="w-5 h-5 mr-1" />
                    Share
                </Button>
            </Panel>

            <Panel position='bottom-left'>
                <Toolbar.Root
                    className="p-2 flex items-center gap-4 bg-white dark:bg-gray-900 rounded-lg shadow border border-gray-200 dark:border-gray-700"
                >
                    <Toolbar.Button
                        onClick={() => { }}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Undo"
                    >
                        <Undo2Icon className='w-4 h-4' />
                    </Toolbar.Button>
                    <Toolbar.Button
                        onClick={() => { }}
                        className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Redo"
                    >
                        <Redo2Icon className='w-4 h-4' />
                    </Toolbar.Button>
                </Toolbar.Root>
            </Panel>
        </>
    )
}
