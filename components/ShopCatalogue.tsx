"use client";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { categories } from "@/lib/data";
import type { CatalogueProduct } from "@/lib/catalogue";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
const occasionProductIds: Record<string, string[]> = {
  Everyday: ["1", "2", "3", "4", "5", "6"],
  Formal: ["1", "4", "5", "6"],
  Party: ["1", "4", "5", "6"],
  Wedding: ["1", "5", "6"],
  Winter: ["1", "2", "3", "4", "5", "6"],
};
export default function ShopCatalogue({
  products,
}: {
  products: CatalogueProduct[];
}) {
  const [category, setCategory] = useState("All Pashmina");
  const searchParams = useSearchParams();
  const filter = searchParams.get("filter");
  const material = searchParams.get("material");
  const occasion = searchParams.get("occasion");
  const collection =
    filter === "new"
      ? { eyebrow: "The latest collection", heading: "NEW ARRIVALS" }
      : filter === "best"
        ? { eyebrow: "The collection", heading: "BEST SELLERS" }
        : { eyebrow: "The collection", heading: "Shop" };
  const shown = useMemo(
    () =>
      products.filter(
        (product) =>
          (category === "All Pashmina" || product.category === category) &&
          (!filter ||
            (filter === "new"
              ? product.new
              : filter === "best"
                ? product.featured
                : true)) &&
          (!material || product.material.includes(material)) &&
          (!occasion || occasionProductIds[occasion]?.includes(product.id)),
      ),
    [products, category, filter, material, occasion],
  );
  return (
    <main className="productPage">
      <div className="container">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">{collection.eyebrow}</div>
            <h1
              className="serif"
              style={{
                fontWeight: 400,
                fontSize: "clamp(48px,6vw,88px)",
                margin: "15px 0 0",
              }}
            >
              {collection.heading}
            </h1>
          </div>
        </div>
        <div className="filters" style={{ marginBottom: 40 }}>
          {categories.map((item) => (
            <button
              key={item}
              className={`filter ${category === item ? "active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="productGrid">
          {shown.map((product) => (
            <Reveal key={product.id}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </main>
  );
}
