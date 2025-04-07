import { MouseEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Info } from "lucide-react";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      className={`relative group overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
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
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority
          onError={(e) => {
            console.error("Image failed to load:", image.url);
            e.currentTarget.src =
              "https://via.placeholder.com/500x500?text=Image+Not+Found";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {image.revised_prompt && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-2 text-white/80 text-sm mb-2">
                      <Info className="h-4 w-4" />
                      <span className="truncate">AI Enhanced Prompt</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>{image.revised_prompt}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border-none"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  onDownload(image.url, e);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
