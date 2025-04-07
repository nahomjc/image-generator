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
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate images");
      }

      const data = await response.json();
      setImages(data);
    } catch (error) {
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
            Transform your ideas into stunning visuals with the power of AI
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
        />

        {selectedImage && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => generateImages()}
              className="mt-8 bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20"
            >
              Generate More Like This
            </Button>
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
