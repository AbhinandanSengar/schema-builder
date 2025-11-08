import { z } from 'zod';
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from 'crypto';
import { sendVerificationEmail } from '@/lib/email';

const signUpSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


export async function POST(request: NextRequest) {
    const body = await request.json();
    const parsedSignUpData = signUpSchema.safeParse(body);
    if (!parsedSignUpData.success) {
        return NextResponse.json(
            {
                message: 'Invalid inputs',
                error: parsedSignUpData.error.flatten().fieldErrors,
            },
            {
                status: 400
            }
        );
    }
    try {
        const { name, email, password } = parsedSignUpData.data;

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                {
                    message: 'User already exists. Please Signin'
                },
                {
                    status: 400
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword,
                emailVerified: null,
            },
        });

        const verificationToken = randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: verificationToken,
                expires,
            }
        });

        try {
            await sendVerificationEmail(email, verificationToken);
            console.log(`Verification email sent successfully to ${email}`);
        } catch(error) {
            console.error('Error creating verification token:', error);
        }

        return NextResponse.json(
            {
                message: 'Registration successful! Please check your email to verify your account before signing in.',
                email: email
            },
            {
                status: 201
            }
        );
    } catch (error: unknown) {
        console.error('Signup error:', error);

        if (error instanceof Error && error.message.includes('Failed to send verification email')) {
            return NextResponse.json(
                {
                    error: "Account created but failed to send verification email. Please contact support."
                },
                {
                    status: 500
                }
            );
        }

        return NextResponse.json(
            {
                message: 'Registration failed. Please try again later.'
            },
            {
                status: 500
            }
        );
    }
}