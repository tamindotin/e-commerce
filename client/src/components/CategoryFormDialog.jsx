import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { CategoryImageManager } from "./CategoryImageManager";
import { uid } from "../lib/utils";

// ---------------------------------------------------------------------------
// Category form dialog (add / edit)
// ---------------------------------------------------------------------------
export function CategoryFormDialog({ open, onOpenChange, initial, onSave }) {
  const isEdit = Boolean(initial);
  const [name, setName] = useState(initial?.name || "");
  const [image, setImage] = useState(initial?.image || null);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");

  React.useEffect(() => {
    if (open) {
      setName(initial?.name || "");
      setImage(initial?.image || null);
      setImageError("");
      setFormError("");
    }
  }, [open, initial]);

  function handleSubmit() {
    if (!name.trim()) return setFormError("Category name is required.");
    setFormError("");
    onSave({ id: initial?.id || uid("cat"), name: name.trim(), image });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit category" : "Add category"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the category's name or image."
              : "Create a new product category."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-1">
          <CategoryImageManager
            image={image}
            onChange={setImage}
            error={imageError}
            setError={setImageError}
          />

          <div className="space-y-1.5">
            <Label htmlFor="c-name">Category name</Label>
            <Input
              id="c-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Footwear"
            />
          </div>
        </div>

        {formError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">{formError}</AlertDescription>
          </Alert>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEdit ? "Save changes" : "Add category"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
