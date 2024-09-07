"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

interface EmergencyReport {
  id: number;
  emergency_type: string;
  location: string;
  timestamp: string;
  // Remove unused fields
}

function AdminEmergencyReportsPage() {
  const [reports, setReports] = useState<EmergencyReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;

      try {
        const response = await fetch(`${BACKEND_URL}/user-emergency/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setReports(data);
      } catch (error) {
        console.error("Error fetching emergency reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-6">Emergency Reports</h1>

        {isLoading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <p>No emergency reports found.</p>
        ) : (
          <div className="grid gap-4">
            {reports.map((report) => (
              <div key={report.id} className="bg-gray-800 p-4 rounded">
                <h3 className="font-semibold">
                  Emergency Type: {report.emergency_type}
                </h3>
                <p>Location: {report.location}</p>
                <p>
                  Reported on: {new Date(report.timestamp).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminEmergencyReportsPage;
