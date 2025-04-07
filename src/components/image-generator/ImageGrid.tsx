import { MouseEvent } from "react";
import { ImageCard } from "./ImageCard";
import { Skeleton } from "@/components/ui/skeleton";

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <ImageCard
          key={index}
          image={image}
          isSelected={selectedImage?.url === image.url}
          onSelect={() => onSelectImage(image)}
          onDownload={onDownloadImage}
        />
      ))}
    </div>
  );
}
