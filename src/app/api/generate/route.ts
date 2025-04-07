import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 60000,
});

export const runtime = "edge";
export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured" },
        { status: 500 }
      );
    }

    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 4,
        size: "1024x1024",
        response_format: "url",
      });

      if (!response.data || !Array.isArray(response.data)) {
        return NextResponse.json(
          { error: "Invalid response from OpenAI API" },
          { status: 500 }
        );
      }

      const images = response.data.map((image: OpenAI.Images.Image) => ({
        url: image.url,
        revised_prompt: prompt,
      }));

      return NextResponse.json({ images });
    } catch (error: any) {
      console.error("OpenAI API Error:", error);

      // Handle specific OpenAI API errors
      if (error.code === "content_policy_violation") {
        return NextResponse.json(
          {
            error:
              "Your prompt was rejected by our safety system. Please try a different prompt that doesn't contain potentially harmful or inappropriate content.",
            details: error.message,
          },
          { status: 400 }
        );
      }

      // Handle rate limit errors
      if (error.code === "rate_limit_exceeded") {
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again in a few moments.",
            details: error.message,
          },
          { status: 429 }
        );
      }

      // Handle timeout errors
      if (error.code === "timeout" || error.message?.includes("timeout")) {
        return NextResponse.json(
          {
            error:
              "The request took too long to process. Please try a simpler prompt or try again later.",
            details: error.message,
          },
          { status: 504 }
        );
      }

      // Handle other OpenAI API errors
      if (error.response) {
        return NextResponse.json(
          {
            error: "OpenAI API Error",
            details: error.response.data,
          },
          { status: error.response.status || 500 }
        );
      }

      // Handle any other errors
      return NextResponse.json(
        {
          error: "Failed to generate images",
          details: error.message || "Unknown error occurred",
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in generate route:", error);
    return NextResponse.json(
      {
        error: "Failed to process request",
        details: error.message || "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
