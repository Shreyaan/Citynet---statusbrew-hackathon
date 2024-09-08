"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import UserSidebar from "@/components/UserSidebar";

interface RSVP {
  id: number;
  event_id: number;
  event_title: string;
  status: string;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  datetime: string;
  location: string;
}

function UserRSVPPage() {
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;
      setAccessToken(token || null);

      try {
        // Fetch user's RSVPs
        const rsvpResponse = await fetch(`${BACKEND_URL}/rsvp/my-rsvps`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const rsvpData = await rsvpResponse.json();
        setRSVPs(rsvpData);

        // Fetch available events
        const eventsResponse = await fetch(`${BACKEND_URL}/events/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedEventId) return;
    setIsSubmitting(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${BACKEND_URL}/rsvp/${selectedEventId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: "attending" }),
      });

      if (response.ok) {
        // Refresh RSVPs list
        const updatedResponse = await fetch(`${BACKEND_URL}/rsvp/my-rsvps`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const updatedData = await updatedResponse.json();
        setRSVPs(updatedData);
        setSelectedEventId(null);
      } else {
        console.error("Failed to submit RSVP");
      }
    } catch (error) {
      console.error("Error submitting RSVP:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <UserSidebar />
      <div className="flex-grow p-6 ml-20 align-center justify-center">
        <h1 className="text-2xl font-bold mb-6">Manage Your RSVPs</h1>

        {/* RSVP Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">RSVP to an Event</h2>
          <select
            value={selectedEventId || ""}
            onChange={(e) => setSelectedEventId(Number(e.target.value))}
            className="bg-gray-800 p-2 rounded mr-4"
            required
          >
            <option value="">Select an event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.title}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit RSVP"}
          </button>
        </form>

        {/* RSVPs List */}
        <h2 className="text-xl font-semibold mb-4">Your RSVPs</h2>
        {isLoading ? (
          <p>Loading RSVPs...</p>
        ) : rsvps.length === 0 ? (
          <p>No RSVPs found.</p>
        ) : (
          <div className="grid gap-4">
            {rsvps.map((rsvp) => (
              <div key={rsvp.id} className="bg-gray-800 p-4 rounded">
                <h3 className="font-semibold">{rsvp.event_title}</h3>
                <p>Status: {rsvp.status}</p>
                <p>
                  RSVPd on: {new Date(rsvp.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserRSVPPage;
