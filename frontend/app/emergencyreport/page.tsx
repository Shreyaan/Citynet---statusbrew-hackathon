"use client";

import React, { useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import { motion } from "framer-motion"; // For cool animations

function EmergencyReport() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [emergencyType, setEmergencyType] = useState("fire"); // Default to 'fire'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic (e.g., send data to the backend)
    console.log({ name, location, emergencyType });
    alert("Emergency report submitted successfully!");
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
              <option value="fire">Fire</option>
              <option value="medical">Medical</option>
              <option value="crime">Crime</option>
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
              className="bg-blue-500 text-white py-2 px-6 rounded-md hover:bg-blue-600 transition"
            >
              Send
            </button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}

export default EmergencyReport;
