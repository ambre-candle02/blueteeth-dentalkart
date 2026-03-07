import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        // Check if API key is provided
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey || apiKey === "") {
            return NextResponse.json(
                { reply: "I am currently running in offline mode because the GEMINI_API_KEY is missing from the server environment. Please ask the administrator to add their Google Gemini API Key to the .env.local file to activate my advanced AI features." },
                { status: 500 }
            );
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are a highly advanced and helpful AI assistant for a premium B2B dental store called 'Blueteeth Dentalkart' based in India. 
        You help dentists and clinics find dental equipment, instruments, x-ray sensors, chairs, and consumables. 
        CRITICAL RULE: Always respond in the EXACT same language that the user used. If the user asks in English, reply strictly in English. If the user asks in Hindi, reply in Hindi. If the user asks in Hinglish, reply in Hinglish. Be professional, concise, and helpful.
        
        User's question: "${message}"`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ reply: text });
    } catch (error: any) {
        console.error("Chatbot ML Error Name:", error?.name);
        console.error("Chatbot ML Error Message:", error?.message);
        console.error("Chatbot ML Full Error:", error);
        return NextResponse.json(
            { reply: `Sorry, my AI brain encountered an error: ${error?.message || 'Unknown Error'}. Please check the server logs!` },
            { status: 500 }
        );
    }
}
