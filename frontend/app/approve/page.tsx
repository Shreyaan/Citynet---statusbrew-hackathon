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
  poster_filename: string | null;
}

function Approve() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const client = createClient();
      const session = await client.auth.getSession();
      const accessToken = session.data?.session?.access_token;

      console.log(accessToken);

      const response = await fetch(`${BACKEND_URL}/events/admin`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const approveEvent = (id: string) => {
    // Logic to approve event goes here
    console.log(`Approved event with id: ${id}`);
  };

  const rejectEvent = (id: string) => {
    // Logic to reject event goes here
    console.log(`Rejected event with id: ${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex">
      <Sidebar />

      {/* Main content container */}
      <div className="flex-grow p-6">
        {/* Event list or no events message */}
        {events.length === 0 ? (
          <p className="text-gray-400">No pending events.</p>
        ) : (
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-gray-800 p-6 rounded-lg shadow-md"
              >
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-400 mb-4">{event.description}</p>
                <p className="text-gray-300 mb-2">
                  <strong>Date:</strong>{" "}
                  {new Date(event.datetime).toLocaleString()}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Location:</strong> {event.location}
                </p>
                <p className="text-gray-300 mb-2">
                  <strong>Status:</strong> {event.approval_status}
                </p>
                <p className="text-gray-300 mb-4">
                  <strong>Tags:</strong> {event.tags.join(", ")}
                </p>

                {/* Buttons to approve/reject */}
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => approveEvent(event.id)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectEvent(event.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
                  >
                    Reject
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
