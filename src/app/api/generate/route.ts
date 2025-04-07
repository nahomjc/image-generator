import { NextResponse } from "next/server";
import OpenAI from "openai";

// Configure OpenAI with a shorter timeout for Vercel
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 80000, // 8 seconds timeout to stay under Vercel's 10s limit
});

// Configure Vercel settings
export const maxDuration = 10;
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

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error("Request timeout"));
      }, 80000); // 8 second timeout
    });

    try {
      const response = (await Promise.race([
        openai.images.generate({
          model: "dall-e-2",
          prompt: prompt,
          n: 4,
          size: "1024x1024",
        }),
        timeoutPromise,
      ])) as OpenAI.Images.ImagesResponse;

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

      if (error.message === "Request timeout") {
        return NextResponse.json(
          {
            error:
              "Request timed out. The image generation is taking too long. Please try again with a simpler prompt.",
          },
          { status: 504 }
        );
      }

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

      if (error.response) {
        return NextResponse.json(
          {
            error: "OpenAI API Error",
            details: error.response.data,
          },
          { status: error.response.status || 500 }
        );
      }

      return NextResponse.json(
        { error: "Failed to generate images", details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in generate route:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}
