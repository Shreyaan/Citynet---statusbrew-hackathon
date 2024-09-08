"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

interface RSVP {
  id: number;
  event_id: number;
  user_id: string;
  email: string;
  status: string;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
}

function AdminRSVPPage() {
  const [rsvps, setRSVPs] = useState<RSVP[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;
      setAccessToken(token || null);

      try {
        // Fetch events
        const eventsResponse = await fetch(`${BACKEND_URL}/events/getall`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventsData = await eventsResponse.json();
        setEvents(eventsData);

        // If there are events, fetch RSVPs for the first event
        if (eventsData.length > 0) {
          setSelectedEventId(eventsData[0].id);
          const rsvpResponse = await fetch(
            `${BACKEND_URL}/rsvp/${eventsData[0].id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const rsvpData = await rsvpResponse.json();
          setRSVPs(rsvpData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEventChange = async (eventId: number) => {
    setSelectedEventId(eventId);
    setIsLoading(true);
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${BACKEND_URL}/rsvp/${eventId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const data = await response.json();
      setRSVPs(data);
    } catch (error) {
      console.error("Error fetching RSVPs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      <div className="flex-grow p-6 ml-2s0">
        <h1 className="text-2xl font-bold mb-6">Event RSVPs</h1>

        {/* Event Selector */}
        <select
          value={selectedEventId || ""}
          onChange={(e) => handleEventChange(Number(e.target.value))}
          className="bg-gray-800 p-2 rounded mb-4"
        >
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
            </option>
          ))}
        </select>

        {/* RSVPs List */}
        {isLoading ? (
          <p>Loading RSVPs...</p>
        ) : rsvps.length === 0 ? (
          <p>No RSVPs found for this event.</p>
        ) : (
          <div className="grid gap-4">
            {rsvps.map((rsvp) => (
              <div key={rsvp.id} className="bg-gray-800 p-4 rounded">
                <p>User: {rsvp.email}</p>
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

export default AdminRSVPPage;
