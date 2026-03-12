import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize the Google Generative AI client
// We only do this if the key exists to prevent crashing the server on boot if unconfigured
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(req: Request) {
  try {
    // 1. Check API Key
    if (!genAI) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // 2. Parse request body
    const body = await req.json();
    const { content } = body;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Content is required to generate a summary." },
        { status: 400 }
      );
    }

    // 3. Select the model
    // gemini-2.5-flash is extremely fast and suitable for text summarization
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // 4. Construct the prompt
    const prompt = `
      You are an expert SEO copywriter. 
      Read the following blog post content and generate a highly engaging, click-worthy SEO meta description (excerpt).
      
      CRITICAL RULES:
      1. Your response MUST be strictly between 120 and 155 characters.
      2. It must be a single, cohesive paragraph (1-2 sentences max).
      3. Start strong, include the main value proposition, and leave the reader curious.
      4. DO NOT include quotes around your response.
      5. DO NOT include any introductory text like "Here is the summary:". Just return the summary itself.

      POST CONTENT:
      ${content}
    `;

    // 5. Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let summary = response.text().trim();

    // Clean up any accidental quotes the model might have added
    if (summary.startsWith('"') && summary.endsWith('"')) {
      summary = summary.slice(1, -1).trim();
    }

    // 6. Return the generated summary
    return NextResponse.json({ summary });

  } catch (error) {
    console.error("Error generating SEO summary with Gemini:", error);
    return NextResponse.json(
      { error: "Failed to generate summary. Please try again later." },
      { status: 500 }
    );
  }
}
