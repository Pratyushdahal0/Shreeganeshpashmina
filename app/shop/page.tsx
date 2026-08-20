import { Suspense } from "react";
import ShopCatalogue from "@/components/ShopCatalogue";
import { catalogue } from "@/lib/catalogue";
export const dynamic = "force-dynamic";
export default async function Shop() {
  return (
    <Suspense>
      <ShopCatalogue products={await catalogue()} />
    </Suspense>
  );
}
