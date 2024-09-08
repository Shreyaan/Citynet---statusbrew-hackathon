"use client";

import { useState, useEffect } from "react";
import UserSidebar from "@/components/UserSidebar";
import { createClient } from "@/utils/supabase/client";

interface UsageRecord {
  date: string;
  usage_kwh: number;
}

interface UsageData {
  total_usage_kwh: number;
  usage_records: UsageRecord[];
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const fetchMonthlyEnergyUsage = async (year: number, month: number) => {
  const client = createClient();
  const session = await client.auth.getUser();
  const token = session.data?.user?.id;

  const response = await fetch(
    `${BACKEND_URL}/energy-usage/usage/${year}/${month}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch energy usage data");
  }
  return response.json();
};

const ElectricityUsagePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsageData();
  }, [selectedDate]);

  const fetchUsageData = async () => {
    setLoading(true);
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth() + 1;
      const data = await fetchMonthlyEnergyUsage(year, month);
      setUsageData(data);
    } catch (error) {
      console.error("Error fetching energy usage data:", error);
    }
    setLoading(false);
  };

  const calculateBill = (totalUsage: number) => {
    // Assuming a simple rate of $0.12 per kWh
    const rate = 0.12;
    return (totalUsage * rate).toFixed(2);
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <UserSidebar />
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-3xl w-full bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 hover:scale-105">
          <div className="p-8 animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6 text-center">
              Electricity Usage
            </h1>
            <div className="mb-6 flex justify-center">
              <label htmlFor="month-select" className="mr-2">
                Select Month:
              </label>
              <input
                type="month"
                id="month-select"
                value={`${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, "0")}`}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                className="border rounded p-1 bg-gray-700 text-white transition-all duration-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {loading ? (
              <p className="text-center animate-pulse">Loading...</p>
            ) : usageData ? (
              <div className="space-y-6 animate-slideUp">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <p className="mb-2 text-lg">
                    Total Usage:{" "}
                    <span className="font-semibold">
                      {usageData.total_usage_kwh.toFixed(2)} kWh
                    </span>
                  </p>
                  <p className="text-lg">
                    Estimated Bill:{" "}
                    <span className="font-semibold text-green-400">
                      ${calculateBill(usageData.total_usage_kwh)}
                    </span>
                  </p>
                </div>
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Daily Usage</h2>
                  <ul className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {usageData.usage_records.map((record, index) => (
                      <li
                        key={record.date}
                        className="flex justify-between bg-gray-700 p-2 rounded transition-all duration-300 hover:bg-gray-600 animate-fadeIn"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <span>{record.date}</span>
                        <span className="font-semibold">
                          {record.usage_kwh.toFixed(2)} kWh
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-center">No data available</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ElectricityUsagePage;
