'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function HeroSection({ heroImg = '/images/hero-editorial.jpg' }: { heroImg?: string }) {
  return (
    <motion.div
      initial={{ scale: 1.06 }}
      animate={{ scale: 1 }}
      transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <Image
        className="heroImg"
        src={heroImg}
        alt="Woman wearing a pashmina shawl"
        fill
        priority
        sizes="100vw"
      />
    </motion.div>
  );
}
