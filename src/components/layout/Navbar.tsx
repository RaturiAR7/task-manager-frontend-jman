"use client";

import Link from "next/link";
import { useAuth } from "@/src/context/authContext";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Do not show the navbar on the login page
  if (pathname === "/auth" || pathname === "/login") {
    return null;
  }

  const role = user?.role;

  return (
    <nav className="bg-[#778873] text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href={role === "EMPLOYEE" ? "/account" : "/dashboard"} className="text-xl font-bold tracking-tight text-white hover:text-[#e3f2fd] transition">
              Project Management Tool
            </Link>
          </div>

            <div className="hidden md:flex space-x-8 items-center">
            {user ? (
              <>
                {/* ALL AUTHENTICATED USERS */}
                <Link href="/account" className={`text-sm font-medium hover:text-[#e3f2fd] transition border border-white/30 px-3 py-1.5 rounded hover:bg-white/10 ${pathname.startsWith("/account") ? "bg-white/20" : ""}`}>
                  Account
                </Link>

                <Button variant="ghost" className="text-white hover:text-[#e3f2fd] hover:bg-white/10" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth" className="bg-[#e3f2fd] text-[#778873] px-4 py-2 rounded font-medium hover:bg-white transition shadow-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
