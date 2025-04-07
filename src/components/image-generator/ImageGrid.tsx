import { MouseEvent, useState } from "react";
import { ImageCard } from "./ImageCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageViewer } from "./ImageViewer";
import { motion } from "framer-motion";

interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

interface ImageGridProps {
  images: GeneratedImage[];
  selectedImage: GeneratedImage | null;
  onSelectImage: (image: GeneratedImage) => void;
  onDownloadImage: (url: string, e: MouseEvent<HTMLButtonElement>) => void;
  loading?: boolean;
}

export function ImageGrid({
  images,
  selectedImage,
  onSelectImage,
  onDownloadImage,
  loading = false,
}: ImageGridProps) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const handleViewFullscreen = (index: number) => {
    setViewerIndex(index);
    setViewerOpen(true);
  };

  const handleCloseViewer = () => {
    setViewerOpen(false);
  };

  const handleDownloadFromViewer = (url: string) => {
    // Create a synthetic event for the download handler
    const syntheticEvent = {
      stopPropagation: () => {},
    } as MouseEvent<HTMLButtonElement>;

    onDownloadImage(url, syntheticEvent);
    setViewerOpen(false);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="relative w-full h-64">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  if (images.length === 0) return null;

  return (
    <>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <ImageCard
              image={image}
              isSelected={selectedImage?.url === image.url}
              onSelect={() => onSelectImage(image)}
              onDownload={onDownloadImage}
              onViewFullscreen={() => handleViewFullscreen(index)}
              index={index}
            />
          </motion.div>
        ))}
      </motion.div>

      <ImageViewer
        images={images}
        initialImageIndex={viewerIndex}
        isOpen={viewerOpen}
        onClose={handleCloseViewer}
        onDownload={handleDownloadFromViewer}
      />
    </>
  );
}
