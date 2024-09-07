// Navbar.tsx
import React from "react";
import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6">
      {/* Logo */}
      <div className="text-xl font-bold">CITY NET</div>

      {/* Links */}
      <ul className="hidden md:flex space-x-6 text-sm uppercase font-semibold">
        <li>
          <Link href="#home" className="hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link href="#about" className="hover:text-gray-300">
            About Us
          </Link>
        </li>
        <li>
          <Link href="#features" className="hover:text-gray-300">
            Features
          </Link>
        </li>
      </ul>

      {/* Login/Signup Button */}
      <Link href="/login" className="px-6 py-2 border border-white rounded-full hover:bg-white hover:text-black transition">
        Login/SignUp
      </Link>
    </nav>
  );
};

export default Navbar;
