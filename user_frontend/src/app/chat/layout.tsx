"use client";
import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}
