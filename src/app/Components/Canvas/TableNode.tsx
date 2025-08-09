'use client'

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import { Field, TableNodeData } from "@/lib/types";
import { Checkbox } from "@/components/ui/checkbox";
import { PencilLine, Plus, Settings2, Trash2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type NodeProps = {
    id: string;
    data: TableNodeData;
}

const fieldTypes = [
    'INTEGER', 'STRING', 'TEXT', 'BOOLEAN', 'DATE', 'DATETIME',
    'FLOAT', 'DECIMAL', 'JSON', 'UUID', 'ENUM'
];

export default function TableNode({ id, data }: NodeProps) {
    const { fields, tableName } = data;
    const { setNodes } = useReactFlow();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        if (fields.length > 0) {
            const lastInput = document.querySelector(`#field-${fields[fields.length - 1].id}`);
            (lastInput as HTMLInputElement)?.focus();
        }
    }, [fields.length]);


    const updateNodeData = (newData: Partial<TableNodeData>) => {
        setNodes((nodes) =>
            nodes.map((node) => (
                node.id === id ? (
                    { ...node, data: { ...node.data, ...newData } }
                ) : (
                    node
                )
            ))
        );
    }

    const handleTableNameChange = (name: string) => {
        updateNodeData({ tableName: name })
    }

    const addField = () => {
        const newField: Field = {
            id: crypto.randomUUID(),
            name: '',
            type: 'INTEGER',
            isRequired: false,
            isUnique: false,
            isPrimary: false
        };

        updateNodeData({ fields: [...fields, newField] });
    }

    const updateField = (fieldId: string, changes: Partial<Field>) => {
        const updatedFields = fields.map((field) => (
            field.id === fieldId ? { ...field, ...changes } : field
        ));

        updateNodeData({ fields: updatedFields });
    }

    const deleteField = (fieldId: string) => {
        updateNodeData({ fields: fields.filter((field) => field.id !== fieldId) });
    }

    return (
        <div className="rounded-md border border-blue-300 bg-white dark:bg-gray-800 dark:border-blue-700 w-[380px] shadow-md text-sm relative overflow-hidden transition-colors duration-300">
            <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900 px-4 py-3 border-b border-blue-200 dark:border-blue-700 font-semibold text-gray-800 dark:text-gray-200 group transition-colors duration-300">
                {isEditing ? (
                    <input
                        autoFocus
                        value={tableName}
                        onChange={(e) => handleTableNameChange(e.target.value)}
                        onBlur={() => setIsEditing(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditing(false)}
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                    />
                ) : (
                    <>
                        <span className="truncate max-w-[300px]">{tableName}</span>
                        <PencilLine
                            className="w-4 h-4 text-gray-800 dark:text-gray-200 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-2 shrink-0"
                            onClick={() => setIsEditing(true)}
                        />
                    </>
                )}
            </div>
            <div className="px-3 py-2 space-y-2">
                {fields.map((field) => (
                    <div
                        key={field.id}
                        className="relative flex items-center gap-2 bg-gray-50 dark:bg-gray-700 rounded-md p-2 group hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
                    >
                        {/* Left handle */}
                        <Handle
                            type="target"
                            id={field.id}
                            position={Position.Left}
                            style={{
                                top: '50%',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#3B82F6',
                                transform: 'translateY(-50%)'
                            }}
                        />

                        <input
                            id={`field-${field.id}`}
                            value={field.name}
                            placeholder="field"
                            onChange={(e) => updateField(field.id, { name: e.target.value })}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                        />

                        <div className="flex gap-1 text-xs font-semibold text-white">
                            {field.isPrimary && (
                                <span title="Primary" className="bg-blue-500 px-1 rounded">PK</span>
                            )}
                            {field.isForeign && (
                                <span className="bg-yellow-500 px-1 rounded">FK</span>
                            )}
                            {field.relationType && (
                                <span className="bg-green-500 px-1 rounded">{field.relationType}</span>
                            )}
                        </div>

                        <select
                            id={`type-${field.id}`}
                            value={field.type}
                            className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100"
                            onChange={(e) => updateField(field.id, { type: e.target.value })}
                        >
                            {fieldTypes.map((type) => (
                                <option key={type} value={type} >{type}</option>
                            ))}
                        </select>

                        <div className="ml-auto flex items-center gap-1">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"ghost"} size={"icon"}>
                                        <Settings2 className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="required"
                                                checked={field.isRequired}
                                                onCheckedChange={(val) => updateField(field.id, { isRequired: !!val })}
                                            />
                                            <Label htmlFor="required">Required</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="unique"
                                                checked={field.isUnique}
                                                onCheckedChange={(val) => updateField(field.id, { isUnique: !!val })}
                                            />
                                            <Label htmlFor="unique">Unique</Label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Checkbox
                                                id="primary"
                                                checked={field.isPrimary}
                                                onCheckedChange={(val) => updateField(field.id, { isPrimary: !!val })}
                                            />
                                            <Label htmlFor="primary">Primary Key</Label>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <Trash2
                                className="w-5 h-5 text-gray-700 dark:text-gray-300 cursor-pointer opacity-0 group-hover:opacity-100 transition duration-150"
                                onClick={() => deleteField(field.id)}
                            />
                        </div>

                        {/* Right handle */}
                        <Handle
                            type="source"
                            id={field.id}
                            position={Position.Right}
                            style={{
                                top: '50%',
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                background: '#3B82F6',
                                transform: 'translateY(-50%)'
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="px-3 py-2">
                <Button
                    variant={"ghost"}
                    onClick={addField}
                    className="w-full text-left font-medium text-sm flex items-center gap-2 text-gray-500 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                    <Plus className="w-4 h-4" />
                    Add Field
                </Button>
            </div>
        </div>
    )
}