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
            className="absolute z-[9999] bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 shadow-lg rounded-md p-3 transition-colors duration-300"
            style={{ top: y, left: x, transform: 'translate(-50%, -100%)' }}
        >
            <p className="text-xs font-semibold mb-2 text-center">Relationship</p>
            <div className="space-y-1">
                {types.map((type) => (
                    <Button
                        key={type}
                        variant={"outline"}
                        onClick={() => {
                            onSelect(type);
                            onClose();
                        }}
                        className="text-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded w-full text-left transition-colors duration-200"
                    >
                        {type}
                    </Button>
                ))}
            </div>
            <Button
                onClick={onClose}
                className="mt-2 text-xs text-white bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 w-full text-left transition-colors duration-200"
            >
                Cancel
            </Button>
        </div>
    )
}