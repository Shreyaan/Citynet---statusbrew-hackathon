// EventForm.jsx
"use client";
import { format } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";

import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";
import UserSidebar from "@/components/UserSidebar"; // Import the sidebar
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function EventForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = React.useState<Date>();

  const [location, setLocation] = useState("");
  // const [tags, setTags] = useState("");
  const [poster, setPoster] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const tagOptions = [
    "Music",
    "Art",
    "Technology",
    "Sports",
    "Food",
    "Fashion",
    "Education",
    "Business",
    "Health",
    "Entertainment",
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!date) newErrors.date = "Date is required";
    if (!location.trim()) newErrors.location = "Location is required";
    if (selectedTags.length === 0)
      newErrors.tags = "At least one tag is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("datetime", date ? date.toISOString() : "");
    formData.append("location", location);
    formData.append("tags", selectedTags.join(","));
    if (poster) {
      formData.append("poster", poster);
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const client = createClient();
    const session = await client.auth.getUser();
    const token = session.data?.user?.id;

    try {
      const response = await fetch(`${BACKEND_URL}/events/create`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/viewevents/${data.event_id}`);
      } else {
        setErrors({ submit: "Error submitting event. Please try again." });
      }
    } catch (error) {
      setErrors({ submit: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <form
          onSubmit={handleSubmit}
          className="relative bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg 
          before:content-[''] before:absolute before:inset-0 before:rounded-lg 
          before:p-[2px] before:bg-gradient-to-r before:from-purple-500 
          before:via-blue-500 before:to-green-500 before:z-[-1]"
        >
          <h2 className="text-white text-2xl mb-4 font-bold">Create Event</h2>
          <p className="text-gray-400 mb-6">
            Deploy your new event in one click.
          </p>

          {/* Title */}
          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent rounded-md"
              placeholder="Enter event title"
              required
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="text-gray-400 block mb-2">
              Event Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent rounded-md"
              placeholder="Enter event description"
              required
            />
          </div>

          {/* Date & Time */}
          <div className="mb-4">
            <label className="text-gray-400 block mb-2">
              Event Date & Time
            </label>
            <div className="flex space-x-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Event Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent rounded-md"
              placeholder="Enter event location"
              required
            />
          </div>

          {/* Tags */}
          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Tags</label>
            <MultiSelect
              options={tagOptions}
              selected={selectedTags}
              onChange={setSelectedTags}
              placeholder="Select up to 10 tags"
              className="w-full bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent rounded-md"
            />
          </div>

          {/* Poster Upload */}
          <div className="mb-6">
            <label className="text-gray-400 block mb-2">Event Poster</label>
            <input
              type="file"
              onChange={(e) =>
                setPoster(e.target.files ? e.target.files[0] : null)
              }
              className="w-full text-gray-400 bg-black p-3 rounded-md focus:outline-none"
              accept="image/*"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-800 text-gray-400 py-2 px-4 rounded-md hover:bg-gray-700 transition"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-white text-black py-2 px-6 rounded-md hover:bg-gray-200 transition disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;

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
