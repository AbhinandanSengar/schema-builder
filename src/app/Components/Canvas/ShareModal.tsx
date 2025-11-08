import React, { useState, useEffect } from 'react';
import { Copy, Download, Image, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface ShareModalProps {
    isOpen: boolean;
    onClose: () => void;
    projectId: string;
    projectName: string;
    nodes: any[];
    edges: any[];
}

export default function ShareModal({ isOpen, onClose, projectId, projectName, nodes, edges }: ShareModalProps) {
    const [shareLink, setShareLink] = useState<string>('');
    const [loadingShareLink, setLoadingShareLink] = useState(false);
    const [linkGenerated, setLinkGenerated] = useState(false);

    // Generate public share link on modal open
    useEffect(() => {
        if (isOpen && !linkGenerated) {
            generateShareLink();
        }
    }, [isOpen, linkGenerated]);

    const generateShareLink = async () => {
        setLoadingShareLink(true);
        try {
            const response = await axios.post(`/api/projects/${projectId}/share`);
            const data = response.data;
            const link = `${window.location.origin}/project/share/${data.shareToken}`;
            setShareLink(link);
            setLinkGenerated(true);
            toast.success('Share link generated!');
        } catch (error) {
            toast.error('Failed to generate share link');
            console.error(error);
        } finally {
            setLoadingShareLink(false);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            toast.success('Link copied to clipboard!');
        } catch (error) {
            toast.error('Failed to copy link');
        }
    };

    const exportAsImage = async () => {
        try {
            const html2canvas = (await import('html2canvas-pro')).default;
            const canvas = document.querySelector('[data-testid="rf-canvas"]') as HTMLElement;

            if (!canvas) {
                toast.error('Canvas not found');
                return;
            }

            const canvasImage = await html2canvas(canvas, {
                backgroundColor: '#ffffff',
                scale: 2,
            });

            const link = document.createElement('a');
            link.href = canvasImage.toDataURL('image/png');
            link.download = `${projectName}.png`;
            link.click();
            toast.success('Schema exported as PNG image!');
        } catch (error) {
            toast.error('Failed to export as PNG image');
            console.error(error);
        }
    };

    const exportAsJSON = async () => {
        try {
            const schemaData = {
                projectName,
                nodes,
                edges,
                exportedAt: new Date().toISOString(),
            };

            const dataStr = JSON.stringify(schemaData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `${projectName}-schema.json`;
            link.click();

            URL.revokeObjectURL(url);
            toast.success('Schema exported as JSON!');
        } catch (error) {
            toast.error('Failed to export as JSON');
            console.error(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Share Schema
                    </h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-8 w-8"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Share Link Section */}
                    <div>
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                            Public Share Link
                        </h3>

                        {loadingShareLink ? (
                            <div className="flex items-center justify-center py-3">
                                <Loader2 size={18} className="text-blue-600 animate-spin" />
                            </div>
                        ) : shareLink ? (
                            <div className="space-y-2">
                            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                    <input
                                        type="text"
                                        value={shareLink}
                                        readOnly
                                        className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none truncate"
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={copyToClipboard}
                                        className="h-8 w-8"
                                        title="Copy to clipboard"
                                    >
                                        <Copy size={18} />
                                    </Button>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    Anyone with this link can view your schema
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {/* Export Options */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            Export As
                        </h3>

                        {/* Export as Image */}
                        <Button
                            variant="outline"
                            onClick={exportAsImage}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left justify-start h-auto"
                        >
                            <Image size={18} className="flex-shrink-0" />
                            <div className="flex-1">
                                <div className="font-medium text-slate-900 dark:text-white text-sm">Image (PNG)</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Export as high-quality image</div>
                            </div>
                            <Download size={16} className="flex-shrink-0" />
                        </Button>

                        {/* Export as JSON */}
                        <Button
                            variant="outline"
                            onClick={exportAsJSON}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left justify-start h-auto"
                        >
                            <Download size={18} className="flex-shrink-0" />
                            <div className="flex-1">
                                <div className="font-medium text-slate-900 dark:text-white text-sm">JSON File</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">Export in JSON format</div>
                            </div>
                            <Download size={16} className="flex-shrink-0" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};