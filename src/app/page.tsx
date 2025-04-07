"use client";

import { useState, ChangeEvent, MouseEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/image-generator/PromptInput";
import { ImageGrid } from "@/components/image-generator/ImageGrid";
import { DownloadDialog } from "@/components/image-generator/DownloadDialog";
import { ErrorDisplay } from "@/components/image-generator/ErrorDisplay";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

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
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

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
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 relative overflow-hidden">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="max-w-2xl mx-auto p-8 text-center"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-6"
              >
                <Sparkles className="h-16 w-16 mx-auto text-blue-400 mb-4" />
                <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
                  Welcome to AI Image Generator
                </h1>
                <p className="text-xl text-gray-300 mb-6">
                  Transform your imagination into stunning visuals with DALL-E 2
                </p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex flex-col items-center space-y-2 text-gray-300">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-blue-400 mr-2"></div>
                    <span>Create detailed, high-quality images</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-purple-400 mr-2"></div>
                    <span>Explore your creative ideas</span>
                  </div>
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-pink-400 mr-2"></div>
                    <span>Download and share your creations</span>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="pt-4"
                >
                  <Button
                    onClick={() => setShowWelcome(false)}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
            AI Image Generator
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Transform your ideas into stunning visuals with DALL-E 2
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
