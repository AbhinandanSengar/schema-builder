'use client';

import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";

type GenerateCodeProps = {
    isOpen: boolean;
    onClose: () => void;
    onGenerate: (format: string) => Promise<string>
}

const FORMATS = [
    { label: 'SQL', value: 'sql' },
    { label: 'Prisma', value: 'prisma' },
    { label: 'MongoDB', value: 'mongodb' }
]

export default function CodeModal({ isOpen, onClose, onGenerate }: GenerateCodeProps) {
    const [loading, setLoading] = useState<boolean>(false);
    const [format, setFormat] = useState<string>(FORMATS[0].value);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen)
        return null;

    const handleGenerate = async () => {
        setLoading(true);
        setGeneratedCode(null);
        setError(null);

        try {
            const code = await onGenerate(format);
            setGeneratedCode(code);
        } catch (error) {
            setError("Failed to generate code!")
        } finally {
            setLoading(false);
        }
    }

    const handleCopy = () => {
        if (generatedCode) {
            navigator.clipboard.writeText(generatedCode);
            alert("Copied to clipboard");
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-md p-6 max-w-xl w-full text-gray-900 dark:text-gray-100 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Generate Code</h2>

                <label htmlFor="format" className="block mb-1 font-medium">Select Format:</label>
                <select
                    id="format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full mb-4 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                    {FORMATS.map((f) => (
                        <option key={f.value} value={f.value}>{f.label}</option>
                    ))}
                </select>

                <div className="flex gap-3 mb-4">
                    <Button onClick={handleGenerate} disabled={loading}>
                        {loading ? "Generating..." : "Generate"}
                    </Button>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                </div>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {generatedCode && (
                    <>
                        <label className="block mb-1 font-medium">Generated Code:</label>
                        <textarea
                            readOnly
                            rows={12}
                            value={generatedCode}
                            className="w-full p-2 border rounded font-mono text-sm dark:bg-gray-700 dark:border-gray-600"
                        />
                        <div className="mt-2 flex justify-end cursor-pointer">
                            <Button size="sm" onClick={handleCopy}>
                                <Copy className="w-4 h-4" />
                                Copy to Clipboard
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}