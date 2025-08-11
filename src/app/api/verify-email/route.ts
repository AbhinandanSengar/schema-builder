import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
        return NextResponse.json(
            {
                message: 'Missing verification token'
            },
            {
                status: 400
            }
        );
    }

    try {
        const verification = await prisma.verificationToken.findUnique({
            where: { token }
        });
        if (!verification) {
            return NextResponse.redirect(
                new URL('/auth/error?error=TokenNotFound', request.url)
            );
        }

        if (verification.expires < new Date()) {
            await prisma.verificationToken.delete({
                where: { token }
            });

            return NextResponse.redirect(
                new URL('/auth/error?error=TokenExpired', request.url)
            );
        }

        await prisma.user.update({
            where: {
                email: verification.identifier
            },
            data: {
                emailVerified: new Date()
            }
        });

        await prisma.verificationToken.delete({
            where: { token }
        });

        return NextResponse.redirect(
            new URL('/auth/signin?message=EmailVerified', request.url)
        );
    } catch (error) {
        console.error('Email Verification error:', error);
        return NextResponse.redirect(
            new URL('/auth/error?error=VerificationFailed', request.url)
        );
    }
}