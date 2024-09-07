"use client";

import React, { useState, useEffect } from "react";
import UserSidebar from "@/components/UserSidebar";
import { motion } from "framer-motion"; // For cool animations
import { createClient } from "@/utils/supabase/client";

function EmergencyReport() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyType, setEmergencyType] = useState("");
  const [emergencyTypes, setEmergencyTypes] = useState([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const client = createClient();
      const session = await client.auth.getUser();
      const token = session.data?.user?.id;
      setAccessToken(token || null);
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchEmergencyTypes = async () => {
      if (!accessToken) return;

      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
      try {
        const response = await fetch(`${BACKEND_URL}/user-emergency/types`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setEmergencyTypes(data);
        if (data.length > 0) setEmergencyType(data[0]);
      } catch (error) {
        console.error("Error fetching emergency types:", error);
      }
    };

    fetchEmergencyTypes();
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
        if (data.name) {
          setName(data.name);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [accessToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    setIsSubmitting(true);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
    try {
      const response = await fetch(`${BACKEND_URL}/user-emergency/report`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name, location, emergencyType }),
      });

      if (response.ok) {
        alert("Emergency report submitted successfully!");
        setName("");
        setLocation("");
        setEmergencyType(emergencyTypes[0] || "");
      } else {
        alert("Failed to submit emergency report. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting emergency report:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <UserSidebar />

      {/* Main content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <motion.form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <motion.h2
            className="text-white text-2xl mb-6 font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Emergency Report
          </motion.h2>

          {/* Name Input */}
          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.4 }}
          >
            <label className="block text-gray-400 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              placeholder="Enter your name"
              required
            />
          </motion.div>

          {/* Location Input */}
          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.6 }}
          >
            <label className="block text-gray-400 mb-2">Location</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-3 bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              placeholder="Enter your location"
              required
            />
          </motion.div>

          {/* Emergency Type Dropdown */}
          <motion.div
            className="mb-6"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", delay: 0.8 }}
          >
            <label className="block text-gray-400 mb-2">Emergency Type</label>
            <select
              value={emergencyType}
              onChange={(e) => setEmergencyType(e.target.value)}
              className="w-full p-3 bg-black text-gray-300 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
              required
            >
              {emergencyTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            className="flex justify-end"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1 }}
          >
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}

export default EmergencyReport;
