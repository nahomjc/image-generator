import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get("url");

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch image" },
        { status: response.status }
      );
    }

    const blob = await response.blob();

    // Return the image with appropriate headers
    return new NextResponse(blob, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Content-Disposition": 'attachment; filename="generated-image.png"',
      },
    });
  } catch (error) {
    console.error("Error in download route:", error);
    return NextResponse.json(
      { error: "Failed to download image" },
      { status: 500 }
    );
  }
}
