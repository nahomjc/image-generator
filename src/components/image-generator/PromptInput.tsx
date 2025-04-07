import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
          <p className="text-sm text-gray-400">Try these detailed examples:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((example, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="cursor-pointer hover:bg-white/20 transition-colors"
                onClick={() => {
                  onPromptChange({
                    target: { value: example },
                  } as ChangeEvent<HTMLInputElement>);
                  setShowExamples(false);
                }}
              >
                {example}
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
