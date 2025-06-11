import { NextResponse } from "next/server";

export async function GET() {
    try {
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error('GROQ_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: "API key not configured" },
                { status: 500 }
            );
        }

        // Log the first few characters of the API key for debugging (safely)
        console.log('API Key prefix:', apiKey.substring(0, 5) + '...');

        return NextResponse.json({ apiKey });
    } catch (error) {
        console.error('Error in groq-key route:', error);
        return NextResponse.json(
            { error: "Failed to fetch API key" },
            { status: 500 }
        );
    }
} 