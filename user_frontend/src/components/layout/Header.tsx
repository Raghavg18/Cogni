"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/context/AuthContext";

const Header: React.FC = () => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { username, isClient } = useAuth();
  const [role, setRole] = useState("");

  useEffect(() => {
    setRole(isClient ? "client" : "freelancer");
  }, [isClient]);

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://cogni-production.up.railway.app/logout",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        // Clear local storage
        localStorage.removeItem("username");
        localStorage.removeItem("isClient");
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getInitial = () => {
    if (!username) return "U";
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="flex w-full items-center justify-between px-10 py-3 border-[rgba(229,232,235,1)] border-b">
      <div className="flex items-center gap-4 my-auto">
        <div className="self-stretch w-4 my-auto">
          <div className="flex min-h-4 w-4 flex-1" />
        </div>
        <div className="self-stretch text-lg text-[rgba(13,20,28,1)] font-bold leading-none my-auto">
          Cognii
        </div>
      </div>
      <div className="self-stretch flex min-w-60 gap-8 flex-wrap flex-1 shrink basis-[0%] my-auto max-md:max-w-full ml-auto">
        <div className="flex min-w-60 min-h-10 items-center gap-9 text-sm text-[rgba(13,20,28,1)] font-medium whitespace-nowrap ml-auto">
          <Link
            href={
              role === "freelancer"
                ? "/freelancer-dashboard"
                : "/client-dashboard/milestone-tracker"
            }
            className="self-stretch my-auto">
            Dashboard
          </Link>
          <Link href="/chat" className="self-stretch my-auto">
            Messages
          </Link>
        </div>
        <div className="flex gap-2">
          <button className="bg-[rgba(232,237,242,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl">
            <div className="self-stretch w-full flex-1 shrink basis-[0%] my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/bbb85c1e8fe27a8497081e05b7a0a479c380e574?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-5 flex-1"
                alt="Notification"
              />
            </div>
          </button>
          <button className="bg-[rgba(232,237,242,1)] flex min-h-10 items-center gap-2 overflow-hidden justify-center w-10 h-10 max-w-[480px] px-2.5 rounded-xl">
            <div className="self-stretch w-full flex-1 shrink basis-[0%] my-auto">
              <img
                src="https://cdn.builder.io/api/v1/image/assets/TEMP/3efb8a5d9e570f293718c4fa7d389324fe0d4173?placeholderIfAbsent=true"
                className="aspect-[1] object-contain w-5 flex-1"
                alt="Messages"
              />
            </div>
          </button>
        </div>
        <div className="relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-semibold rounded-full">
            {getInitial()}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
              <div className="px-4 py-2 border-b border-gray-200">
                <p className="text-sm font-medium text-gray-900">{username}</p>
                <p className="text-xs text-gray-500 capitalize">{role}</p>
              </div>
              <Link
                href={
                  role === "freelancer"
                    ? "/freelancer-dashboard"
                    : "/client-dashboard/milestone-tracker"
                }>
                <div className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                  Dashboard
                </div>
              </Link>
              <div
                onClick={handleLogout}
                className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
