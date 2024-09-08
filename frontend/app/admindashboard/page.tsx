"use client";
import { redirect } from 'next/navigation';
import Sidebar from "@/components/sidebar";
export default function AdminDashboard() {
  redirect('/approve');
  
  return (
    <div>
      <Sidebar />
    </div>
  );
};


