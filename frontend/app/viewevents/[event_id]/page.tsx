"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import UserSidebar from "@/components/UserSidebar";

interface Event {
  approval_status: string;
  datetime: string;
  description: string;
  id: number;
  location: string;
  poster_url: string | null;
  tags: string[];
  title: string;
  user_id: string;
}

export default function EventPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { event_id } = useParams();
  const router = useRouter();

  useEffect(() => {
    async function fetchEvent() {
      try {
        const client = createClient();
        const session = await client.auth.getUser();
        const token = session.data?.user?.id;

        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
        const response = await fetch(`${BACKEND_URL}/events/${event_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();
        setEvent(data);
      } catch (err) {
        setError("Error fetching event details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchEvent();
  }, [event_id]);

  if (loading)
    return (
      <div className="flex min-h-screen bg-black text-white justify-center items-center">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="flex min-h-screen bg-black text-white justify-center items-center">
        {error}
      </div>
    );
  if (!event)
    return (
      <div className="flex min-h-screen bg-black text-white justify-center items-center">
        Event not found
      </div>
    );

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div
          className="relative bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-lg 
          before:content-[''] before:absolute before:inset-0 before:rounded-lg 
          before:p-[2px] before:bg-gradient-to-r before:from-purple-500 
          before:via-blue-500 before:to-green-500 before:z-[-1]"
        >
          <h1 className="text-white text-2xl mb-4 font-bold">{event.title}</h1>
          <p className="text-gray-400 mb-6">Event Details</p>

          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Date & Time</label>
            <p className="text-white">
              {new Date(event.datetime).toLocaleString()}
            </p>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Location</label>
            <p className="text-white">{event.location}</p>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Description</label>
            <p className="text-white">{event.description}</p>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Tags</label>
            <p className="text-white">{event.tags.join(", ")}</p>
          </div>

          <div className="mb-4">
            <label className="text-gray-400 block mb-2">Status</label>
            <p className="text-white">{event.approval_status}</p>
          </div>

          {event.poster_url && (
            <div className="mb-6">
              <label className="text-gray-400 block mb-2">Event Poster</label>
              <img
                src={event.poster_url}
                alt="Event poster"
                className="max-w-full h-auto rounded-md"
              />
            </div>
          )}

          <div className="flex justify-between">
            <button
              onClick={() => router.back()}
              className="bg-gray-800 text-gray-400 py-2 px-4 rounded-md hover:bg-gray-700 transition"
            >
              Back
            </button>
            <button
              onClick={() => {
                /* Add edit functionality */
              }}
              className="bg-white text-black py-2 px-6 rounded-md hover:bg-gray-200 transition"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
