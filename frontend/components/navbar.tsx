// src/components/Navbar.tsx
import React from "react";

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-between items-center px-10 py-6 bg-transparent text-white">
      <div className="text-2xl font-bold">CITY NET</div>
      <ul className="flex space-x-8">
        <li className="hover:text-gray-400 cursor-pointer">Home</li>
        <li className="hover:text-gray-400 cursor-pointer">About Us</li>
        <li className="hover:text-gray-400 cursor-pointer">Features</li>
      </ul>
      <button className="border border-white px-6 py-2 rounded-full hover:bg-white hover:text-black transition ease-in-out">
        Login/SignUp
      </button>
    </nav>
  );
};

export default Navbar;
