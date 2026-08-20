import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import "dotenv/config";
if (!process.env.DATABASE_URL)
  throw new Error("DATABASE_URL is required to seed the database.");
const prisma = new PrismaClient({
  adapter: new PrismaPg(
    new Pool({ connectionString: process.env.DATABASE_URL }),
  ),
});
const products = [
  {
    id: "1",
    slug: "heritage-burgundy-shawl",
    name: "Heritage Burgundy Shawl",
    category: "Shawls",
    material: "Pure Pashmina",
    price: 280,
    priceMinor: 28000,
    currency: "NPR",
    status: "ACTIVE",
    image: "/images/product-shawl.jpg",
    description:
      "A softly structured pashmina shawl with a rich, deep tone and hand-finished fringe.",
    featured: true,
    isNew: true,
  },
  {
    id: "2",
    slug: "soft-wool-stole",
    name: "Soft Wool Stole",
    category: "Stoles",
    material: "Fine Wool",
    price: 145,
    priceMinor: 14500,
    currency: "NPR",
    status: "ACTIVE",
    image: "/images/product-stole.jpg",
    description:
      "Lightweight warmth with a refined, understated finish for everyday layering.",
    featured: true,
    isNew: false,
  },
  {
    id: "3",
    slug: "cashmere-beanie",
    name: "Ribbed Cashmere Beanie",
    category: "Knitted Items",
    material: "Cashmere",
    price: 120,
    priceMinor: 12000,
    currency: "NPR",
    status: "ACTIVE",
    image: "/images/cashmere-beanie.jpg",
    description:
      "A soft ribbed cashmere knit designed for quiet, everyday luxury.",
    featured: true,
    isNew: true,
  },
  {
    id: "4",
    slug: "editorial-cashmere-scarf",
    name: "Editorial Cashmere Scarf",
    category: "Scarves",
    material: "Cashmere & Silk",
    price: 190,
    priceMinor: 19000,
    currency: "NPR",
    status: "ACTIVE",
    image: "/images/product-scarf.jpg",
    description:
      "An elegant scarf with a soft hand and a clean editorial silhouette.",
    featured: true,
    isNew: false,
  },
  {
    id: "5",
    slug: "warmth-stole",
    name: "Warmth Stole",
    category: "Stoles",
    material: "Pashmina & Silk",
    price: 230,
    priceMinor: 23000,
    currency: "NPR",
    status: "ACTIVE",
    image: "/images/product-editorial.jpg",
    description:
      "A fluid stole designed to drape naturally over formal and relaxed looks.",
    featured: false,
    isNew: true,
  },
  {
    id: "6",
    slug: "golden-pashmina",
    name: "Golden Pashmina",
    category: "Shawls",
    material: "Pure Pashmina",
    price: 320,
    priceMinor: 32000,
    currency: "NPR",
    status: "ACTIVE",
    image: "/images/collection-shawls.jpg",
    description:
      "A statement pashmina with warm tonal depth and a soft, generous drape.",
    featured: false,
    isNew: false,
  },
];
await Promise.all(
  products.map((product) =>
    prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    }),
  ),
);
await prisma.banner.upsert({
  where: { sectionKey: "home-hero" },
  update: {},
  create: {
    sectionKey: "home-hero",
    displayMode: "TEXT_OVER_IMAGE",
    eyebrow: "Kathmandu · Nepal",
    headline: "Softness, with a point of view.",
    subheadline:
      "Pashmina, cashmere, silk and wool shaped into quiet pieces for modern wardrobes.",
    imageUrl: "/images/hero-editorial.jpg",
  },
});
await prisma.banner.upsert({
  where: { sectionKey: "home-editorial" },
  update: {},
  create: {
    sectionKey: "home-editorial",
    displayMode: "TEXT_OVER_IMAGE",
    eyebrow: "The material",
    headline: "Softness, considered.",
    subheadline: "A study in fibre, finish and feeling.",
    imageUrl: "/images/craft-loom.jpg",
  },
});
if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD)
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL.toLowerCase() },
    update: { role: "ADMIN" },
    create: {
      name: "Studio Admin",
      email: process.env.ADMIN_EMAIL.toLowerCase(),
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
      role: "ADMIN",
    },
  });
await prisma.$disconnect();
