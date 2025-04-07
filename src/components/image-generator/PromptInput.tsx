import { ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

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
  return (
    <div className="w-full max-w-3xl mx-auto bg-white/5 p-4 rounded-lg backdrop-blur-sm border border-white/10 shadow-xl">
      <div className="flex gap-4">
        <Input
          placeholder="Describe the image you want to generate..."
          value={prompt}
          onChange={onPromptChange}
          className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
        <Button
          onClick={onGenerate}
          disabled={loading || !prompt}
          className="min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
    </div>
  );
}
