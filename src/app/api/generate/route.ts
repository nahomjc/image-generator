import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    try {
      const response = await openai.images.generate({
        model: "dall-e-2",
        prompt: prompt,
        n: 4,
        size: "1024x1024",
      });

      const images = response.data.map((image) => ({
        url: image.url,
        revised_prompt: prompt,
      }));

      return NextResponse.json(images);
    } catch (error: any) {
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
      throw error;
    }
  } catch (error) {
    console.error("Error in generate route:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
