import axios from "axios";
import { getAuthSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-exp:free";

function getPrompt(format: string, schema: JSON): string {
    const schemaStr = JSON.stringify(schema, null, 2);
    const lowerFormat = format.toLowerCase();

    const prompts: Record<string, string> = {
        mongodb: `Generate clean, production-ready Mongoose schema definitions (ES Modules) for the following schema.
            Requirements:
            - Use: \`import mongoose, { Schema, model } from "mongoose"\`.
            - Do NOT use CommonJS or raw MongoDB shell commands.
            - Do NOT include an 'id' field — let Mongoose handle _id by default.
            - Use \`Schema.Types.ObjectId\` for foreign keys and add \`ref: "<ReferencedModel>"\` with correct model names in PascalCase.
            - Use correct Mongoose types: String, Number, Boolean, Date, Decimal128, Map, Array, Buffer, Mixed, ObjectId.
            - Add all applicable constraints: \`required\`, \`unique\`, \`enum\`, \`default\`.
            - Add \`timestamps: true\` to each schema definition.
            - Export each model as: \`export const ModelName = model("ModelName", schema)\`.

            Schema:
            ${schemaStr}

            Only return the code. Do not explain anything.`,

        prisma: `Generate clean Prisma schema model definitions for the following schema.
            Requirements:
            - Use the \`model\` keyword for each table.
            - Use correct Prisma scalar types: Int, String, Boolean, Float, DateTime, Decimal, Json, Bytes.
            - Use \`@id\` for primary keys, with \`@default(uuid())\` for UUID-based IDs.
            - Use \`@unique\` for unique fields.
            - Add \`@relation(fields: [...], references: [...])\` for foreign keys with proper relation names and do not make it optional.
            - Use \`enum\` keyword for ENUM fields.
            - Infer proper names for models in PascalCase (no generic names like "NewTable_1").
            - Do NOT include extra comments or explanations.

            Schema:
            ${schemaStr}

            Only return the code. Do not explain anything.`,

        sql: `Generate production-ready SQL CREATE TABLE statements for the following schema.
            Requirements:
            - Convert all table and column names to snake_case.
            - Use UUID for primary keys where applicable.
            - Use correct SQL types: INT, VARCHAR(n), TEXT, BOOLEAN, DATE, TIMESTAMP, DECIMAL(p,s), JSON, UUID, ENUM.
            - Define PRIMARY KEY constraints.
            - Define FOREIGN KEY constraints with \`ON DELETE CASCADE\` for relations.
            - Apply NOT NULL and UNIQUE constraints where applicable.
            - End each CREATE TABLE statement with a semicolon.
            - Avoid generic names like "New Table" — infer meaningful table names from the schema.

            Schema:
            ${schemaStr}

            Only return the code. Do not explain anything.`
    }

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

    if (!OPENROUTER_API_KEY) {
        return NextResponse.json(
            {
                error: "Server misconfiguration: Missing API key"
            },
            {
                status: 500
            }
        );
    }

    try {
        const { schema, format } = await request.json();

        if (!schema || !format) {
            return NextResponse.json(
                {
                    error: 'Missing schema or format'
                },
                {
                    status: 400
                }
            )
        }

        if (!schema || !format) {
            return NextResponse.json(
                {
                    error: "Missing schema or format"
                },
                {
                    status: 400
                }
            );
        }

        if (typeof schema !== "object" || Array.isArray(schema)) {
            return NextResponse.json(
                {
                    error: "Schema must be an object"
                },
                {
                    status: 400
                }
            );
        }

        // Get prompt
        const prompt = getPrompt(format, schema);
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

        const resposne = await axios.post(
            OPENROUTER_API_URL,
            {
                model: MODEL,
                messages: [{ role: "user", content: prompt }],
                temperature: 0.3
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const generatedCode = resposne.data.choices[0]?.message.content
            .replace(/```[\s\S]*?\n([\s\S]*?)```/m, "$1")
            .trim();

        return NextResponse.json(
            {
                code: generatedCode
            },
            {
                status: 201
            }
        )
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
            console.error("OpenRouter API Error:", error.response?.data || error.message);
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