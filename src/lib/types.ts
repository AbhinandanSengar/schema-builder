import { Node, Edge } from "@xyflow/react";

export type RelationshipType = '1:1' | '1:N' | 'N:N';

export type Field = {
    id: string;
    name: string;
    type: string;
    isRequired?: boolean;
    isUnique?: boolean;
    isPrimary?: boolean;
    isForeign?: boolean;
    foreignRef?: { nodeId: string; fieldId: string };
    relationType?: RelationshipType;
}

export type TableNodeData = {
    tableName: string;
    fields: Field[];
    primaryKeys?: string[];
}

export type ProjectSchema = {
    nodes: Node<TableNodeData>[];
    edges: Edge[];
}

export type Project = {
    id: string;
    name: string;
    description?: string;
    isPublic?: boolean;
    schema: ProjectSchema;
}
