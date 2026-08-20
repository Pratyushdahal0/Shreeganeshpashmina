"use client";

import { usePathname } from "next/navigation";
import AdminNav from "@/components/AdminNav";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;

  return <main className="adminShell"><aside className="adminSidebar"><div className="adminSidebarBrand"><span>Shree Ganesh</span><small>admin</small></div><AdminNav /></aside><section className="adminContent">{children}</section></main>;
}
