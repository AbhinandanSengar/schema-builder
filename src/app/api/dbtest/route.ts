import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        await prisma.$connect()
        const userCount = await prisma.user.count()
        return NextResponse.json({
            message: 'Database connected successfully',
            userCount
        })
    } catch (error) {
        console.error('Database connection error:', error)
        return NextResponse.json(
            { error: 'Database connection failed', details: error },
            { status: 500 }
        )
    } finally {
        await prisma.$disconnect()
    }
}