"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import UserSidebar from "@/components/UserSidebar";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/viewevents");
  }, [router]);

  return (
    <div>
      <UserSidebar />
    </div>
  );
};

export default HomePage;
