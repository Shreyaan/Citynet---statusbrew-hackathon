"use client";
import React from "react";
import Navbar from "@/components/navbar"; 
const Home: React.FC = () => {
  return (
    <div className="relative h-screen w-full bg-black text-white">
      {/* Background Image with fade effect */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/path-to-your-city-image.jpg')`, // Replace with the actual path to your image
        }}
      >
        {/* Fade into black */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent h-full w-full"></div>
      </div>
      {/* Navbar Component */}
      <Navbar /> {/* Navbar imported here */}
      {/* Main Heading */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
          Empowering Communities <br /> Enhancing Cities
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-6">
          AI-Powered Solutions for Urban Management and Community Engagement.
        </p>

        {/* Discover Button */}
        <button className="px-6 py-3 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition">
          Discover more
        </button>
      </div>
    </div>
  );
};

export default Home;
