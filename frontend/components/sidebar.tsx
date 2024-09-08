// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { FiUser, FiCheckCircle, FiLogOut, FiAlertCircle, FiUsers } from "react-icons/fi";
import { createClient } from "@/utils/supabase/client";

const Sidebar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const client = createClient();
      const {
        data: { user },
      } = await client.auth.getUser();
      setAvatarUrl(user?.user_metadata?.avatar_url || null);
      setUsername(user?.user_metadata.email || null);
    };

    fetchUserData();
  }, []);
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
            src={avatarUrl || "https://via.placeholder.com/40"}
            alt="Logo"
            className="rounded-full"
            width={40}
            height={40}
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
          href="/admin-emergency-reports"
          icon={<FiAlertCircle />}
          label="Admin Emergency Reports"

          isHovered={isHovered}
        />
        <SidebarLink
          href="/admin-volunteer-management"
          icon={<FiUsers />}
          label="Admin Volunteer Management"
          isHovered={isHovered}
        />
        <SidebarLink
          href="/home"
          icon={<FiLogOut />}
          label="Logout"
          isHovered={isHovered}
        />
      </nav>

      {/* User Profile Section */}
      <div className="flex items-center space-x-2">
        <img
          src={avatarUrl || "https://via.placeholder.com/40"}
          alt="User"
          className="rounded-full"
          width={40}
          height={40}
        />
        {isHovered && <span className="text-white">{username}</span>}
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
