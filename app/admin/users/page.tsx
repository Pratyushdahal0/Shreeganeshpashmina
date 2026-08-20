import { db } from "@/lib/prisma";
import { currentStaff } from "@/lib/admin";
import RoleSelect from "@/components/RoleSelect";
export const dynamic = "force-dynamic";
export default async function UsersPage() { const prisma = db(); const actor = await currentStaff(); const users = prisma ? await prisma.user.findMany({ where: { role: { not: "CUSTOMER" } }, orderBy: { createdAt: "asc" } }) : []; return <><div className="sectionHead"><div><div className="eyebrow">System</div><h2>Users & roles</h2></div></div><table className="adminTable"><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Added</th></tr></thead><tbody>{users.map((user) => <tr key={user.id}><td>{user.name}</td><td>{user.email}</td><td><RoleSelect id={user.id} role={user.role} canEdit={actor?.role === "OWNER"} /></td><td>{user.createdAt.toLocaleDateString()}</td></tr>)}</tbody></table></>; }
