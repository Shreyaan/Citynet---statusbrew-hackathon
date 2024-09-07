"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

interface Event {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location: string;
  approval_status: string;
  tags: string[];
  poster_url: string | null;
}

function Approve() {
  const [events, setEvents] = useState<Event[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingEventId, setLoadingEventId] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;
      setAccessToken(token || null);

      console.log(accessToken);

      const response = await fetch(`${BACKEND_URL}/events/admin/pending`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      // Filter events to show only pending ones
      setEvents(data);
      setIsLoading(false);
    };

    fetchEvents();
  }, []);

  const approveEvent = async (id: string) => {
    if (!accessToken) return;
    setLoadingEventId(id);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(
        `${BACKEND_URL}/events/admin/approve/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        // Remove the approved event from the list
        setEvents(events.filter((event) => event.id !== id));
        console.log(`Approved event with id: ${id}`);
      } else {
        console.error("Failed to approve event");
      }
    } catch (error) {
      console.error("Error approving event:", error);
    } finally {
      setLoadingEventId(null);
    }
  };

  const rejectEvent = async (id: string) => {
    if (!accessToken) return;
    setLoadingEventId(id);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${BACKEND_URL}/events/admin/reject/${id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        // Remove the rejected event from the list
        setEvents(events.filter((event) => event.id !== id));
        console.log(`Rejected event with id: ${id}`);
      } else {
        console.error("Failed to reject event");
      }
    } catch (error) {
      console.error("Error rejecting event:", error);
    } finally {
      setLoadingEventId(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      {/* Main content container */}
      <div className="flex-grow p-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-300"></div>
          </div>
        ) : events.length === 0 ? (
          <p className="text-gray-400">No pending events.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative bg-gray-900 p-8 rounded-lg shadow-lg 
                before:content-[''] before:absolute before:inset-0 before:rounded-lg 
                before:p-[2px] before:bg-gradient-to-r before:from-purple-500 
                before:via-blue-500 before:to-green-500 before:z-[-1]"
              >
                <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>

                <div className="mb-4">
                  <label className="text-gray-400 block mb-2">
                    Date & Time
                  </label>
                  <p className="text-white">
                    {new Date(event.datetime).toLocaleString()}
                  </p>
                </div>

                <div className="mb-4">
                  <label className="text-gray-400 block mb-2">Location</label>
                  <p className="text-white">{event.location}</p>
                </div>

                <div className="mb-4">
                  <label className="text-gray-400 block mb-2">
                    Description
                  </label>
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
                    <label className="text-gray-400 block mb-2">
                      Event Poster
                    </label>
                    <img
                      src={event.poster_url}
                      alt={`Poster for ${event.title}`}
                      width={300}
                      height={200}
                      className="rounded-lg"
                    />
                  </div>
                )}

                {/* Buttons to approve/reject */}
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => approveEvent(event.id)}
                    disabled={loadingEventId === event.id}
                    className="bg-white text-black py-2 px-6 rounded-md hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingEventId === event.id ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      "Approve"
                    )}
                  </button>
                  <button
                    onClick={() => rejectEvent(event.id)}
                    disabled={loadingEventId === event.id}
                    className="bg-gray-800 text-gray-400 py-2 px-4 rounded-md hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loadingEventId === event.id ? (
                      <span className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing
                      </span>
                    ) : (
                      "Reject"
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Approve;
