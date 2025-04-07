import { MouseEvent } from "react";
import { ImageCard } from "./ImageCard";

interface GeneratedImage {
  url: string;
  revised_prompt?: string;
}

interface ImageGridProps {
  images: GeneratedImage[];
  selectedImage: GeneratedImage | null;
  onSelectImage: (image: GeneratedImage) => void;
  onDownloadImage: (url: string, e: MouseEvent<HTMLButtonElement>) => void;
}

export function ImageGrid({
  images,
  selectedImage,
  onSelectImage,
  onDownloadImage,
}: ImageGridProps) {
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
