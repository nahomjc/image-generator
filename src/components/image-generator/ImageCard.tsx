import { MouseEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ImageCardProps {
  image: {
    url: string;
    revised_prompt?: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  onDownload: (url: string, e: MouseEvent<HTMLButtonElement>) => void;
}

export function ImageCard({
  image,
  isSelected,
  onSelect,
  onDownload,
}: ImageCardProps) {
  return (
    <Card
      className={`relative group overflow-hidden cursor-pointer transition-all duration-300 ${
        isSelected ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={onSelect}
    >
      <div className="relative w-full h-64">
        <Image
          src={image.url}
          alt={image.revised_prompt || "Generated image"}
          width={500}
          height={500}
          className="object-cover"
          priority
          onError={(e) => {
            console.error("Image failed to load:", image.url);
            e.currentTarget.src =
              "https://via.placeholder.com/500x500?text=Image+Not+Found";
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex items-center justify-center">
          <Button
            variant="secondary"
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer "
            onClick={(e: MouseEvent<HTMLButtonElement>) =>
              onDownload(image.url, e)
            }
          >
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
}
