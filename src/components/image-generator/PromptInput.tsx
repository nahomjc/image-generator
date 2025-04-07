import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EXAMPLE_PROMPTS = [
  "A photorealistic portrait of a woman with flowing golden hair, standing in a field of wildflowers at sunset, cinematic lighting",
  "A detailed architectural visualization of a futuristic city with flying cars and holographic advertisements, ray-traced reflections",
  "A magical forest scene with bioluminescent plants and floating lanterns, atmospheric lighting, fantasy art style",
  "A cute robot playing with a cat in a cozy living room, warm lighting, Pixar-style animation",
];

interface PromptInputProps {
  prompt: string;
  loading: boolean;
  onPromptChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
}

export function PromptInput({
  prompt,
  loading,
  onPromptChange,
  onGenerate,
}: PromptInputProps) {
  const [showExamples, setShowExamples] = useState(false);
  const [expandedExamples, setExpandedExamples] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const visibleExamples =
    isMobile && !expandedExamples
      ? EXAMPLE_PROMPTS.slice(0, 2)
      : EXAMPLE_PROMPTS;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Input
            placeholder="Describe your image in detail... (DALL-E 2 works best with detailed descriptions)"
            value={prompt}
            onChange={onPromptChange}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400 pr-10"
            disabled={loading}
            onFocus={() => setShowExamples(true)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500"
            onClick={() => setShowExamples(!showExamples)}
          >
            <Sparkles className="h-4 w-4 hover:text-blue-500" />
          </Button>
        </div>
        <Button
          onClick={onGenerate}
          disabled={loading || !prompt}
          className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>

      {showExamples && (
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-400">
              Try these detailed examples:
            </p>
            {isMobile && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-400 hover:text-blue-300"
                onClick={() => setExpandedExamples(!expandedExamples)}
              >
                {expandedExamples ? (
                  <>
                    Show less <ChevronUp className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    Show more <ChevronDown className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {visibleExamples.map((example, index) => (
              <Badge
                key={index}
                variant="secondary"
                className={cn(
                  "cursor-pointer hover:bg-white/20 transition-all duration-200 overflow-hidden text-ellipsis pl-4 pr-3 py-2 text-left max-w-full",
                  prompt === example && "ring-2 ring-blue-500 bg-blue-900/30"
                )}
                onClick={() => {
                  onPromptChange({
                    target: { value: example },
                  } as ChangeEvent<HTMLInputElement>);
                  setShowExamples(false);
                }}
              >
                <span className="text-left block truncate">{example}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <div className="mt-2 text-sm text-gray-400">
          Your image is being generated with DALL-E 2. This may take a few
          moments...
        </div>
      )}
    </div>
  );
}
