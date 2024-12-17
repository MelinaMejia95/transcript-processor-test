import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI();

export interface ITranscript {
  summary: string;
  keyPoints: string[];
}

export async function POST(request: Request): Promise<string | Response> {
  try {
    // Parse the request body
    const body = await request.json();
    const { transcript } = body;

    const response = await openai.chat.completions.create(
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "Generate a summary and key points from the following transcript. Format the response as JSON with 'summary' and 'keyPoints' fields, where keyPoints is an array of strings.",
          },
          {
            role: "user",
            content: transcript,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: "json_object" },
      },
    );

    const result = response.choices[0].message.content;
    const formattedResult = JSON.parse(result || "");

    return NextResponse.json({
      summary: formattedResult.summary,
      keyPoints: formattedResult.keyPoints,
    });
  } catch (error) {
    return `Error trying to create transcript", ${error}`;
  }
}
