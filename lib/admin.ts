import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export const staffRoles = ["OWNER", "ADMIN", "MANAGER", "SALES", "INVENTORY", "CONTENT", "SUPPORT", "VIEWER"] as const;
export type StaffRole = typeof staffRoles[number];
export async function currentStaff() { const session = await getServerSession(authOptions); return session?.user && staffRoles.includes(session.user.role as StaffRole) ? session.user : null; }
export async function isAdmin() { return await hasAnyRole(["OWNER", "ADMIN", "MANAGER", "SALES", "INVENTORY", "CONTENT", "SUPPORT"]); }
export async function hasAnyRole(roles: readonly StaffRole[]) { const user = await currentStaff(); return Boolean(user && roles.includes(user.role as StaffRole)); }
