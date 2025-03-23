import type { Metadata } from "next";
import "./globals.css";

import { Be_Vietnam_Pro } from "next/font/google";
import { AuthProvider } from "@/components/context/AuthContext";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // Add weights as needed
  variable: "--font-be-vietnam-pro",
});

export const metadata: Metadata = {
  title: "Cognii",
  description: "Freelance marketplace",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={beVietnamPro.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
