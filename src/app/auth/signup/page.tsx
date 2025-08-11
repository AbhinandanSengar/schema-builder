'use client';

import { z } from 'zod';
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from "@/components/ui/sonner";

interface SignUpData {
    name: string;
    email: string;
    password: string;
}

interface Errors {
    name?: string;
    email?: string;
    password?: string;
}

const signUpSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8)
})

export default function SignUp() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<Errors>({});
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [SignUpData, setSignUpData] = useState<SignUpData>({ name: '', email: '', password: '' });

    const validateData = (): boolean => {
        const parsedSignUpSchema = signUpSchema.safeParse(SignUpData);
        if (!parsedSignUpSchema.success) {
            const fieldErrors = parsedSignUpSchema.error.flatten().fieldErrors;
            setErrors({
                name: fieldErrors.name?.[0] ?? '',
                email: fieldErrors.email?.[0] ?? '',
                password: fieldErrors.password?.[0] ?? '',
            });
            return false;
        }
        setErrors({ email: '', password: '' });
        toast.success('Validation successful');
        console.log('Validation successful:', SignUpData);
        return true;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSignUpData(prev => ({ ...prev, [name]: value }));

        // Clear error for the field being changed
        if (errors[name as keyof Errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }));

        }
    };

    const handleSubmit = async () => {
        if (!validateData()) return;

        setIsLoading(true);

        try {
            const res = await axios.post('/api/signup', SignUpData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (res.status !== 201) {
                setIsLoading(false);
                toast.error('Failed to create account. Please try again.');
                return;
            }

            setIsSubmitted(true);
        } catch (error: unknown) {
            setIsLoading(false);
            console.error('Error during signup:', error);
            setErrors((prev) => ({ ...prev, general: 'Internal server error' }));
            toast.error('An error occurred while creating your account. Please try again later.');
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform animate-in fade-in zoom-in duration-500">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Account Created!</h2>
                        <h3 className="text-gray-600 mb-6">Welcome aboard, {SignUpData.name}!<br /> Please verify your email before signing in.</h3>
                        <Button
                            onClick={() => {
                                setIsSubmitted(false);
                                router.push('/dashboard');
                            }}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transform hover:scale-[1.02] transition-all duration-200"
                        >
                            Proceed to Sign In
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 transform hover:rotate-3 transition-transform duration-300">
                        <User className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
                    <p className="text-gray-600">Join us today and get started in minutes</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:shadow-2xl transition-shadow duration-300">
                    <div className="space-y-6">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={SignUpData.name}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                )}
                            </div>
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-left duration-200">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={SignUpData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && (
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <AlertCircle className="h-5 w-5 text-red-400" />
                                    </div>
                                )}
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-left duration-200">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={SignUpData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                    placeholder="Create a strong password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors duration-200"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    ) : (
                                        <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600 animate-in slide-in-from-left duration-200">
                                    {errors.password}
                                </p>
                            )}
                            <div className="mt-2 text-xs text-gray-500">
                                Must be 8+ characters with uppercase, lowercase, and number
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center group"
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                type="button"
                                className="text-blue-600 hover:text-blue-700 hover:bg-transparent font-semibold hover:underline transition-colors duration-200"
                                onClick={() => router.push('/auth/signin')}
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>

                {/* Trust Indicators */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        By creating an account, you agree to our{' '}
                        <button className="text-blue-600 hover:underline">Terms</button> and{' '}
                        <button className="text-blue-600 hover:underline">Privacy Policy</button>
                    </p>
                </div>
            </div>

            <Toaster richColors />
        </div>
    );
}