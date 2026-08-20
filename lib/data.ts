export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  description: string;
  featured?: boolean;
  new?: boolean;
};
export const products: Product[] = [
  {
    id: "1",
    slug: "heritage-burgundy-shawl",
    name: "Heritage Burgundy Shawl",
    category: "Shawls",
    material: "Pure Pashmina",
    price: 280,
    image: "/images/product-shawl.jpg",
    description:
      "A softly structured pashmina shawl with a rich, deep tone and hand-finished fringe.",
    featured: true,
    new: true,
  },
  {
    id: "2",
    slug: "soft-wool-stole",
    name: "Soft Wool Stole",
    category: "Stoles",
    material: "Fine Wool",
    price: 145,
    image: "/images/product-stole.jpg",
    description:
      "Lightweight warmth with a refined, understated finish for everyday layering.",
    featured: true,
  },
  {
    id: "3",
    slug: "cashmere-beanie",
    name: "Ribbed Cashmere Beanie",
    category: "Knitted Items",
    material: "Cashmere",
    price: 120,
    image: "/images/cashmere-beanie.jpg",
    description:
      "A soft ribbed cashmere knit designed for quiet, everyday luxury.",
    featured: true,
    new: true,
  },
  {
    id: "4",
    slug: "editorial-cashmere-scarf",
    name: "Editorial Cashmere Scarf",
    category: "Scarves",
    material: "Cashmere & Silk",
    price: 190,
    image: "/images/product-scarf.jpg",
    description:
      "An elegant scarf with a soft hand and a clean editorial silhouette.",
    featured: true,
  },
  {
    id: "5",
    slug: "warmth-stole",
    name: "Warmth Stole",
    category: "Stoles",
    material: "Pashmina & Silk",
    price: 230,
    image: "/images/product-editorial.jpg",
    description:
      "A fluid stole designed to drape naturally over formal and relaxed looks.",
    new: true,
  },
  {
    id: "6",
    slug: "golden-pashmina",
    name: "Golden Pashmina",
    category: "Shawls",
    material: "Pure Pashmina",
    price: 320,
    image: "/images/collection-shawls.jpg",
    description:
      "A statement pashmina with warm tonal depth and a soft, generous drape.",
  },
];
export const categories = [
  "All Pashmina",
  "Shawls",
  "Scarves",
  "Stoles",
  "Panchu",
  "Men's Cardigans",
  "Women's Cardigans",
  "Knitted Items",
];
export const currencies = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", flag: "/flags/us.png" },
  GBP: {
    code: "GBP",
    symbol: "£",
    name: "British Pound",
    flag: "/flags/uk.svg",
  },
  EUR: { code: "EUR", symbol: "€", name: "Euro", flag: "/flags/eu.svg" },
  AUD: {
    code: "AUD",
    symbol: "A$",
    name: "Australian Dollar",
    flag: "/flags/aus.svg",
  },
  CAD: {
    code: "CAD",
    symbol: "C$",
    name: "Canadian Dollar",
    flag: "/flags/can.svg",
  },
  INR: {
    code: "INR",
    symbol: "₹",
    name: "Indian Rupee",
    flag: "/flags/ind.jpeg",
  },
  NPR: {
    code: "NPR",
    symbol: "रू",
    name: "Nepalese Rupee",
    flag: "/flags/nep.svg",
  },
} as const;
export const rates: Record<keyof typeof currencies, number> = {
  USD: 1,
  GBP: 0.77,
  EUR: 0.88,
  AUD: 1.54,
  CAD: 1.38,
  INR: 87,
  NPR: 146,
};
