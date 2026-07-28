import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ProductImageManager } from "./ProductImageManager";
import { TagInput } from "./TagInput";
import { uid } from "../lib/utils";

// ---------------------------------------------------------------------------
// Product form dialog (add / edit)
// ---------------------------------------------------------------------------
const emptyProduct = {
  name: "",
  description: "",
  brand: "",
  category: "",
  model: "",
  price: "",
  stock: "",
  sku: "",
  specification: "",
  tags: [],
  images: [],
};

export function ProductFormDialog({
  open,
  onOpenChange,
  categories,
  initial,
  onSave,
}) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(initial || emptyProduct);
  const [imageError, setImageError] = useState("");
  const [formError, setFormError] = useState("");

  React.useEffect(() => {
    if (open) {
      setForm(initial || emptyProduct);
      setImageError("");
      setFormError("");
    }
  }, [open, initial]);

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit() {
    if (!form.name.trim()) return setFormError("Product name is required.");
    if (!form.category) return setFormError("Choose a category.");
    if (!form.sku.trim()) return setFormError("SKU is required.");
    if (form.price === "" || Number(form.price) < 0)
      return setFormError("Enter a valid price.");
    if (form.stock === "" || Number(form.stock) < 0)
      return setFormError("Enter a valid stock quantity.");

    setFormError("");
    onSave({
      ...form,
      id: initial?.id || uid("prod"),
      price: Number(form.price),
      stock: Number(form.stock),
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update the product's details, images, or stock."
              : "Fill in the product details to add it to your catalog."}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-5 py-1">
            <ProductImageManager
              images={form.images}
              onChange={(images) => set("images", images)}
              error={imageError}
              setError={setImageError}
            />

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="p-name">Product name</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Aero Runner Sneaker"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="p-desc">Description</Label>
                <Textarea
                  id="p-desc"
                  rows={3}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Short description of the product"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-brand">Brand</Label>
                <Input
                  id="p-brand"
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                  placeholder="Voltrun"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => set("category", v)}
                >
                  <SelectTrigger id="p-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-model">Model</Label>
                <Input
                  id="p-model"
                  value={form.model}
                  onChange={(e) => set("model", e.target.value)}
                  placeholder="AR-220"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-sku">SKU</Label>
                <Input
                  id="p-sku"
                  value={form.sku}
                  onChange={(e) => set("sku", e.target.value)}
                  placeholder="VR-AR220-BLK"
                  className="font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-price">Price (₹)</Label>
                <Input
                  id="p-price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  placeholder="4499"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="p-stock">Stock quantity</Label>
                <Input
                  id="p-stock"
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value)}
                  placeholder="32"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label htmlFor="p-spec">Specification</Label>
                <Textarea
                  id="p-spec"
                  rows={3}
                  value={form.specification}
                  onChange={(e) => set("specification", e.target.value)}
                  placeholder={
                    "One per line, e.g.\nWeight: 240g\nSole: EVA foam"
                  }
                  className="font-mono text-sm"
                />
              </div>

              <div className="col-span-2 space-y-1.5">
                <Label>Tags</Label>
                <TagInput
                  tags={form.tags}
                  onChange={(tags) => set("tags", tags)}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

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
            {isEdit ? "Save changes" : "Add product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
