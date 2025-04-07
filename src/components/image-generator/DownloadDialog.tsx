import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DownloadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function DownloadDialog({
  open,
  onOpenChange,
  onConfirm,
}: DownloadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Download Image
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Are you sure you want to download this image? It will be saved to
            your downloads folder.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white/5 hover:bg-white/10 text-white border-white/10 hover:border-white/20"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
