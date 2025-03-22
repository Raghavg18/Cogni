"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface links {
  name: string;
  href: string;
}

const Sidebar = () => {
  const pathname = usePathname();

  const links: links[] = [
    { name: "Dashboard", href: "/client-dashboard/" },
    { name: "Dashboard", href: "/client-dashboard/" },
    { name: "Dashboard", href: "/client-dashboard/" },
    { name: "Dashboard", href: "/client-dashboard/" },
  ];

  return <div>Sidebar</div>;
};

export default Sidebar;
