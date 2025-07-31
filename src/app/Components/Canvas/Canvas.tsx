'use client';

import {
    Node,
    Edge,
    ReactFlow,
    useEdgesState,
    useNodesState,
    Connection,
    EdgeChange,
    Background,
    MiniMap,
    Controls,
} from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { useEffect, useState } from "react";
import TableNode from "./TableNode";
import CustomEdge from "./CustomEdge";
import { RelationshipType, TableNodeData } from "@/lib/types";
import CanvasToolbar from "./CanvasToolbar";
import RelationshipModal from "./RelationshipModal";
import GenerateCode from "./GenerateCode";

const nodeTypes = {
    'custom': TableNode
}

const edgeTypes = {
    'custom-edge': CustomEdge
}

const initialNodes: Node<TableNodeData>[] = [];
const initialEdges: Edge[] = [];

export default function Canvas() {
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [editorPosition, setEditorPosition] = useState<{ x: number; y: number } | null>(null);

    useEffect(() => {
        const handleEditRelationship = (e: Event) => {
            const customEvent = e as CustomEvent;
            setSelectedEdgeId(customEvent.detail.edgeId);
            setEditorPosition(customEvent.detail.position);
        }

        window.addEventListener('edit-relationship', handleEditRelationship);

        return () => window.removeEventListener('edit-relationship', handleEditRelationship);
    }, []);

    const updateRelationshipType = (type: RelationshipType) => {
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

        const sourceNodeId = connection.source!;
        const targetNodeId = connection.target!;
        const sourceFieldId = connection.sourceHandle!;
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
        const newNode: Node<TableNodeData> = {
            id: crypto.randomUUID(),
            type: "custom",
            position: { x: Math.random() * 300 + 100, y: Math.random() * 500 },
            data: {
                tableName: "New Table",
                fields: [],
            },
        };
        setNodes((prev) => [...prev, newNode]);
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
                    alert("Invalid file format.");
                    return;
                }

                setNodes(parsed.nodes);
                setEdges(parsed.edges);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    alert("Failed to import schema: " + error.message);
                } else {
                    alert("Failed to import schema due to unknown error.");
                }
            }
        };

        input.click();
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

            return data.code;
        } catch (error: unknown) {
            if (error instanceof Error) {
                return `Error: ${error.message}`;
            } else {
                return "An unknown error occurred while generating code.";
            }
        }
    }

    return (
        <div className="flex h-[calc(100vh-56px)] overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
            <div className="flex flex-col flex-1 transition-all duration-300 bg-white dark:bg-gray-900">
                <CanvasToolbar
                    addTable={addTable}
                    exportJSON={exportJSON}
                    importJSON={importJSON}
                    generateCode={() => setIsCodeModalOpen(true)}
                />
                <GenerateCode
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
                    >
                        <MiniMap
                            pannable
                            zoomable
                            nodeColor={() => '#8884d8'}
                            maskColor="rgba(0,0,0,0.2)"
                            className="dark:bg-gray-800 dark:border-gray-700"
                            nodeStrokeWidth={3}
                        />
                        <Controls
                            className="bg-gray-800 text-gray-500 rounded-md shadow-md"
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
        </div>
    )
}