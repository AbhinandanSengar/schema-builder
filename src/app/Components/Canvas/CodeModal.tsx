'use client';

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axios from "axios";
import { Copy, Check, AlertTriangle, Loader2 } from "lucide-react"; // Added Loader2
import { useState } from "react";
import { toast } from "sonner";

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
    // --- State Improvements ---
    const [isGeneratingCode, setIsGeneratingCode] = useState<boolean>(false);
    const [isGeneratingData, setIsGeneratingData] = useState<boolean>(false);
    const [generateError, setGenerateError] = useState<string | null>(null);
    const [sampleDataError, setSampleDataError] = useState<string | null>(null);
    // --- End State Improvements ---

    const [format, setFormat] = useState<string>(FORMATS[0].value);
    const [sampleData, setSampleData] = useState<string | null>(null);
    const [generatedCode, setGeneratedCode] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<string>("code");

    const handleOnClose = () => {
        onClose();
        setTimeout(() => {
            setIsGeneratingCode(false); // Reset new state
            setIsGeneratingData(false); // Reset new state
            setGenerateError(null);
            setSampleDataError(null);
            setSampleData(null);
            setGeneratedCode(null);
            setIsCopied(false);
            setActiveTab("code");
        }, 200);
    }

    const handleGenerate = async () => {
        setIsGeneratingCode(true); // Use specific state
        setGeneratedCode(null);
        setSampleData(null);
        setGenerateError(null);
        setSampleDataError(null);
        setActiveTab("code");

        try {
            const code = await onGenerate(format);
            setGeneratedCode(code);
        } catch (error) {
            setGenerateError("Failed to generate code! Check console for details.");
            console.error("Code generation error:", error);
        } finally {
            setIsGeneratingCode(false); // Use specific state
        }
    }

    const handleGenerateData = async (count: number) => {
        try {
            setIsGeneratingData(true); // Use specific state
            setSampleDataError(null);
            setSampleData(null); // Clear old data first
            const res = await axios.post("/api/generate-data", {
                schema: generatedCode,
                format,
                count
            });
            setSampleData(res.data.data);
            setActiveTab("data");
        } catch (err) {
            console.error("Sample data error:", err);
            setSampleDataError("Failed to generate sample data. Check console for details.");
            setActiveTab("data");
        } finally {
            setIsGeneratingData(false); // Use specific state
        }
    };

    const handleCopy = async () => {
        const textToCopy = (activeTab === "data" && sampleData) ? sampleData : generatedCode;
        if (!textToCopy) return;

        try {
            await navigator.clipboard.writeText(textToCopy);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text', err);
            toast.error('Failed to copy to clipboard');
        }
    }

    const isLoading = isGeneratingCode || isGeneratingData;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleOnClose()}>

            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Generate Schema Code</DialogTitle>
                </DialogHeader>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 px-6 pt-4">
                    <div className="grid gap-1.5 w-full sm:w-[180px]">
                        <label htmlFor="format" className="text-sm font-medium">Format</label>
                        <Select value={format} onValueChange={setFormat} disabled={isLoading}>
                            <SelectTrigger id="format">
                                <SelectValue placeholder="Select format" />
                            </SelectTrigger>
                            <SelectContent>
                                {FORMATS.map((f) => (
                                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button onClick={handleGenerate} disabled={isLoading} className="w-full sm:w-auto">
                        {isGeneratingCode && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isGeneratingCode ? "Generating..." : "Generate Code"}
                    </Button>
                </div>

                <div className="h-px rounded-full w-full bg-gray-300 dark:bg-gray-500" />

                <div className="px-6 py-4 min-h-[400px]">
                    {!generatedCode && !isGeneratingCode && !generateError && (
                        <div className="flex flex-col items-center justify-center h-full min-h-[360px] rounded-lg border border-dashed text-center">
                            <div className="text-muted-foreground">
                                <p className="text-sm">Select a format and click &quot;Generate Code&quot; to begin.</p>
                            </div>
                        </div>
                    )}

                    {isGeneratingCode && (
                        <div className="flex items-center justify-center h-full min-h-[360px] text-muted-foreground">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            <p>Generating code...</p>
                        </div>
                    )}

                    {generateError && !isGeneratingCode && (
                        <div className="flex items-center justify-center h-full min-h-[360px]">
                            <Alert variant="destructive" className="max-w-md">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{generateError}</AlertDescription>
                            </Alert>
                        </div>
                    )}

                    {generatedCode && !isGeneratingCode && (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="code">Generated Code</TabsTrigger>
                                <TabsTrigger value="data" disabled={!sampleData && !sampleDataError}>
                                    Sample Data
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="code" className="mt-4">
                                <div className="relative">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-7 w-7 p-0 z-10"
                                        onClick={handleCopy}
                                        aria-label="Copy code"
                                    >
                                        {isCopied && activeTab === 'code' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Textarea
                                        readOnly
                                        value={generatedCode}
                                        className="font-mono text-sm w-full h-72 overflow-y-auto resize-none"
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button
                                        variant="secondary"
                                        onClick={() => handleGenerateData(20)}
                                        disabled={isLoading}
                                    >
                                        {isGeneratingData && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {isGeneratingData ? "Generating..." : "Generate Sample Data"}
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="data" className="mt-4">
                                {sampleDataError && (
                                    <Alert variant="destructive" className="my-4">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertDescription>{sampleDataError}</AlertDescription>
                                    </Alert>
                                )}
                                <div className="relative">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="absolute top-2 right-2 h-7 w-7 p-0 z-10"
                                        onClick={handleCopy}
                                        aria-label="Copy data"
                                    >
                                        {isCopied && activeTab === 'data' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </Button>
                                    <Textarea
                                        readOnly
                                        value={sampleData || "Click 'Generate Sample Data' to see results."}
                                        className="font-mono text-sm w-full h-72 overflow-y-auto resize-none"
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" onClick={handleOnClose}>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
