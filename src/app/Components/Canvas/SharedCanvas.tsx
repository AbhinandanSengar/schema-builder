'use client';

import { useEffect, useState } from "react";
import {
    ReactFlow,
    useEdgesState,
    useNodesState,
    Background,
    MiniMap,
    Node,
    Edge,
    Panel
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import axios from "axios";
import { toast } from "sonner";
import TableNode from "./TableNode";
import CustomEdge from "./CustomEdge";
import { Toaster } from "@/components/ui/sonner";
import { FileUpIcon } from "lucide-react";
import clsx from "clsx";
import { LockClosedIcon, LockOpen1Icon } from "@radix-ui/react-icons";
import { AnimatedThemeToggler } from "@/components/magicui/animated-theme-toggler";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Dock, DockIcon } from "@/components/ui/dock"; // Import Dock components

interface Project {
    id: string;
    name: string;
    schema: {
        nodes: Node[];
        edges: Edge[];
    };
}

interface ToolbarProps {
    token: string;
}

// Removed duplicate ToolbarProps interface

export default function SharedCanvas({ token }: ToolbarProps) {
    const router = useRouter();
    const [canvasLock, setCanvasLock] = useState<boolean>(true);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const nodeTypes = { custom: TableNode };
    const edgeTypes = { 'custom-edge': CustomEdge };

    useEffect(() => {
        async function fetchSharedProject() {
            try {
                const { data } = await axios.get(`/api/share/${token}`);

                const sanitizedNodes = (data.project.schema.nodes ?? []).map((node: Node) => ({
                    ...node,
                    position: node.position ?? { x: 0, y: 0 }
                }));
                const sanitizedEdges = (data.project.schema.edges ?? []).map((edge: Edge) => ({ ...edge }));

                setProject(data.project);
                setNodes(sanitizedNodes);
                setEdges(sanitizedEdges);
                setLoading(false);
                toast(`Shared project "${data.project.name}" loaded`);
            } catch (err) {
                console.error(err);
                toast.error("Error loading project");
                setLoading(false);
            }
        }

        fetchSharedProject();
    }, [token, setNodes, setEdges]);

    function exportJSON() {
        const dataToExport = {
            nodes: nodes,
            edges: edges,
        };

        const jsonString = JSON.stringify(dataToExport, null, 2);

        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "database-schema.json";
        a.click();

        URL.revokeObjectURL(url);
        toast("Schema exported as database-schema.json");
    }

    if (loading) return <p className="p-6">Loading shared project...</p>;
    if (!project) return <p className="p-6 text-red-500">Project not found or expired.</p>;

    return (
        <div className="flex flex-col h-[100vh] overflow-hidden bg-white dark:bg-gray-900">
            <Panel position="top-left" className='!top-3 !left-3'>
                <div className='flex items-center gap-2'>
                    {/* Restored content */}
                    <div className='px-2 py-1 text-lg font-semibold text-gray-700 dark:text-gray-200'>
                        {project?.name || "Untitled Project"}
                    </div>
                </div>
            </Panel>

            {/* --- MODIFIED: Replaced Toolbar with Dock --- */}
            <Panel position='top-center' className="!top-3">
                <Dock>
                    <DockIcon
                        onClick={() => setCanvasLock(!canvasLock)}
                        className={clsx(
                            canvasLock
                                ? "bg-gray-200 dark:bg-gray-800"
                                : ""
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
                        onClick={exportJSON}
                        title="Export JSON"
                    >
                        <FileUpIcon className="w-4 h-4" />
                    </DockIcon>
                </Dock>
            </Panel>

            <Panel position='top-right' className="!top-3 !right-3 flex items-center gap-3">
                <AnimatedThemeToggler />
                {/* Restored content and fixed button tag */}
                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => router.push("/auth/signin")}
                    >
                        Log In
                    </Button>
                </div>
            </Panel>

            <div className="flex-1">
                {/* Restored content */}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                    snapToGrid
                    snapGrid={[20, 20]}
                    panOnDrag={!canvasLock}
                    panOnScroll={!canvasLock}
                    zoomOnDoubleClick={!canvasLock}
                    nodesDraggable={!canvasLock}
                    nodesConnectable={!canvasLock}
                    elementsSelectable={!canvasLock}
                >
                    <MiniMap
                        pannable
                        zoomable
                        nodeColor={() => '#8884d8'}
                        maskColor="rgba(0,0,0,0.2)"
                        className="dark:bg-gray-800 dark:border-gray-700"
                        nodeStrokeWidth={3}
                    />
                    <Background />
                </ReactFlow>
            </div>

            <Toaster richColors />
        </div>
    );
}