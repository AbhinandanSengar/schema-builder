'use client';

import clsx from 'clsx';
import { Panel } from "@xyflow/react";
import { Project } from "@/lib/types";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, LockClosedIcon, LockOpen1Icon } from '@radix-ui/react-icons';
import { Code2Icon, FileDownIcon, FileUpIcon, PlusIcon, Redo2Icon, Save, Undo2Icon, UsersIcon } from "lucide-react";
import { AnimatedThemeToggler } from '@/components/magicui/animated-theme-toggler';
import ShareModal from './ShareModal';
import { useState } from 'react';
import { Dock, DockIcon } from '@/components/ui/dock';

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
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);

    return (
        <>
            <Panel position="top-left" className='!top-3 !left-3'>
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

            <Panel position='top-center' className='!top-3'>
                <Dock>
                    <DockIcon
                        onClick={handleCanvasMove}
                        className={clsx(
                            canvasLock && "bg-gray-200 dark:bg-gray-800"
                        )}
                        title={canvasLock ? "Unlock Canvas" : "Lock Canvas"}
                    >
                        {canvasLock ? (
                            <LockClosedIcon className="w-4 h-4" />
                        ) : (
                            <LockOpen1Icon className="w-4 h-4" />
                        )}
                    </DockIcon>

                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

                    <DockIcon
                        onClick={addTable}
                        title="Add Table"
                    >
                        <PlusIcon className="w-4 h-4 border border-[#555454] rounded" />
                    </DockIcon>

                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

                    <DockIcon
                        onClick={importJSON}
                        title="Import JSON"
                    >
                        <FileDownIcon className="w-4 h-4" />
                    </DockIcon>

                    <DockIcon
                        onClick={exportJSON}
                        title="Export JSON"
                    >
                        <FileUpIcon className="w-4 h-4" />
                    </DockIcon>

                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

                    <DockIcon
                        onClick={generateCode}
                        title="Generate Code"
                    >
                        <Code2Icon className="w-4 h-4" />
                    </DockIcon>

                    <div className="h-5 w-px bg-gray-300 dark:bg-gray-700" />

                    <DockIcon
                        onClick={saveSchema}
                        title="Save Schema"
                    >
                        <Save className="w-4 h-4" />
                    </DockIcon>
                </Dock>
            </Panel>

            <Panel position='top-right' className='!top-3 !right-3 flex items-center gap-2'>
                <AnimatedThemeToggler />

                <Button
                    variant="default"
                    onClick={() => setIsShareModalOpen(true)}
                >
                    <UsersIcon className="w-5 h-5 mr-1" />
                    Share
                </Button>
            </Panel>

            <Panel position='bottom-left' className='!bottom-3 !left-3'>
                <Dock>
                    <DockIcon
                        onClick={() => { }}
                        title="Undo"
                    >
                        <Undo2Icon className='w-4 h-4' />
                    </DockIcon>
                    <DockIcon
                        onClick={() => { }}
                        title="Redo"
                    >
                        <Redo2Icon className='w-4 h-4' />
                    </DockIcon>
                </Dock>
            </Panel>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                projectId={project?.id || ''}
                projectName={project?.name || 'Untitled Project'}
                nodes={project?.schema.nodes || []}
                edges={project?.schema.edges || []}
            />
        </>
    )
}