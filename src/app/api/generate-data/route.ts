import { getAuthSession } from "@/lib/auth";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_MODEL = "codestral-latest";

function getPrompt(format: string, schema: JSON, count: number): string {
    const schemaStr = JSON.stringify(schema, null, 2);
    const lowerFormat = format.toLowerCase();

    const prompts: Record<string, string> = {
        sql: `Generate ${count} realistic SQL INSERT INTO statements for the schema below.
      Use meaningful data (names, emails, dates, etc.) and proper UUIDs or integers where appropriate.
      End each statement with a semicolon.
      Schema:
      ${schemaStr}
      Return only SQL code, nothing else.`,

        prisma: `Generate ${count} realistic JSON records that could be used with Prisma create() calls.
      Each record should represent valid data for the schema below.
      Use correct data types, and realistic values (UUIDs, emails, timestamps, enums, etc.).
      Schema:
      ${schemaStr}
      Only return raw JSON array. Do not include any explanation or code fences.`,

        mongodb: `Generate ${count} realistic MongoDB documents for the schema below.
      Use valid ObjectIds, realistic field values, and consistent relations where applicable.
      Schema:
      ${schemaStr}
      Only return a JSON array of documents, no explanations or code fences.`,
    };

    return prompts[lowerFormat] || "";
}

export async function POST(request: NextRequest) {
    const session = await getAuthSession();
    if (!session) {
        return NextResponse.json(
            {
                error: 'Unauthorized'
            },
            {
                status: 401
            }
        );
    }

    if (!MISTRAL_API_KEY) {
        return NextResponse.json(
            {
                error: "Server misconfiguration: Missing Mistral API key"
            },
            {
                status: 500
            }
        );
    }

    try {
        const { format, schema, count } = await request.json();

        const prompt = getPrompt(format, schema, count);
        if (!prompt) {
            return NextResponse.json(
                {
                    error: "Invalid format"
                },
                {
                    status: 400
                }
            );
        }

        const response = await axios.post(
            MISTRAL_API_URL,
            {
                model: MISTRAL_MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.5,
            },
            {
                headers: {
                    Authorization: `Bearer ${MISTRAL_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const generatedData = response.data.choices[0].message.content
            .replace(/```[\s\S]*?\n([\s\S]*?)```/m, "$1")
            .trim();

        return NextResponse.json(
            {
                data: generatedData,
            },
            {
                status: 201,
            }
        );

    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("Mistral API Error:", error.response?.data || error.message);
        } else {
            console.error("Unexpected Error:", error);
        }
        return NextResponse.json(
            {
                error: 'Failed to generate code'
            },
            {
                status: 500
            }
        )
    }

}