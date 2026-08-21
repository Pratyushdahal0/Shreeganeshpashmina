import Collections from '@/components/admin/collections/Collections'; import { collectionService } from '@/lib/admin/collections';
export default async function CollectionsPage(){const {collections}=await collectionService.list();return <Collections collections={collections}/>}
