"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import UserSidebar from "@/components/UserSidebar";
import { useRouter } from "next/navigation";
interface Event {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  tags: string[];
  poster_url: string | null;
}

function ViewEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;

      try {
        const response = await fetch(`${BACKEND_URL}/events/getall`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <UserSidebar />

      {/* Main content container */}
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Available Events</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-400">No available events.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
                onClick={() => {
                  router.push(`/viewevents/${event.id}`);
                }}
              >
                {/* Event poster */}
                {event.poster_url ? (
                  <img
                    src={event.poster_url}
                    alt={event.title}
                    className="rounded-lg w-full mb-4 object-cover h-48 cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}

                {/* Event details */}
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <p className="text-gray-300 mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(event.datetime).toLocaleString()}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Location:</strong> {event.location}
                </p>
                {event.tags.length > 0 && (
                  <p className="text-gray-300 mb-4">
                    <strong>Tags:</strong> {event.tags.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewEvents;
