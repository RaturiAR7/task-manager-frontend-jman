"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// This page redirects to the main members page
// Individual member profiles can be expanded in the future
const MemberDetails = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/members");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F1F3E0] to-[#D2DCB6] flex items-center justify-center">
      <div className="text-[#778873] text-lg animate-pulse">Redirecting...</div>
    </div>
  );
};

export default MemberDetails;