"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

interface Application {
  id: number;
  event_id: number;
  event_title: string;
  user_id: string;
  email: string;
  status: string;
  address: string;
  availability: string;
  phone_number: string;
  skills: string[];
  // Note: event_title and created_at are not present in the API response
}

function AdminVolunteerPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;
      setAccessToken(token || null);

      try {
        const response = await fetch(`${BACKEND_URL}/volunteer/admin/pending`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const handleApprove = async (applicationId: string) => {
    if (!accessToken) return;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(
        `${BACKEND_URL}/volunteer/admin/approve/${applicationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        setApplications(
          applications.filter((app) => app.id.toString() !== applicationId)
        );
      } else {
        console.error("Failed to approve application");
      }
    } catch (error) {
      console.error("Error approving application:", error);
    }
  };

  const handleReject = async (applicationId: string) => {
    if (!accessToken) return;
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(
        `${BACKEND_URL}/volunteer/admin/reject/${applicationId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        setApplications(
          applications.filter((app) => app.id.toString() !== applicationId)
        );
      } else {
        console.error("Failed to reject application");
      }
    } catch (error) {
      console.error("Error rejecting application:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">
          Pending Volunteer Applications
        </h1>

        {isLoading ? (
          <p>Loading applications...</p>
        ) : applications.length === 0 ? (
          <p>No pending applications.</p>
        ) : (
          <div className="grid gap-4">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-gray-800 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">Event : {app.event_title}</h3>
                  <p>Applicant: {app.email}</p>
                  <p>Phone: {app.phone_number}</p>
                  <p>Address: {app.address}</p>
                  <p>Availability: {app.availability}</p>
                  <p>Skills: {app.skills.join(", ")}</p>
                </div>
                <div>
                  <button
                    onClick={() => handleApprove(app.id.toString())}
                    className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(app.id.toString())}
                    className="bg-red-600 text-white px-4 py-2 rounded"
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

export default AdminVolunteerPage;
