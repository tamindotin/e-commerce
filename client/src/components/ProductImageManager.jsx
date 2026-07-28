import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ImagePlus, RefreshCw, Trash2 } from "lucide-react";
import { MAX_IMAGES, MAX_FILE_MB, MAX_FILE_BYTES } from "../lib/constants";

// ---------------------------------------------------------------------------
// Reusable: multi-image uploader (products)
// ---------------------------------------------------------------------------
export function ProductImageManager({ images, onChange, error, setError }) {
  const inputRef = useRef(null);
  const [replaceIndex, setReplaceIndex] = useState(null);

  function validate(file) {
    if (!file.type.startsWith("image/")) {
      throw new Error(`"${file.name}" isn't an image file.`);
    }

    if (file.size > MAX_FILE_BYTES) {
      throw new Error(`"${file.name}" is over ${MAX_FILE_MB} MB.`);
    }
  }

  function handleAddFiles(fileList) {
    setError("");
    const files = Array.from(fileList);

    const remaining = MAX_IMAGES - images.length;
    if (remaining <= 0) {
      throw new Error(`You can only add up to ${MAX_IMAGES} images.`);
    }

    const toProcess = files.slice(0, remaining);
    if (files.length > remaining) {
      throw new Error(
        `Only ${remaining} more image${remaining === 1 ? "" : "s"} can be added (max ${MAX_IMAGES} total).`,
      );
    }

    const next = [...images];
    for (const file of toProcess) {
      try {
        validate(file);

        next.push({
          file: file,
          preview: URL.createObjectURL(file),
        });
      } catch (err) {
        setError(err.message);
      }
    }
    onChange(next);
  }

  function handleReplaceFile(file, index) {
    setError("");

    try {
      validate(file);
      const next = [...images];

      URL.revokeObjectURL(next[index].preview);

      next[index] = {
        file,
        preview: URL.createObjectURL(file),
      };

      onChange(next);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleRemove(index) {
    URL.revokeObjectURL(images[index].preview);
    const next = images.filter((_, i) => i !== index);
    onChange(next);
    setError("");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Images</Label>
        <span className="text-xs text-muted-foreground">
          {images.length}/{MAX_IMAGES} · max {MAX_FILE_MB} MB each
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {images.map((img, index) => (
          <div
            key={img.preview}
            className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
          >
            <img
              src={img.preview}
              alt={`Product ${index + 1}`}
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
                      onClick={() => {
                        setReplaceIndex(index);
                        inputRef.current?.click();
                      }}
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
                      onClick={() => handleRemove(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Delete image</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Badge
              className="absolute left-1 top-1 h-5 px-1.5 text-[10px]"
              variant="secondary"
            >
              {index + 1}
            </Badge>
          </div>
        ))}

        {images.length < MAX_IMAGES && (
          <button
            type="button"
            onClick={() => {
              setReplaceIndex(null);
              inputRef.current?.click();
            }}
            className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground transition-colors hover:border-primary hover:text-primary"
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
        multiple={replaceIndex === null}
        className="hidden"
        onChange={(e) => {
          const files = e.target.files;
          if (!files || files.length === 0) return;
          if (replaceIndex !== null) {
            handleReplaceFile(files[0], replaceIndex);
          } else {
            handleAddFiles(files);
          }
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
