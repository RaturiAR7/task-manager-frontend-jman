"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/authContext";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  
  // Do not show the navbar on the login page
  if (pathname === "/auth" || pathname === "/login") {
    return null;
  }

  const role = user?.role;

  return (
    <nav className="sticky top-0">
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href={role === "EMPLOYEE" ? "/account" : "/dashboard"} className="text-xl font-bold tracking-tight text-black hover:text-[#778873] transition">
              Project Management Tool
            </Link>
          </div>

            <div className="hidden md:flex space-x-8 items-center">
            {user ? (
                <Button variant="ghost" className="text-black hover:text-[#778873] hover:bg-white/10" onClick={logout}>
                  Logout
                </Button>
            ) : (
              <Link href="/auth" className="text-black px-4 py-2 rounded font-medium hover:text-[#778873] hover:bg-white/10 transition shadow-sm cursor-pointer">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
