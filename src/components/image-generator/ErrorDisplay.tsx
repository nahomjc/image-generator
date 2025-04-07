interface ErrorDisplayProps {
  error: string | null;
}

export function ErrorDisplay({ error }: ErrorDisplayProps) {
  if (!error) return null;

  return (
    <div className="text-center p-4 bg-red-900/30 rounded-lg border border-red-800 text-red-200">
      <p className="font-medium">Error: {error}</p>
      <p className="text-sm mt-2">
        {error.includes("safety system") ? (
          <>
            Your prompt was rejected by our safety system. Please try a
            different prompt that doesn't contain potentially harmful or
            inappropriate content.
            <br />
            <span className="text-xs italic mt-1 block">
              Tips: Avoid prompts about violence, explicit content, or
              copyrighted material.
            </span>
          </>
        ) : (
          "If you're seeing a this error, please check your OpenAI API key ."
        )}
      </p>
    </div>
  );
}
