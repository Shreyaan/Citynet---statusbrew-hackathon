import { Check, ChevronsUpDown } from "lucide-react";

import React, { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder: string;
  className?: string;
}

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleTagToggle = (tag: string) => {
    const updatedTags = selected.includes(tag)
      ? selected.filter((t) => t !== tag)
      : [...selected, tag];
    onChange(updatedTags.slice(0, 10)); // Limit to 10 tags
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selected.length > 0 ? selected.join(", ") : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <div className="max-h-60 overflow-auto">
          {options.map((option) => (
            <div
              key={option}
              className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                selected.includes(option) && "bg-accent text-accent-foreground"
              )}
              onClick={() => handleTagToggle(option)}
            >
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selected.includes(option) ? "opacity-100" : "opacity-0"
                )}
              />
              {option}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
