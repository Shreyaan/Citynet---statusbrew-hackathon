import React from "react";

const DashboardNavbar = () => {
  return (
    <div className="fixed right-0 top-0 h-full w-60 bg-gray-800 shadow-lg flex flex-col items-center justify-between p-6 transition-transform transform hover:translate-x-0 translate-x-full duration-500 ease-in-out">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo */}
        <div className="text-white text-2xl font-bold mb-8 animate-pulse">
          Dashboard
        </div>

        {/* Links */}
        <a
          href="#overview"
          className="text-gray-300 hover:text-white text-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Overview
        </a>
        <a
          href="#events"
          className="text-gray-300 hover:text-white text-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Events
        </a>
        <a
          href="#settings"
          className="text-gray-300 hover:text-white text-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Settings
        </a>
        <a
          href="#profile"
          className="text-gray-300 hover:text-white text-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          Profile
        </a>
      </div>

      {/* Logout Button */}
      <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transform hover:scale-110 transition duration-300 ease-in-out">
        Logout
      </button>
    </div>
  );
};

export default DashboardNavbar;
