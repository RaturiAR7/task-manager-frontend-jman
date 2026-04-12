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
    <nav className="sticky top-0 z-50 border-b border-white/8 bg-black/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <span className="text-xs font-bold text-white">PM</span>
            </div>
            <Link
              href={role === "EMPLOYEE" ? "/account" : "/dashboard"}
              className="text-lg font-semibold text-white hover:text-pink-300 transition-colors duration-200"
            >
              Task<span className="text-pink-400">Manager</span>
            </Link>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-2 items-center">
            {user ? (
              <>
                <Link
                  href="/account"
                  className={`text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 ${
                    pathname.startsWith("/account")
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "text-white/60 hover:text-white hover:bg-white/8"
                  }`}
                >
                  Account
                </Link>
                <Button
                  variant="ghost"
                  className="text-white/60 hover:text-white hover:bg-white/8"
                  onClick={logout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/auth"
                className="glow-btn px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
