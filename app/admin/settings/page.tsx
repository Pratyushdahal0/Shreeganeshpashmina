import { db } from "@/lib/prisma";
import SettingsForm from "@/components/SettingsForm";
export const dynamic = "force-dynamic";
export default async function SettingsPage() { const prisma = db(); const rows = prisma ? await prisma.storeSetting.findMany() : []; const settings = Object.fromEntries(rows.map((row) => [row.key, typeof row.value === "object" && row.value && !Array.isArray(row.value) ? row.value : {}])); return <><div className="sectionHead"><div><div className="eyebrow">System</div><h2>Settings</h2></div></div><SettingsForm settings={settings as Record<string, Record<string, string>>} /></>; }
