import Collections from '@/components/admin/collections/Collections'; 
import { getCollections } from '@/lib/actions/collections';

export default async function CollectionsPage() {
  const { collections } = await getCollections();
  return <Collections collections={collections || []} />
}
