'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

type ActiveDiscount = {
  code: string;
  discountType: string;
  discountValue: number;
  minimumSubtotal: number | null;
};

export default function PromoBanner({ discounts }: { discounts: ActiveDiscount[] }) {
  const [copied, setCopied] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  if (discounts.length === 0 || dismissed) return null;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(code);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  const formatDiscount = (d: ActiveDiscount) => {
    const isPercent = d.discountType === 'PERCENTAGE';
    const label = isPercent ? `${d.discountValue}% off` : `$${d.discountValue} off`;
    const minNote = d.minimumSubtotal && d.minimumSubtotal > 0
      ? ` on orders over $${d.minimumSubtotal}`
      : '';
    return `${label}${minNote}`;
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            background: 'linear-gradient(135deg, #1c1b1a 0%, #3a2e28 100%)',
            color: '#f8f6f2',
            padding: '14px 20px',
            borderRadius: 8,
            marginBottom: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, letterSpacing: '.16em', textTransform: 'uppercase', color: '#ffd97d', fontWeight: 600 }}>
              🎁 Special Offer
            </span>
            <span style={{ fontSize: 13, color: '#e7e1db' }}>
              {discounts.length === 1
                ? `Save ${formatDiscount(discounts[0])} with code:`
                : `${discounts.length} active discount codes:`}
            </span>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {discounts.map((d) => (
                <button
                  key={d.code}
                  onClick={() => copyCode(d.code)}
                  title={`Copy code ${d.code} — ${formatDiscount(d)}`}
                  style={{
                    background: 'rgba(255,217,125,0.15)',
                    border: '1px solid rgba(255,217,125,0.5)',
                    borderRadius: 4,
                    padding: '4px 10px',
                    color: '#ffd97d',
                    fontSize: 12,
                    fontWeight: 700,
                    letterSpacing: '.1em',
                    cursor: 'pointer',
                    transition: 'background .2s',
                    fontFamily: 'monospace',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,217,125,0.28)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,217,125,0.15)')}
                >
                  {d.code}
                  <span style={{ fontSize: 10, opacity: 0.7 }}>
                    {copied === d.code ? '✓ Copied!' : `· ${formatDiscount(d)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss promo banner"
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,.4)',
              cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '2px 4px',
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
