"use client";

import { useState, useEffect } from "react";
import type { ChangeEvent, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { PromptInput } from "@/components/image-generator/PromptInput";
import { ImageGrid } from "@/components/image-generator/ImageGrid";
import { DownloadDialog } from "@/components/image-generator/DownloadDialog";
import { ErrorDisplay } from "@/components/image-generator/ErrorDisplay";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  Wand2,
  Image as ImageIcon,
  Zap,
} from "lucide-react";

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
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 80);

    const timer = setTimeout(() => {
      setLoadingProgress(100);
      setTimeout(() => {
        setShowWelcome(false);
      }, 500);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
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
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 relative overflow-hidden">
      {/* Animated background gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/95 via-gray-900/95 to-black/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.3, 1],
                  x: [0, -50, 0],
                  y: [0, -30, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute top-1/2 right-1/3 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.4, 1],
                  x: [0, 30, 0],
                  y: [0, -40, 0],
                }}
                transition={{
                  duration: 12,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Animated particles */}
            {typeof window !== "undefined" &&
              Array.from({ length: 20 }, (_, i) => {
                const randomLeft = Math.random() * 100;
                const randomTop = Math.random() * 100;
                const randomDelay = Math.random() * 2;
                const randomDuration = Math.random() * 3 + 2;
                const particleId = `particle-${i}-${randomLeft}-${randomTop}`;
                return (
                  <motion.div
                    key={particleId}
                    className="absolute w-1 h-1 bg-white/20 rounded-full"
                    initial={{
                      opacity: 0,
                      scale: 0,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: randomDuration,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: randomDelay,
                      ease: "easeInOut",
                    }}
                    style={{
                      left: `${randomLeft}%`,
                      top: `${randomTop}%`,
                    }}
                  />
                );
              })}

            <motion.div
              className="max-w-3xl mx-auto p-8 text-center relative z-10"
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                initial={{ y: 20, opacity: 0, rotate: -10 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring" }}
                className="mb-8"
              >
                <motion.div
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: {
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    },
                    scale: {
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    },
                  }}
                  className="inline-block mb-6"
                >
                  <div className="relative">
                    {/* Glowing rings */}
                    <motion.div
                      className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.5, 0.8, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-purple-500/15 blur-xl rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={{
                        duration: 2.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                        delay: 0.5,
                      }}
                    />
                    <Sparkles className="h-20 w-20 mx-auto text-blue-400 relative z-10 drop-shadow-2xl" />
                  </div>
                </motion.div>
                <motion.h1
                  className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-6 leading-tight"
                  animate={{
                    backgroundPosition: ["0%", "100%", "0%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: "200% 200%",
                  }}
                >
                  Welcome to AI Image Generator
                </motion.h1>
                <motion.p
                  className="text-2xl text-gray-300 mb-8 font-light"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  Transform your imagination into stunning visuals with DALL-E 2
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-6"
              >
                <div className="flex flex-col items-center space-y-4 text-gray-300">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="flex items-center gap-3 text-lg"
                  >
                    <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <Wand2 className="h-5 w-5 text-blue-400" />
                    </div>
                    <span>Create detailed, high-quality images</span>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="flex items-center gap-3 text-lg"
                  >
                    <div className="p-2 rounded-lg bg-purple-500/20 border border-purple-500/30">
                      <ImageIcon className="h-5 w-5 text-purple-400" />
                    </div>
                    <span>Explore your creative ideas</span>
                  </motion.div>
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 1.0 }}
                    className="flex items-center gap-3 text-lg"
                  >
                    <div className="p-2 rounded-lg bg-pink-500/20 border border-pink-500/30">
                      <Zap className="h-5 w-5 text-pink-400" />
                    </div>
                    <span>Download and share your creations</span>
                  </motion.div>
                </div>

                {/* Loading Progress Bar */}
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="w-full max-w-md mx-auto mb-8"
                >
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${loadingProgress}%` }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                        animate={{
                          x: ["-100%", "100%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  </div>
                  <motion.p
                    className="text-sm text-gray-400 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    {loadingProgress < 100
                      ? `Loading... ${loadingProgress}%`
                      : "Ready!"}
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: loadingProgress >= 100 ? 1 : 0.5,
                    scale: 1,
                  }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="pt-2"
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => setShowWelcome(false)}
                      disabled={loadingProgress < 100}
                      className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-500 hover:via-purple-500 hover:to-pink-500 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="relative z-10 flex items-center">
                        {loadingProgress >= 100 ? (
                          <>
                            Get Started
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        ) : (
                          <>
                            <motion.div
                              className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-2"
                              animate={{ rotate: 360 }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear",
                              }}
                            />
                            Loading...
                          </>
                        )}
                      </span>
                      {loadingProgress >= 100 && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                          initial={{ x: "-100%" }}
                          whileHover={{ x: "100%" }}
                          transition={{ duration: 0.6 }}
                        />
                      )}
                    </Button>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center space-y-6 mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 backdrop-blur-sm"
            >
              <Sparkles className="h-8 w-8 text-blue-400" />
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 leading-tight">
              AI Image Generator
            </h1>
            <motion.div
              animate={{
                rotate: [0, -360],
              }}
              transition={{
                duration: 20,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
              className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 backdrop-blur-sm"
            >
              <Wand2 className="h-8 w-8 text-purple-400" />
            </motion.div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-2xl md:text-3xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed"
          >
            Transform your ideas into stunning visuals with DALL-E 2
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400"
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-600" />
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              Powered by OpenAI's most advanced image generation model
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-600" />
          </motion.div>
        </motion.div>

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
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant="outline"
                onClick={() => generateImages()}
                className="bg-gradient-to-r from-white/5 to-white/5 hover:from-white/10 hover:to-white/10 text-white border-white/10 hover:border-white/20 px-8 py-6 text-base font-semibold backdrop-blur-sm shadow-lg transition-all duration-300 relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                  Generate More Like This
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
              </Button>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-gray-400 max-w-2xl mx-auto leading-relaxed px-4"
            >
              Click on an image to select it, or use the download button to save
              your favorite generations. Try the new fullscreen viewer with zoom
              capabilities!
            </motion.p>
          </motion.div>
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
