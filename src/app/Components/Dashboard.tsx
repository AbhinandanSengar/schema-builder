'use client';

import React, { useState, useEffect } from 'react';
import {
    Plus,
    Database,
    Clock,
    Users,
    MoreHorizontal,
    Download,
    Share2,
    Trash2,
    Copy,
    CheckCircle,
    PencilLine
} from 'lucide-react';

import axios from 'axios';
import Header from './Header';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Project {
    id: string;
    name: string;
    description: string;
    lastModified: string;
    collaborators: number;
    tables: number;
}

export default function Dashboard() {
    const router = useRouter();
    const [showNewProjectModal, setShowNewProjectModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedProjectForShare, setSelectedProjectForShare] = useState<Project | null>(null);
    const [shareRole, setShareRole] = useState<string>('viewer');
    const [shareLink] = useState('https://schema-builder.app/project/shared/');
    const [linkCopied, setLinkCopied] = useState(false);
    const [activeProjectMenu, setActiveProjectMenu] = useState<string | null>(null);
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectDescription, setNewProjectDescription] = useState('');
    const [loading, setLoading] = useState<boolean>(true);

    const [projects, setProjects] = useState<Project[]>([]);

    const handleProjectOpen = (projectId: string) => {
        router.push(`/project/${projectId}`);
    };

    const handleCreateProject = async () => {
        if (!newProjectName.trim()) {
            toast.error("Project name is required");
            return;
        }

        try {
            const response = await axios.post("/api/projects", {
                name: newProjectName,
                description: newProjectDescription,
                schema: {},
                isPublic: false
            });

            const { project } = response.data;

            setProjects(prev => [
                ...prev,
                {
                    id: project.id,
                    name: project.name,
                    description: project.description || '',
                    lastModified: "just now",
                    collaborators: 1,
                    tables: 0
                }
            ]);

            toast.success("Project created successfully", {
                description: `"${newProjectName}" has been added to your projects.`,
            });

            setNewProjectName('');
            setNewProjectDescription('');
            setShowNewProjectModal(false);
        } catch (error) {
            console.error("Error creating project:", error);
            toast.error("Failed to create project", {
                description: "Something went wrong. Please try again.",
            });
        }
    };

    const handleModalClose = () => {
        setShowNewProjectModal(false);
        setNewProjectName('');
        setNewProjectDescription('');
    };

    const handleProjectMenuToggle = (projectId: string) => {
        setActiveProjectMenu(activeProjectMenu === projectId ? null : projectId);
    };

    const handleProjectAction = async (action: string, projectId: string) => {
        const project = projects.find(p => p.id === projectId);
        setActiveProjectMenu(null);

        if (!project) {
            toast.error("Project not found");
            return;
        }

        if (action === 'download') {
            toast("Download started", {
                description: `Downloading ${project?.name} schema as JSON...`,
            });
        } else if (action === 'share') {
            setSelectedProjectForShare(project || null);
            setShowShareModal(true);
        } else if (action === 'trash') {
            try {
                await axios.delete(`/api/projects/${projectId}`);
                setProjects(prev => prev.filter(p => p.id !== projectId));
                toast.success("Project moved to trash", {
                    description: `${project?.name} has been moved to trash.`,
                });
            } catch (error: unknown) {
                console.error("Error deleting project:", error);
                toast.error("Delete failed", {
                    description: `${project?.name} has not been deleted.`,
                });
            }
        } else if (action === 'edit') {
            try {
                const { data } = await axios.patch(`/api/projects/${projectId}`, {
                    name: project.name
                });
                setProjects(prev => prev.map(p => p.id === projectId ? data.project : p));
                toast.success("Project updated", {
                    description: `${project?.name} has been updated.`,
                });
            } catch (error: unknown) {
                console.error("Error updating project:", error);
                toast.error("Update failed", {
                    description: `Failed to update ${project?.name}.`,
                });
            }
        }
    };

    const handleCopyLink = async () => {
        const fullLink = `${shareLink}${selectedProjectForShare?.id}`;
        try {
            await navigator.clipboard.writeText(fullLink);
            setLinkCopied(true);
            toast("Link copied!", {
                description: "Share link has been copied to clipboard.",
            });
            setTimeout(() => setLinkCopied(false), 2000);
        } catch (error: unknown) {
            toast("Failed to copy link", {
                description: "Please copy the link manually.",
            });
            console.error("Failed to copy link:", error);
        }
    };

    const handleShareModalClose = () => {
        setShowShareModal(false);
        setSelectedProjectForShare(null);
        setShareRole('viewer');
        setLinkCopied(false);
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Element;
            if (!target.closest('.project-menu') && !target.closest('.project-menu-button')) {
                setActiveProjectMenu(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/projects");
                if (!res.ok)
                    throw new Error("Failed to fetch projects");

                const data = await res.json();
                setProjects(data.projects || []);

                toast.success("Projects loaded successfully", {
                    description: `${data.projects.length} projects found.`,
                });
            } catch (error: unknown) {
                console.error(error);
                toast.error("Failed to load projects", {
                    description: "Please try again later.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return <p className='text-muted-foreground text-center mt-10'>
            Loading...
        </p>;
    }

    return (
        <div className="min-h-screen bg-background transition-colors duration-200">
            {/* Navigation Bar */}
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-semibold text-card-foreground mb-1">
                                    Create New Project
                                </h2>
                                <p className="text-muted-foreground">
                                    Start building your database schema from scratch
                                </p>
                            </div>
                            <Button
                                onClick={() => setShowNewProjectModal(true)}
                                className="flex items-center space-x-2 bg-primary hover:bg-primary-hover text-primary-foreground px-6 py-3 rounded-lg font-medium transition-colors duration-200 shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                                <span>New Project</span>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-foreground">
                            Your Projects
                        </h2>
                        <p className="text-muted-foreground">
                            {projects.length} projects
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((project) => (
                            <div
                                onClick={() => handleProjectOpen(project.id)}
                                key={project.id}
                                className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md hover:border-ring/20 transition-all duration-200 cursor-pointer"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-semibold text-card-foreground truncate  transition-colors duration-200">
                                            {project.name}
                                        </h3>
                                    </div>
                                    <div className="relative">
                                        <Button
                                            variant="ghost"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                handleProjectMenuToggle(project.id)
                                            }}
                                            className="project-menu-button p-1 rounded-md text-muted-foreground hover:text-foreground transition-all duration-200"
                                        >
                                            <MoreHorizontal className="w-5 h-5" />
                                        </Button>

                                        {activeProjectMenu === project.id && (
                                            <div className="project-menu absolute right-0 mt-2 w-44 bg-popover rounded-lg shadow-lg border border-border py-1 z-50">
                                                {[
                                                    { label: 'Edit', icon: PencilLine, action: 'edit' },
                                                    { label: 'Share', icon: Share2, action: 'share' },
                                                    { label: 'Download JSON', icon: Download, action: 'download' },
                                                ].map(({ label, icon: Icon, action }) => (
                                                    <div
                                                        key={label}
                                                        onClick={(event) => {
                                                            event.stopPropagation();
                                                            handleProjectAction(action, project.id);
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                                    >
                                                        <Icon className="w-4 h-4 flex-shrink-0" />
                                                        <span>{label}</span>
                                                    </div>
                                                ))}

                                                <hr className="my-1 border-border" />

                                                <div
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleProjectAction('trash', project.id);
                                                    }}
                                                    className="flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-accent cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4 flex-shrink-0" />
                                                    <span>Move to trash</span>
                                                </div>
                                            </div>

                                        )}
                                    </div>
                                </div>

                                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                                    {project.description}
                                </p>

                                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                    <div className="flex items-center space-x-1">
                                        <Database className="w-4 h-4" />
                                        <span>{project.tables} tables</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <Users className="w-4 h-4" />
                                        <span>{project.collaborators}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    <span>Updated {project.lastModified}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Project Dropdown */}
            <Dialog open={showNewProjectModal} onOpenChange={setShowNewProjectModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Create New Project</DialogTitle>
                        <DialogDescription>
                            Start building your database schema from scratch
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="projectName">Project Name *</Label>
                            <Input
                                id="projectName"
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Enter project name"
                                className="mt-1.5"
                                autoFocus
                            />
                        </div>
                        <div>
                            <Label htmlFor="projectDescription">Description (Optional)</Label>
                            <Textarea
                                id="projectDescription"
                                value={newProjectDescription}
                                onChange={(e) => setNewProjectDescription(e.target.value)}
                                placeholder="Brief description of your project"
                                className="mt-1.5"
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleModalClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateProject} disabled={!newProjectName.trim()}>
                            Create Project
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Share Modal */}
            <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Project</DialogTitle>
                        <DialogDescription>
                            Share {selectedProjectForShare?.name} with others
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="shareRole">Access Level</Label>
                            <Select value={shareRole} onValueChange={setShareRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select access level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="viewer">Viewer - Can view only</SelectItem>
                                    <SelectItem value="editor">Editor - Can view and edit</SelectItem>
                                    <SelectItem value="admin">Admin - Full access</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="shareLink">Share Link</Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="shareLink"
                                    value={`${shareLink}${selectedProjectForShare?.id}`}
                                    readOnly
                                    className="flex-1"
                                />
                                <Button
                                    onClick={handleCopyLink}
                                    size="sm"
                                    variant="outline"
                                    className="shrink-0"
                                >
                                    {linkCopied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={handleShareModalClose}>
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Toaster richColors />
        </div>
    );
};
