import { db } from "@/lib/prisma";
import BannerEditor from "@/components/BannerEditor";
export const dynamic = 'force-dynamic';
export default async function BannersPage() { const prisma = db(); const rows = prisma ? await prisma.banner.findMany({ orderBy: { order: 'asc' } }) : []; return <><div className="sectionHead"><div><div className="eyebrow">Editorial system</div><h2>Content blocks</h2></div></div><p className="muted">Configure image-only, text-only, or layered editorial sections. The live preview follows the storefront’s restrained display language.</p><BannerEditor banners={rows} /></>; }
