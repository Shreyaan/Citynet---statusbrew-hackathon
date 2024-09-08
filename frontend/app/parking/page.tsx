"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import UserSidebar from "@/components/UserSidebar";
import { createClient } from "@/utils/supabase/client";

interface ParkingLot {
  sensor_id: string;
  location: string;
  status: "Empty" | "Occupied";
  last_updated: string;
}

const ParkingPage = () => {
  const [parkingLots, setParkingLots] = useState<ParkingLot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const fetchCountRef = useRef(0);
  const isInitialFetchRef = useRef(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (fetchCountRef.current < 10) {
        fetchParkingStatus();
        fetchCountRef.current += 1;
      } else {
        clearInterval(intervalId);
      }
    }, 3000);

    // Initial fetch
    fetchParkingStatus();
    fetchCountRef.current += 1;

    return () => clearInterval(intervalId);
  }, []);

  const fetchParkingStatus = async () => {
    if (isInitialFetchRef.current) {
      setIsLoading(true);
    }
    const client = createClient();
    const session = await client.auth.getUser();
    const token = session.data?.user?.id;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/parking/status`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setParkingLots(data);
    } catch (error) {
      console.error("Error fetching parking status:", error);
    } finally {
      if (isInitialFetchRef.current) {
        setIsLoading(false);
        isInitialFetchRef.current = false;
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-black items-center justify-center">
        <div className="text-white text-2xl">Loading parking status...</div>
      </div>
    );
  }

  return (
    <div className="flex bg-black text-white p-20 ml-20 h-screen">
      <UserSidebar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 flex-grow"
      >
        <h1 className="text-3xl font-bold mb-4">Parking Status</h1>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {parkingLots.map((lot) => (
            <motion.div
              key={lot.sensor_id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className={`p-4 rounded-lg ${
                lot.status === "Empty" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              <h2 className="text-xl font-semibold mb-2">{lot.location}</h2>
              <p>Status: {lot.status}</p>
              <p>Last Updated: {new Date(lot.last_updated).toLocaleString()}</p>
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-semibold mb-2">Parking Tips</h2>
          <ul className="list-disc pl-5">
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              Check the status before heading to the parking lot
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              Consider carpooling to reduce parking demand
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              Use alternative transportation when possible
            </motion.li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ParkingPage;
