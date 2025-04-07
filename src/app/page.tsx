"use client";

import { useState, ChangeEvent, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/image-generator/PromptInput";
import { ImageGrid } from "@/components/image-generator/ImageGrid";
import { DownloadDialog } from "@/components/image-generator/DownloadDialog";
import { ErrorDisplay } from "@/components/image-generator/ErrorDisplay";

interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [imageToDownload, setImageToDownload] = useState<string | null>(null);

  const generateImages = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setImages([]);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate images");
      }

      if (!data.images || !Array.isArray(data.images)) {
        throw new Error("Invalid response format from server");
      }

      setImages(data.images);
    } catch (error: unknown) {
      console.error("Error generating images:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to generate images. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadClick = (
    imageUrl: string,
    e: MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    setImageToDownload(imageUrl);
    setDownloadDialogOpen(true);
  };

  const handleDownloadConfirm = async () => {
    if (imageToDownload) {
      try {
        // Use our proxy endpoint to download the image
        const downloadUrl = `/api/download?url=${encodeURIComponent(
          imageToDownload
        )}`;
        window.open(downloadUrl, "_blank");

        setDownloadDialogOpen(false);
        setImageToDownload(null);
      } catch (error) {
        console.error("Error downloading image:", error);
        setError("Failed to download image. Please try generating new images.");
        setDownloadDialogOpen(false);
        setImageToDownload(null);
      }
    }
  };

  return (
    <main className="min-h-screen  bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            AI Image Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with DALL-E 3
          </p>
          <p className="text-sm text-gray-400">
            Powered by OpenAI's most advanced image generation model
          </p>
        </div>

        <PromptInput
          prompt={prompt}
          loading={loading}
          onPromptChange={(e: ChangeEvent<HTMLInputElement>) =>
            setPrompt(e.target.value)
          }
          onGenerate={generateImages}
        />

        <ErrorDisplay error={error} />

        <ImageGrid
          images={images}
          selectedImage={selectedImage}
          onSelectImage={setSelectedImage}
          onDownloadImage={handleDownloadClick}
          loading={loading}
        />

        {images.length > 0 && !loading && (
          <div className="text-center space-y-4">
            <Button
              variant="outline"
              onClick={() => generateImages()}
              className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20"
            >
              Generate More Like This
            </Button>
            <p className="text-sm text-gray-400">
              Click on an image to select it, or use the download button to save
              your favorite generations.
            </p>
          </div>
        )}

        <DownloadDialog
          open={downloadDialogOpen}
          onOpenChange={setDownloadDialogOpen}
          onConfirm={handleDownloadConfirm}
        />
      </div>
    </main>
  );
}
