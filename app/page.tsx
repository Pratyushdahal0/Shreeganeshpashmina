import HomeContent from "@/components/HomeContent";
import { catalogue } from "@/lib/catalogue";
export const dynamic = 'force-dynamic';
export default async function Home() { return <HomeContent products={await catalogue()} />; }
