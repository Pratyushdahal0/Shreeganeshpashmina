'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { currencies, rates } from '@/lib/data';
import { useCurrency } from '@/components/CurrencyContext';

export type CardProduct = {
  id: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  description: string;
  isNew?: boolean;
  featured?: boolean;
};

export default function ProductCard({ product, priority = false }: { product: CardProduct; priority?: boolean }) {
  const { currency } = useCurrency();
  const c = currencies[currency];
  const price = Math.round(product.price * rates[currency]);
  const [imgSrc, setImgSrc] = useState(product.image || '/images/product-shawl.jpg');

  return (
    <Link className="productCard" href={`/product/${product.slug}`}>
      <motion.div className="productMedia" whileHover={{ y: -3 }} transition={{ duration: 0.4 }}>
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="(max-width:720px) 50vw, (max-width:1100px) 33vw, 320px"
          loading={priority ? 'eager' : 'lazy'}
          priority={priority}
          onError={() => setImgSrc('/images/product-shawl.jpg')}
        />
        {product.isNew && <span className="badge">New</span>}
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
