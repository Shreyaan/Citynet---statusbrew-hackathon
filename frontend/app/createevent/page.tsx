// EventForm.jsx
'use client';
import { format } from "date-fns"

import { createClient } from '@/utils/supabase/client';
import React, { useState } from 'react';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import UserSidebar from '@/components/UserSidebar'; // Import the sidebar
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from '@radix-ui/react-icons';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';


function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = React.useState<Date>()

  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [poster, setPoster] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('datetime', date ? date.toISOString() : '');
    formData.append('location', location);
    formData.append('tags', tags);
    if (poster) {
      formData.append('poster', poster);
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

    const client = createClient();
    const session = await client.auth.getSession();
    const accessToken = session.data?.session?.access_token;

    const response = await fetch(`${BACKEND_URL}/events/create`, {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    const data = await response.json();
    if (data.success) {
      alert('Event submitted successfully!');
    } else {
      alert('Error submitting event.');
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
          <p className="text-gray-400 mb-6">Deploy your new event in one click.</p>

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
            <label className="text-gray-400 block mb-2">Event Description</label>
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
            <label className="text-gray-400 block mb-2">Event Date & Time</label>
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
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
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
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full p-3 bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent rounded-md"
              placeholder="Comma separated tags"
            />
          </div>

          {/* Poster Upload */}
          <div className="mb-6">
            <label className="text-gray-400 block mb-2">Event Poster</label>
            <input
              type="file"
              onChange={(e) => setPoster(e.target.files ? e.target.files[0] : null)}
              className="w-full text-gray-400 bg-black p-3 rounded-md focus:outline-none"
              accept="image/*"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-800 text-gray-400 py-2 px-4 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-white text-black py-2 px-6 rounded-md hover:bg-gray-200 transition"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventForm;
