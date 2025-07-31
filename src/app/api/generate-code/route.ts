import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "deepseek/deepseek-chat-v3-0324:free";

export async function POST(request: NextRequest) {
    try {
        const { schema, format } = await request.json();

        const isMongo = format.toLowerCase() === "mongodb";

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

        const prompt = `Generate 
            ${isMongo ? (
                "Mongoose schema definitions (using ES Modules)"
            ) : format.toUpperCase()} code for the following schema.
            
            ${isMongo ? `Requirements:
                - Use \`import mongoose, { Schema, model } from "mongoose"\`.
                - Do NOT use CommonJS or raw MongoDB shell commands.
                - Do NOT include an 'id' field — let Mongoose handle _id by default.
                - Use \`Schema.Types.ObjectId\` for foreign keys and add \`ref: "<ReferencedModel>"\`.
                - Add all applicable Mongoose constraints: \`required\`, \`unique\`, \`enum\`, etc.
                - At the end, export all models using \`export const ModelName = model("Name", Schema)\`.` : ""}
                
                Schema:
                ${JSON.stringify(schema, null, 2)}

                Only return the code. Do not explain anything.`;

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

        const generatedCode = resposne.data.choices[0]?.message.content.trim()
            .replace(/^```(ts|javascript)?/i, "")
            .replace(/```$/, "")
            .trim();

        return NextResponse.json(
            {
                code: generatedCode
            },
            {
                status: 201
            }
        )
    } catch (error: any) {
        console.error("OpenRouter Error:", error.response?.data || error.message);
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