"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import UserSidebar from "@/components/UserSidebar";
import  Image  from "next/image";

interface Event {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  tags: string[];
  poster_filename: string | null;
}

function ViewEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const client = createClient();
      const session = await client.auth.getSession();
      const accessToken = session.data?.session?.access_token;

      const response = await fetch(`${BACKEND_URL}/events/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <UserSidebar />

      {/* Main content container */}
      <div className="flex-grow p-6">
        <h1 className="text-3xl font-bold mb-6">Available Events</h1>
        {events.length === 0 ? (
          <p className="text-gray-400">No available events.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 p-6 rounded-lg shadow-lg"
              >
                {/* Event poster */}
                {event.poster_filename ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/posters/${event.poster_filename}`}
                    alt={event.title}
                    className="rounded-lg w-full mb-4 object-cover h-48"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-700 flex items-center justify-center rounded-lg mb-4">
                    <span className="text-gray-400">No Image Available</span>
                  </div>
                )}

                {/* Event details */}
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-400 mb-2">{event.description}</p>
                <p className="text-gray-300 mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(event.datetime).toLocaleString()}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Location:</strong> {event.location}
                </p>
                {event.tags.length > 0 && (
                  <p className="text-gray-300">
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
