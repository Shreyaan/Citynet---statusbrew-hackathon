"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { GoogleAuthButton } from "./GoogleAuthButton";
import { motion } from "framer-motion";

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mx-auto my-auto max-w-sm bg-gray-800 border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Login/SignUp</CardTitle>
            <CardDescription className="text-gray-400">
              Use Google to login or sign up
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <GoogleAuthButton />
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
