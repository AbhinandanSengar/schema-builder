'use client';

import { useEffect, useRef, useState } from "react";
import {
    Node,
    Edge,
    ReactFlow,
    useEdgesState,
    useNodesState,
    Connection,
    EdgeChange,
    Background,
    MiniMap
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';

import axios from "axios";
import { toast } from 'sonner';
import TableNode from "./TableNode";
import CodeModal from "./CodeModal";
import CustomEdge from "./CustomEdge";
import CanvasToolbar from "./CanvasToolbar";
import RelationshipModal from "./RelationshipModal";
import { Toaster } from "@/components/ui/sonner";
import { Project, ProjectSchema, RelationshipType, TableNodeData } from "@/lib/types";

interface CanvasProps {
    projectId: string;
}

const nodeTypes = {
    'custom': TableNode
}

const edgeTypes = {
    'custom-edge': CustomEdge
}

const initialNodes: Node<TableNodeData>[] = [];
const initialEdges: Edge[] = [];

export default function Canvas({ projectId }: CanvasProps) {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [canvasLock, setCanvasLock] = useState<boolean>(false);
    const [project, setProject] = useState<Project | null>(null);
    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [schema, setSchema] = useState<ProjectSchema | null>(null);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [editorPosition, setEditorPosition] = useState<{ x: number; y: number } | null>(null);

    const loadedRef = useRef(false);

    useEffect(() => {
        const handleEditRelationship = (e: Event) => {
            const customEvent = e as CustomEvent;
            setSelectedEdgeId(customEvent.detail.edgeId);
            setEditorPosition(customEvent.detail.position);
        }

        window.addEventListener('edit-relationship', handleEditRelationship);

        return () => window.removeEventListener('edit-relationship', handleEditRelationship);
    }, [selectedEdgeId, editorPosition]);

    useEffect(() => {
        loadedRef.current = false;
        async function fetchProject() {
            try {
                const { data } = await axios.get(`/api/projects/${projectId}`);
                if (data.project) {
                    const sanitizedNodes = ((data.project.schema.nodes ?? []) as Node<TableNodeData>[]).map((node) => ({
                        ...node,
                        position: node.position ?? { x: 0, y: 0 },
                    }));
                    const sanitizedEdges = ((data.project.schema?.edges ?? []) as Edge[]).map((edge) => ({
                        ...edge
                    }));

                    setProject(data.project);
                    setSchema(data.project.schema);
                    setNodes(sanitizedNodes);
                    setEdges(sanitizedEdges);

                    if (!loadedRef.current) {
                        toast(`Project "${data.project.name}" loaded successfully!`);
                        loadedRef.current = true;
                    }
                }
            } catch (error) {
                console.error('Failed to fetch project:', error);
                toast.error("Failed to load project. Please try again.");
            }
        }

        fetchProject();
    }, [projectId, setNodes, setEdges]);

    const updateRelationshipType = (type: RelationshipType) => {
        try {
            setEdges((edges) =>
                edges.map((edge) =>
                    edge.id === selectedEdgeId
                        ? { ...edge, data: { ...edge.data, relationship: type } }
                        : edge
                )
            );

            setNodes((nodes) => {
                const edge = edges.find((e) => e.id === selectedEdgeId);
                if (!edge || !edge.target || !edge.targetHandle) return nodes;

                return nodes.map((node) => {
                    if (node.id === edge.target) {
                        return {
                            ...node,
                            data: {
                                ...node.data,
                                fields: node.data.fields.map((field) =>
                                    field.id === edge.targetHandle
                                        ? { ...field, relationType: type }
                                        : field
                                )
                            }
                        };
                    }
                    return node;
                });
            });

            setSelectedEdgeId(null);
            setEditorPosition(null);
            toast(`Relationship updated to ${type}`);
        } catch (error: unknown) {
            toast.error("Failed to update relationship", {
                description: error instanceof Error ? error.message : "Unknown error"
            });
            console.error("Failed to update relationship:", error);
        }
    };

    function onConnect(connection: Connection) {
        const edgeId = crypto.randomUUID();
        const newEdge: Edge = {
            ...connection,
            id: edgeId,
            type: 'custom-edge',
            data: {
                relationship: '1:1'
            }
        };

        // const sourceNodeId = connection.source!;
        const targetNodeId = connection.target!;
        // const sourceFieldId = connection.sourceHandle!;
        const targetFieldId = connection.targetHandle!;

        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === targetNodeId) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            fields: node.data.fields.map((field) =>
                                field.id === targetFieldId
                                    ? {
                                        ...field,
                                        isForeign: true,
                                        relationType: '1:1'
                                    }
                                    : field
                            )
                        }
                    };
                }
                return node;
            })
        );

        setEdges((eds) => [...eds, newEdge]);
    }

    function handleEdgesChange(changes: EdgeChange[]) {
        const removedEdges = changes.filter((c) => c.type === "remove");

        if (removedEdges.length > 0) {
            setNodes((prevNodes) => {
                return prevNodes.map((node) => {
                    const updatedFields = node.data.fields.map((field) => {
                        const isTarget = removedEdges.some((change) => {
                            const edge = edges.find((e) => e.id === change.id);
                            return (
                                edge &&
                                edge.target === node.id &&
                                edge.targetHandle === field.id
                            );
                        });

                        return isTarget
                            ? {
                                ...field,
                                isForeign: false,
                                relationType: undefined,
                            }
                            : field;
                    });

                    return {
                        ...node,
                        data: {
                            ...node.data,
                            fields: updatedFields,
                        },
                    };
                });
            });
        }

        onEdgesChange(changes);
    }

    function addTable() {
        try {
            const newNode: Node<TableNodeData> = {
                id: crypto.randomUUID(),
                type: "custom",
                position: { x: Math.random() * 300 + 500, y: Math.random() * 650 },
                data: {
                    tableName: "New Table",
                    fields: [],
                },
            };
            setNodes((prev) => [...prev, newNode]);
            toast("New table added");
        } catch (error: unknown) {
            toast.error("Failed to add new table", {
                description: error instanceof Error ? error.message : "Unknown error"
            });
            console.error("Failed to add new table:", error);
        }
    }

    function exportJSON() {
        const dataToExport = {
            nodes: nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data,
            })),
            edges: edges.map((edge) => ({
                id: edge.id,
                source: edge.source,
                target: edge.target,
                sourceHandle: edge.sourceHandle,
                targetHandle: edge.targetHandle,
                type: edge.type,
                data: edge.data,
            })),
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

    function importJSON() {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "application/json";

        input.onchange = async (e: Event) => {
            const target = e.target;
            if (!(target instanceof HTMLInputElement))
                return;

            const file = target.files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const parsed = JSON.parse(text);

                if (!parsed.nodes || !parsed.edges) {
                    toast.error("Invalid file format");
                    console.error("Invalid file format");
                    return;
                }

                setNodes(parsed.nodes);
                setEdges(parsed.edges);
                toast("Schema imported successfully");
            } catch (error: unknown) {
                toast.error("Failed to import schema", {
                    description: error instanceof Error ? error.message : "Unknown error"
                });
                console.error("Failed to import schema:", error);
            }
        };

        input.click();
    }

    async function saveSchema() {
        try {
            const updatedSchema: ProjectSchema = {
                nodes: nodes.map((node) => ({
                    id: node.id,
                    position: node.position,
                    data: {
                        tableName: node.data.tableName,
                        fields: node.data.fields,
                        primaryKeys: node.data.fields
                            .filter((field) => field.isPrimary)
                            .map((field) => field.id),
                    },
                    type: node.type,
                    width: node.width,
                    height: node.height,
                    selected: node.selected,
                    dragging: node.dragging,
                })),
                edges: edges.map((edge) => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target,
                    sourceHandle: edge.sourceHandle,
                    targetHandle: edge.targetHandle,
                    type: edge.type,
                    data: edge.data,
                    animated: edge.animated,
                    selected: edge.selected,
                })),
            };

            const response = await axios.patch(`/api/projects/${projectId}`, {
                schema: updatedSchema,
            });

            if (response.status === 200) {
                toast("Schema saved successfully!");
                console.log("Schema saved:", response.data);
            }
        } catch (error: unknown) {
            toast.error("Failed to save schema", {
                description: error instanceof Error ? error.message : "Unknown error"
            });
            console.error("Failed to save schema:", error);
        }
    }

    async function generateCodeHandler(format: string): Promise<string> {
        const nodeIdToTableName = new Map<string, string>();
        nodes.forEach((node) => {
            nodeIdToTableName.set(node.id, node.data.tableName)
        });

        const isMongo = format.toLowerCase() === "mongodb";

        const mapTypeToMongoose = (type: string) => {
            switch (type.toLowerCase()) {
                case "uuid":
                case "objectid":
                    return "Schema.Types.ObjectId";
                case "string":
                case "varchar":
                case "text":
                    return "String";
                case "int":
                case "integer":
                case "number":
                    return "Number";
                case "boolean":
                case "bool":
                    return "Boolean";
                case "date":
                    return "Date";
                default:
                    return "Schema.Types.Mixed";
            }
        };

        const schema = {
            tables: nodes.map((node) => ({
                name: node.data.tableName,
                columns: node.data.fields
                    .filter((field) => (
                        isMongo ? field.name.toLowerCase() !== 'id' : true
                    ))
                    .map((field) => {
                        const base = {
                            name: field.name,
                            isPrimary: field.isPrimary,
                            isUnique: field.isUnique,
                            isRequired: field.isRequired,
                        };

                        if (isMongo) {
                            if (field.isForeign && field.foreignRef?.nodeId) {
                                const refTableName = nodeIdToTableName.get(field.foreignRef.nodeId);
                                return {
                                    ...base,
                                    type: "Schema.Types.ObjectId",
                                    ref: refTableName || undefined,
                                };
                            }

                            return {
                                ...base,
                                type: mapTypeToMongoose(field.type),
                            };
                        }

                        return {
                            ...base,
                            type: field.type,
                        };
                    }),
            })),
        };

        try {
            const response = await fetch("/api/generate-code", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ schema, format }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate code");
            }

            toast.success(`Code generated in ${format} format`);
            console.log("Generated code:", data.code);
            return data.code;
        } catch (error: unknown) {
            toast.error("Code generate error", {
                description: `Failed to generate code`,
            });
            return "Failed to generate code: " + (error instanceof Error ? error.message : "Unknown error");
        }
    }

    return (
        <div className="flex flex-col h-[100vh] overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="flex flex-col flex-1 transition-all duration-300 bg-white dark:bg-gray-900">
                <CanvasToolbar
                    project={project}
                    addTable={addTable}
                    exportJSON={exportJSON}
                    importJSON={importJSON}
                    generateCode={() => setIsCodeModalOpen(true)}
                    saveSchema={saveSchema}
                    canvasLock={canvasLock}
                    handleCanvasMove={() => setCanvasLock(!canvasLock)}
                />
                <CodeModal
                    isOpen={isCodeModalOpen}
                    onClose={() => setIsCodeModalOpen(false)}
                    onGenerate={generateCodeHandler}
                />
                <div className="flex-1">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={handleEdgesChange}
                        onConnect={onConnect}
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
                        data-testid="rf-canvas"
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
            </div>

            {selectedEdgeId && editorPosition && (
                <RelationshipModal
                    x={editorPosition.x}
                    y={editorPosition.y}
                    onSelect={updateRelationshipType}
                    onClose={() => {
                        setSelectedEdgeId(null)
                        setEditorPosition(null)
                    }}
                />
            )}

            <Toaster richColors />
        </div>
    )
}
