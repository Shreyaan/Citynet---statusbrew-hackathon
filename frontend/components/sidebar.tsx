// Sidebar.jsx
import React, { useState } from "react";
import { FiUser, FiCheckCircle, FiLogOut } from "react-icons/fi";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-gray-800 h-screen flex flex-col items-center justify-between p-4 ${
        isHovered ? "w-64" : "w-20"
      } transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <div className="bg-white rounded-full p-2">
          <img
            src="https://via.placeholder.com/40" // Replace this with your logo
            alt="Logo"
            className="rounded-full"
          />
        </div>
        {isHovered && <span className="text-white font-bold">City Net</span>}
      </div>

      {/* Links Section */}
      <nav className="flex flex-col space-y-4">
        <SidebarLink
          href="/profile"
          icon={<FiUser />}
          label="Profile"
          isHovered={isHovered}
        />
        <SidebarLink
          href="/approve"
          icon={<FiCheckCircle />}
          label="Approve Events"
          isHovered={isHovered}
        />
        <SidebarLink
          href="/logout"
          icon={<FiLogOut />}
          label="Logout"
          isHovered={isHovered}
        />
      </nav>

      {/* User Profile Section */}
      <div className="flex items-center space-x-2">
        <img
          src="https://via.placeholder.com/40" // Replace this with your avatar image
          alt="User"
          className="rounded-full"
        />
        {isHovered && <span className="text-white">Sahil Chabra</span>}
      </div>
    </div>
  );
};
interface SidebarLinkProps {
  href: string; // Add this line
  icon: React.ReactNode;
  label: string;
  isHovered: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  label,
  isHovered,
}) => {
  return (
    <a
      href={href}
      className={`flex items-center space-x-4 p-2 rounded-lg text-white hover:bg-gray-700 transition-transform duration-300 ease-in-out ${isHovered ? "pl-4" : "pl-0"}`}
    >
      <div className="text-2xl">{icon}</div>
      {isHovered && <span className="text-base">{label}</span>}
    </a>
  );
};

export default Sidebar;
