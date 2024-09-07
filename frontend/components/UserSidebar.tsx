// Sidebar.jsx
import React, { useState } from "react";
import { FiUser, FiCalendar, FiAlertTriangle, FiLogOut } from "react-icons/fi";

const UserSidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEventsHovered, setIsEventsHovered] = useState(false); // State for hovering over Events link

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-gray-800 h-screen flex flex-col justify-between p-4 ${isHovered ? "w-64" : "w-20"} transition-all duration-300`}
    >
      {/* Logo Section */}
      <div className="flex items-center space-x-2">
        <div className="bg-white rounded-full p-2">
          {/* todo- use supabase providfed url */}

          <img
            src="https://via.placeholder.com/40"
            alt="Logo"
            className="rounded-full"
          />
        </div>
        {isHovered && (
          <span className="text-white font-bold">User Dashboard</span>
        )}
      </div>

      {/* Links Section */}
      <nav className="flex flex-col space-y-4">
        <SidebarLink icon={<FiUser />} label="Profile" isHovered={isHovered} />

        {/* Events link with sub-links */}
        <div
          onMouseEnter={() => setIsEventsHovered(true)}
          onMouseLeave={() => setIsEventsHovered(false)}
        >
          <SidebarLink
            icon={<FiCalendar />}
            label="Events"
            isHovered={isHovered}
          />
          {/* Sub-links for Create Event and View Events */}
          {isEventsHovered && (
            <div
              className={`flex flex-col ml-10 space-y-2 ${isHovered ? "visible" : "hidden"} transition-all duration-300`}
            >
              <SidebarSubLink href="/createevent" label="Create Event" />
              <SidebarSubLink href="/viewevents" label="View Events" />
            </div>
          )}
        </div>

        <SidebarLink
          icon={<FiCalendar />}
          label="Parking"
          isHovered={isHovered}
        />
        <SidebarLink
          href="/emergencyreport"
          icon={<FiAlertTriangle />}
          label="Emergency Report"
          isHovered={isHovered}
        />
        <SidebarLink icon={<FiLogOut />} label="Logout" isHovered={isHovered} />
      </nav>

      {/* User Profile Section */}
      <div className="flex items-center space-x-2">
        {/* todo- use supabase providfed url */}

        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="rounded-full"
        />
        {isHovered && <span className="text-white">Manu Arora</span>}
      </div>
    </div>
  );
};

// SidebarLink Component
const SidebarLink = ({
  icon,
  label,
  isHovered,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  isHovered: boolean;
  href?: string;
}) => {
  const content = (
    <>
      <div className="text-2xl">{icon}</div>
      {isHovered && <span className="text-base">{label}</span>}
    </>
  );

  return href ? (
    <a
      href={href}
      className={`flex items-center space-x-4 p-2 rounded-lg text-white hover:bg-gray-700 transition-transform duration-300 ${isHovered ? "pl-4" : "pl-0"}`}
    >
      {content}
    </a>
  ) : (
    <div
      className={`flex items-center space-x-4 p-2 rounded-lg text-white hover:bg-gray-700 transition-transform duration-300 ${isHovered ? "pl-4" : "pl-0"}`}
    >
      {content}
    </div>
  );
};

// SidebarSubLink Component for sub-links (no icons)
const SidebarSubLink = ({ label, href }: { label: string; href: string }) => {
  return (
    <a
      href={href}
      className="text-gray-400 text-sm pl-2 hover:text-white cursor-pointer transition duration-300"
    >
      {label}
    </a>
  );
};

export default UserSidebar;
