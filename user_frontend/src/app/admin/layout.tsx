"use client";
import { Toaster } from "@/components/ui/sonner";
import Sidebar from "@/components/admin/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50 p-8">{children}</main>
      </div>
      <Toaster />
    </>
  );
}
