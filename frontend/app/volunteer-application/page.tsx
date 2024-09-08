"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import UserSidebar from "@/components/UserSidebar";

interface Application {
  id: string;
  event_id: string;
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
  tags: string[];
}

function VolunteerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Form state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [eventId, setEventId] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [availability, setAvailability] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  const [isEventsLoading, setIsEventsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userProfile, setUserProfile] = useState({
    email: "",
    phone_number: "",
  });

  const handleEventClick = (eventId: number) => {
    setSelectedEventId(eventId);
  };

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;
      setAccessToken(token || null);

      try {
        const response = await fetch(
          `${BACKEND_URL}/volunteer/my-applications`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsEventsLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const response = await fetch(`${BACKEND_URL}/events/getall`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsEventsLoading(false);
      }
    };

    if (accessToken) {
      fetchEvents();
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!accessToken) return;

      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const response = await fetch(`${BACKEND_URL}/user/dashboard/profile`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setUserProfile({
          email: data.email || "",
          phone_number: data.phone_number || "",
        });
        setEmail(data.email || "");
        setPhoneNumber(data.phone_number || "");
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken || !selectedEventId) return;
    setIsSubmitting(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(
        `${BACKEND_URL}/volunteer/apply/${selectedEventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            email,
            phone_number: phoneNumber,
            address,
            availability,
            skills,
          }),
        }
      );

      if (response.ok) {
        // Refresh applications list
        const updatedResponse = await fetch(
          `${BACKEND_URL}/volunteer/my-applications`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const updatedData = await updatedResponse.json();
        setApplications(updatedData);

        // Reset form
        setEventId("");
        setEmail("");
        setPhoneNumber("");
        setAddress("");
        setAvailability("");
        setSkills([]);
      } else {
        console.error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <UserSidebar />

      <div className="flex-grow p-20 ml-20">
        <h1 className="text-2xl font-bold mb-6">Volunteer Applications</h1>

        {/* Application Form */}
        <form onSubmit={handleSubmit} className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Apply for Volunteer Position
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <select
              value={selectedEventId || ""}
              onChange={(e) => setSelectedEventId(Number(e.target.value))}
              className="bg-gray-800 p-2 rounded"
              required
            >
              <option value="">Select an event</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title}
                </option>
              ))}
            </select>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-gray-800 p-2 rounded"
              required
            />
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
              className="bg-gray-800 p-2 rounded"
              required
            />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Address"
              className="bg-gray-800 p-2 rounded"
              required
            />
            <input
              type="text"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              placeholder="Availability"
              className="bg-gray-800 p-2 rounded"
              required
            />
            <input
              type="text"
              value={skills.join(", ")}
              onChange={(e) => setSkills(e.target.value.split(", "))}
              placeholder="Skills (comma-separated)"
              className="bg-gray-800 p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </button>
        </form>

        {/* Events List */}
        <h2 className="text-xl font-semibold mb-4">Available Events</h2>
        {isEventsLoading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events available.</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event) => (
              <div
                key={event.id}
                className={`bg-gray-800 p-4 rounded cursor-pointer ${
                  selectedEventId === event.id ? "border-2 border-blue-500" : ""
                }`}
                onClick={() => handleEventClick(event.id)}
              >
                <h3 className="font-semibold">{event.title}</h3>
                <p>{event.description}</p>
                <p>Date: {new Date(event.datetime).toLocaleString()}</p>
                <p>Location: {event.location}</p>
                <p>Tags: {event.tags.join(", ")}</p>
              </div>
            ))}
          </div>
        )}

        {/* Applications List */}
        <h2 className="text-xl font-semibold mb-4">Your Applications</h2>
        {isLoading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No applications found.</p>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div key={app.id} className="bg-gray-800 p-4 rounded">
                <h3 className="font-semibold">{app.event_title}</h3>
                <p>Status: {app.status}</p>
                <p>
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VolunteerPage;
