'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import UserSidebar from '@/components/UserSidebar';  

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const WaterUsagePage = () => {
  const [waterUsage, setWaterUsage] = useState<number[]>([])

  useEffect(() => {
    // Simulate API call with dummy data
    const dummyData = [120, 150, 100, 180, 130, 160, 140]
    setWaterUsage(dummyData)
  }, [])

  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Water Usage (Gallons)',
        data: waterUsage,
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }

  return (
    <div className="flex bg-black text-white p-20 ml-20">
      <UserSidebar />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-4 flex-grow"
      >
        <h1 className="text-3xl font-bold mb-4">Water Usage</h1>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Bar data={chartData} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-semibold mb-2">Water Saving Tips</h2>
          <ul className="list-disc pl-5">
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.3 }}
            >
              Fix leaky faucets and pipes
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.3 }}
            >
              Take shorter showers
            </motion.li>
            <motion.li
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.3 }}
            >
              Use a water-efficient dishwasher
            </motion.li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default WaterUsagePage
