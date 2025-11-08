'use client';
import { Button } from "@/components/ui/button";
import { RelationshipType } from "@/lib/types";

type RelationshipProps = {
    x: number;
    y: number;
    onSelect: (type: RelationshipType) => void;
    onClose: () => void;
}

export default function RelationshipModal({ x, y, onSelect, onClose }: RelationshipProps) {
    const types: RelationshipType[] = ['1:1', '1:N', 'N:N'];

    return (
        <div
            className="absolute z-[9999] w-28 bg-background border shadow-lg rounded-md p-3"
            style={{ top: y, left: x, transform: 'translate(-50%, -100%)' }}
        >
            <p className="text-xs font-semibold mb-2 text-center">Relationship</p>
            <div className="space-y-1">
                {types.map((type) => (
                    <Button
                        key={type}
                        variant={"outline"}
                        size="sm"
                        onClick={() => {
                            onSelect(type);
                            onClose();
                        }}
                        className="w-full justify-start"
                    >
                        {type}
                    </Button>
                ))}
            </div>
            <Button
                variant="destructive"
                size="sm"
                onClick={onClose}
                className="w-full mt-2"
            >
                Cancel
            </Button>
        </div>
    )
}