import { z } from 'zod';
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

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
            },
        });

        return NextResponse.json(
            {
                message: 'User registered successfully'
            },
            {
                status: 200
            }
        );
    } catch (error: unknown) {
        console.error('Signup error:', error);
        return NextResponse.json(
            {
                message: 'Internal Server Error'
            },
            {
                status: 500
            }
        );
    }
}