"use client"

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Database,
    GitBranch,
    Download,
    ArrowRight,
    Zap,
    Users,
    Sparkles
} from 'lucide-react';
import { useRouter } from 'next/navigation';


function App() {
    const router = useRouter();
    
    const handleDashboardRedirect = () => {
        router.push("/dashboard");
    };

    const features = [
        {
            icon: <Database className="h-6 w-6" />,
            title: "Visual Schema Design",
            description: "Design database schemas using an intuitive React Flow canvas with table-like structures. Drag, drop, and connect your database entities effortlessly.",
            highlight: "React Flow Canvas"
        },
        {
            icon: <GitBranch className="h-6 w-6" />,
            title: "Relationship Mapping",
            description: "Connect fields and attributes between tables to define foreign key relationships. Support for 1:1, 1:N, and N:N relationships with visual indicators.",
            highlight: "Foreign Keys"
        },
        {
            icon: <Sparkles className="h-6 w-6" />,
            title: "AI-Powered Code Generation",
            description: "Generate production-ready code from your schema designs. Support for SQL, Prisma, MongoDB, and more formats with intelligent AI assistance.",
            highlight: "AI-Powered"
        },
        {
            icon: <Users className="h-6 w-6" />,
            title: "Real-time Collaboration",
            description: "Invite team members to collaborate on schema design in real-time. See changes as they happen and work together seamlessly.",
            highlight: "Live Collaboration"
        },
        {
            icon: <Download className="h-6 w-6" />,
            title: "Import & Export",
            description: "Export your schema designs as JSON or import existing schemas to continue building. Perfect for version control and sharing.",
            highlight: "JSON Format"
        }
    ];

    const codeFormats = [
        { name: "SQL", color: "bg-blue-100 text-blue-800" },
        { name: "Prisma", color: "bg-purple-100 text-purple-800" },
        { name: "MongoDB", color: "bg-green-100 text-green-800" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold text-gray-900">Schema Builder</h1>
                    </div>
                    <div className='flex items-center space-x-4'>
                        <Button variant={"outline"} onClick={() => router.push("/auth/signin")}>
                            Log In
                        </Button>
                        <Button onClick={() => router.push("/auth/signup")}>
                            Sign Up
                        </Button>
                    </div>
                </div>
            </header>

            <section className="py-20 px-4">
                <div className="container mx-auto max-w-6xl text-center">
                    <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
                        <Zap className="w-4 h-4 mr-2" />
                        AI-Powered Database Design
                    </Badge>

                    <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                        Design Database
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Schemas</span>
                        <br />
                        Visually & Collaboratively
                    </h1>

                    <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                        Create, visualize, and generate database schemas with our intuitive visual editor.
                        Design relationships, collaborate in real-time, and export to multiple formats with AI assistance.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                        <Button
                            size="lg"
                            onClick={handleDashboardRedirect}
                            className=" text-lg px-8 py-6 h-auto"
                        >
                            Start Designing Free
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button variant="outline" size="lg" className="text-lg px-8 py-6 h-auto">
                            View Docs
                        </Button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 mb-16">
                        <span className="text-sm text-gray-500 mr-4">Generate code for:</span>
                        {codeFormats.map((format) => (
                            <Badge key={format.name} className={`${format.color} font-medium`}>
                                {format.name}
                            </Badge>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-white">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything You Need for Schema Design
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            From visual design to code generation, Schema Builder provides all the tools
                            you need to create professional database schemas.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="group transition-all duration-300 border-0 shadow-md hover:shadow-xl hover:-translate-y-1">
                                <CardHeader className="pb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gray-800 rounded-lg group-hover:bg-gray-900 transition-colors">
                                            {React.cloneElement(feature.icon, { className: "h-6 w-6 text-white" })}
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {feature.highlight}
                                        </Badge>
                                    </div>
                                    <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <CardDescription className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </CardDescription>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            How Schema Builder Works
                        </h2>
                        <p className="text-xl text-gray-600">
                            From concept to code in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                1
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Design Visually</h3>
                            <p className="text-gray-600">
                                Create tables and define fields using our intuitive drag-and-drop interface.
                                Connect relationships with simple clicks.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                2
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Collaborate & Refine</h3>
                            <p className="text-gray-600">
                                Invite team members to collaborate in real-time. See changes instantly
                                and work together on complex schemas.
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                3
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate & Export</h3>
                            <p className="text-gray-600">
                                Use AI to generate production-ready code in your preferred format.
                                Export or import JSON schemas for version control.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* <section className="py-20 px-4 bg-gray-900 text-white">
                <div className="container mx-auto max-w-4xl text-center">
                    <h2 className="text-4xl font-bold mb-6">
                        Ready to Design Your Next Schema?
                    </h2>
                    <p className="text-xl text-gray-300 mb-10">
                        Join thousands of developers who trust Schema Builder for their database design needs.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            onClick={handleDashboardRedirect}
                            className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                        >
                            Get Started Now
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg px-8 py-6 h-auto border-gray-500 text-gray-600 hover:bg-gray-800 hover:text-white hover:border-white"
                        >
                            View Documentation
                        </Button>
                    </div>

                </div>
            </section> */}

            <footer className="py-12 px-4 bg-white border-t">
                <div className="container mx-auto max-w-6xl">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center space-x-2 mb-4 md:mb-0">
                            <Database className="h-6 w-6 text-blue-600" />
                            <span className="text-lg font-semibold text-gray-900">Schema Builder</span>
                        </div>

                        <div className="flex space-x-6 text-sm text-gray-600">
                            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Support</a>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t text-center text-sm text-gray-500">
                        © 2025 Schema Builder. Built with React, TypeScript, and shadcn/ui.
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;