import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { MAX_FILE_MB, MAX_FILE_BYTES } from "../lib/constants";

// ---------------------------------------------------------------------------
// Reusable: single-image uploader (categories)
// ---------------------------------------------------------------------------
export function CategoryImageManager({ image, onChange, error, setError }) {
  const inputRef = useRef(null);

  function handleFile(file) {
    setError("");
    if (!file.type.startsWith("image/")) {
      throw new Error(`"${file.name}" isn't an image file.`);
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`"${file.name}" is over ${MAX_FILE_MB} MB.`);
    }

    onChange(URL.createObjectURL(file))
    setError(error.message)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Image</Label>
        <span className="text-xs text-muted-foreground">
          max {MAX_FILE_MB} MB
        </span>
      </div>

      <div className="group relative h-28 w-28 overflow-hidden rounded-md border bg-muted">
        {image ? (
          <>
            <img
              src={image}
              alt="Category"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="secondary"
                      className="h-7 w-7"
                      onClick={() => inputRef.current?.click()}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Replace image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="h-7 w-7"
                      onClick={() => onChange(null)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Remove image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full flex-col items-center justify-center gap-1 border-dashed text-muted-foreground transition-colors hover:text-primary"
          >
            <ImagePlus className="h-5 w-5" />
            <span className="text-[11px]">Add image</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-xs">{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
