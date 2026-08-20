import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User { role: "CUSTOMER" | "OWNER" | "ADMIN" | "MANAGER" | "SALES" | "INVENTORY" | "CONTENT" | "SUPPORT" | "VIEWER" }
  interface Session { user: { id: string; role: User["role"] } & NonNullable<Session["user"]> }
}
declare module "next-auth/jwt" { interface JWT { role?: import("next-auth").User["role"] } }
