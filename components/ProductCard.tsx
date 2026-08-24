'use client';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { currencies, rates } from '@/lib/data';
import { useEffect, useState } from 'react';

// Shape that both legacy and DB products conform to
export type CardProduct = {
  id: string;
  slug: string; // handle from DB, slug from legacy
  name: string; // title from DB, name from legacy
  category: string;
  material: string;
  price: number; // USD base price
  image: string;
  description: string;
  isNew?: boolean;
  featured?: boolean;
};

export default function ProductCard({ product }: { product: CardProduct }) {
  const [currency, setCurrency] = useState<keyof typeof currencies>('USD');
  useEffect(() => {
    const sync = () => setCurrency((localStorage.getItem('sgp-currency') as keyof typeof currencies) || 'USD');
    sync();
    addEventListener('currencychange', sync);
    return () => removeEventListener('currencychange', sync);
  }, []);
  const c = currencies[currency];
  const price = Math.round(product.price * rates[currency]);
  return (
    <Link className="productCard" href={`/product/${product.slug}`}>
      <motion.div className="productMedia" whileHover={{ y: -3 }} transition={{ duration: 0.4 }}>
        <Image src={product.image} alt={product.name} fill sizes="(max-width:720px) 50vw, 33vw" />
        <>{product.isNew && <span className="badge">New</span>}</>
      </motion.div>
      <div className="productMeta">
        <div>
          <div className="productName">{product.name}</div>
          <div className="productMaterial">{product.material}</div>
        </div>
        <div className="productPrice">{c.symbol}{price.toLocaleString()}</div>
      </div>
    </Link>
  );
}
