import NextAuth, { DefaultSession, Session, SessionStrategy, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user?: {
            id: string;
        } & DefaultSession['user']
    }
}

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt' as SessionStrategy,
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and Password is required');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email }
                });

                if (!user || !user.hashedPassword) {
                    throw new Error('No user found with the provided email');
                }

                const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
                if (!isValidPassword) {
                    throw new Error('Invalid login credentials');
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image || null,
                };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user: User }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        async session({ session, token }: { session: Session, token: JWT }) {
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error'
    },
    secret: process.env.NEXTAUTH_SECRET
}

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
