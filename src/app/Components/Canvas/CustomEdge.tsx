import { RelationshipType } from "@/lib/types";
import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps } from "@xyflow/react";
import { useEffect, useState } from "react";

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    data,
    markerEnd
}: EdgeProps) {
    const [isDark, setIsDark] = useState(false);
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        targetX,
        targetY
    });

    useEffect(() => {
        setIsDark(document.documentElement.classList.contains('dark'));
    }, []);

    const handleLabelClick = (e: React.MouseEvent) => {
        const rect = (e.target as HTMLDivElement).getBoundingClientRect();

        window.dispatchEvent(
            new CustomEvent('edit-relationship', {
                detail: {
                    edgeId: id,
                    position: { x: rect.left + rect.width / 2, y: rect.top }
                }
            })
        );
    };


    const relationship = (data?.relationship as RelationshipType) || '1:1';

    return (
        <>
            <BaseEdge path={edgePath} markerEnd={markerEnd} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all'
                    }}
                >
                    <div
                        onClick={handleLabelClick}
                        title="Click to edit relationship"
                        aria-label="Relationship label"
                        style={{
                            background: isDark ? '#1f2937' : 'white',
                            color: isDark ? '#d1d5db' : 'black',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            border: isDark ? '1px solid #374151' : '1px solid #ccc'
                        }}
                    >
                        {relationship}
                    </div>
                </div>
            </EdgeLabelRenderer>
        </>
    )
}