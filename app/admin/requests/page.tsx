import { db } from "@/lib/prisma";
import RequestsTable from "@/components/RequestsTable";
export const dynamic = 'force-dynamic';
export default async function RequestsPage() { const prisma = db(); const rows = prisma ? await prisma.enquiry.findMany({ orderBy: { createdAt: 'desc' } }) : []; const serialised = rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() })); return <><div className="sectionHead"><div><div className="eyebrow">Client conversations</div><h2>Requests</h2></div></div><RequestsTable rows={serialised} /></>; }
