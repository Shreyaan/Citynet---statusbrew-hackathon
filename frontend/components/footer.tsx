// Footer.tsx
import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa"; // Importing social media icons

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-10">
      <div className="container mx-auto px-10 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Us Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">About Us</h3>
            <p className="text-gray-400">
              We provide AI-powered solutions for urban management, event
              handling, and emergency reporting. Our goal is to make cities
              smarter and communities more engaged.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="hover:text-gray-300">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-gray-300">
                  About Us
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-gray-300">
                  Features
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Contact Us</h3>
            <p className="text-gray-400">
              123 Smart City Blvd,
              <br />
              New Delhi, India
              <br />
              Email: contact@smartcity.com
              <br />
              Phone: +91 9876543210
            </p>

            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="hover:text-gray-400">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" className="hover:text-gray-400">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" className="hover:text-gray-400">
                <FaLinkedinIn />
              </a>
              <a href="https://instagram.com" className="hover:text-gray-400">
                <FaInstagram />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 text-center border-t border-gray-700 pt-6">
          <p className="text-gray-500">
            &copy; 2024 Smart City Solutions. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
