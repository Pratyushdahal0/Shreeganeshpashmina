'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Icon } from './Icons';
import CurrencySelector from './CurrencySelector';

export default function Header({
  cartCount = 0,
  onCart,
}: {
  cartCount?: number;
  onCart: () => void;
}) {
  const [shop, setShop] = useState(false);
  const [search, setSearch] = useState(false);
  const [mobile, setMobile] = useState(false);

  return (
    <header className="siteHeader">

      <div className="announcementBar">
        <div className="announcementTrack">
          <span>Worldwide delivery</span>

          <span aria-hidden="true">·</span>

          <span>WhatsApp ordering available worldwide</span>
        </div>
      </div>

      <div className="container nav">

        <div className="navLeft">

          <button
            type="button"
            className="navBtn"
            onMouseEnter={() => setShop(true)}
            onClick={() => setShop((v) => !v)}
          >
            Shop <Icon name="chevron" size="xs" />
          </button>

          <Link
            className="navLink hideTablet"
            href="/shop?filter=new"
          >
            New Arrivals
          </Link>

          <Link
            className="navLink hideTablet"
            href="/shop?filter=best"
          >
            Best Sellers
          </Link>

          <Link
            className="navLink hideTablet"
            href="/craft"
          >
            Our Craft
          </Link>

          <Link
            className="navLink hideTablet"
            href="/journal"
          >
            The Journal
          </Link>

          <Link
            className="navLink hideTablet"
            href="/wholesale"
          >
            Wholesale
          </Link>
        </div>

        {/* BRAND LOGO */}
        <Link
          className="brand"
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Image
            className="brandPrimary"
  src="/logos/shree-ganesh-pashmina-primary.png"
  alt="Shree Ganesh Pashmina"
  width={676}
  height={354}
  priority
          />

          <Image
            className="brandMonogram"
            src="/logos/shree-ganesh-pashmina-monogram.png"
            alt="Shree Ganesh Pashmina monogram"
            width={368}
            height={340}
            priority
          />
        </Link>

        <div className="navRight">

          <CurrencySelector />

          <button
            className="iconBtn"
            aria-label="Search"
            onClick={() => setSearch(true)}
          >
            <Icon name="search" />
          </button>

          <button
            className="iconBtn bagBtn"
            aria-label="Bag"
            onClick={onCart}
          >
            <Icon name="bag" />

            <span className="bagCount">
              {cartCount}
            </span>
          </button>

          <button
            className="iconBtn mobileMenuBtn"
            aria-label={mobile ? 'Close menu' : 'Open menu'}
            aria-expanded={mobile}
            onClick={() => setMobile((v) => !v)}
          >
            <Icon name={mobile ? 'x' : 'bars'} />
          </button>

        </div>
      </div>

      {/* SHOP MEGA MENU */}
      <AnimatePresence>
        {shop && (
          <motion.div
            className="mega"
            onMouseLeave={() => setShop(false)}
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{
              duration: 0.35,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <div className="container megaGrid">

              <div>
                <div className="megaTitle">
                  By Product
                </div>

                {[
                  'Shawls',
                  'Scarves',
                  'Stoles',
                  'Panchu',
                  "Men's Cardigans",
                  "Women's Cardigans",
                  'Knitted Items',
                ].map((x) => (
                  <Link
                    key={x}
                    href={`/shop?category=${encodeURIComponent(x)}`}
                    onClick={() => setMobile(false)}
                  >
                    {x}
                  </Link>
                ))}
              </div>

              <div>
                <div className="megaTitle">
                  By Material
                </div>

                {[
                  'Pashmina',
                  'Cashmere',
                  'Silk',
                  'Wool',
                ].map((x) => (
                  <Link
                    key={x}
                    href={`/shop?material=${x}`}
                  >
                    {x}
                  </Link>
                ))}
              </div>

              <div>
                <div className="megaTitle">
                  By Occasion
                </div>

                {[
                  'Everyday',
                  'Formal',
                  'Party',
                  'Wedding',
                  'Winter',
                ].map((x) => (
                  <Link
                    key={x}
                    href={`/shop?occasion=${x}`}
                  >
                    {x}
                  </Link>
                ))}
              </div>

              <div className="megaFeature">
                <img
                  src="/images/collection-shawls.jpg"
                  alt="Shawls and stoles"
                />

                <span>
                  Quiet luxury, woven in Nepal
                </span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobile && (
          <motion.div
            className="mega"
            initial={{
              height: 0,
              opacity: 0,
            }}
            animate={{
              height: 'auto',
              opacity: 1,
            }}
            exit={{
              height: 'auto',
              opacity: 1,
            }}
          >
            <div className="container megaGrid">

              <div>
                {[
                  ['New Arrivals', '/shop?filter=new'],
                  ['Best Sellers', '/shop?filter=best'],
                  ['Our Craft', '/craft'],
                  ['Our Story', '/story'],
                  ['The Journal', '/journal'],
                  ['Wholesale', '/wholesale'],
                  ['Contact', '/contact'],
                ].map(([x, href]) => (
                  <Link
                    key={x}
                    href={href}
                    onClick={() => setMobile(false)}
                  >
                    {x}
                  </Link>
                ))}
              </div>

              <div>
                {[
                  'Shawls',
                  'Scarves',
                  'Stoles',
                  'Panchu',
                  "Men's Cardigans",
                  "Women's Cardigans",
                  'Knitted Items',
                ].map((x) => (
                  <Link
                    key={x}
                    href={`/shop?category=${encodeURIComponent(x)}`}
                    onClick={() => setMobile(false)}
                  >
                    {x}
                  </Link>
                ))}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SEARCH DRAWER */}
      <AnimatePresence>
        {search && (
          <>
            <motion.div
              className="drawerBackdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearch(false)}
            />

            <motion.aside
              className="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
              }}
            >

              <div className="drawerHeader">

                <span className="eyebrow">
                  Search the collection
                </span>

                <button
                  className="iconBtn"
                  aria-label="Close search"
                  onClick={() => setSearch(false)}
                >
                  <Icon name="x" />
                </button>

              </div>

              <input
                autoFocus
                className="searchInput"
                placeholder="Search shawls, cashmere..."
              />

              <div
                style={{ marginTop: 25 }}
                className="muted"
              >
                Try “cashmere”, “shawl” or “cardigan”.
              </div>

            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </header>
  );
}
