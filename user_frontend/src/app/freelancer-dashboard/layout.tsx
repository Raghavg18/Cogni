import Header from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <div style={{ flex: 1, padding: "20px" }}>{children}</div>
    </div>
  );
}
