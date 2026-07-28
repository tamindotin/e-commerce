import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

// ---------------------------------------------------------------------------
// Reusable: tag input
// ---------------------------------------------------------------------------
export function TagInput({ tags, onChange }) {
  const [draft, setDraft] = useState("");

  function commit() {
    const value = draft.trim();
    if (value && !tags.includes(value)) {
      onChange([...tags, value]);
    }
    setDraft("");
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 rounded-md border px-2 py-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1 pr-1">
            {tag}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t !== tag))}
              className="rounded-full hover:bg-muted-foreground/20"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (
              e.key === "Backspace" &&
              draft === "" &&
              tags.length > 0
            ) {
              onChange(tags.slice(0, -1));
            }
          }}
          onBlur={commit}
          placeholder={tags.length === 0 ? "Type a tag and press enter" : ""}
          className="min-w-[100px] flex-1 border-0 bg-transparent p-1 text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Press enter or comma to add a tag.
      </p>
    </div>
  );
}
