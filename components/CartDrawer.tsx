'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icons';
import { Product, currencies, rates } from '@/lib/data';
import { whatsappUrl } from '@/lib/whatsapp';
import { useState, useTransition } from 'react';
import { applyDiscountCode } from '@/lib/actions/discounts';
import { useCurrency } from '@/components/CurrencyContext';

export type CartLine = { product: Product; qty: number };

export default function CartDrawer({
  open,
  onClose,
  lines,
  onQty,
}: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  onQty: (id: string, n: number) => void;
}) {
  const { currency } = useCurrency();
  const [discountCode, setDiscountCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState<{ code: string; amount: number } | null>(null);
  const [discountErr, setDiscountErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const discountAmount = discountApplied ? discountApplied.amount : 0;
  const total = Math.max(0, subtotal - discountAmount);

  const c = currencies[currency];
  const money = (v: number) => `${c.symbol}${Math.round(v * rates[currency]).toLocaleString()}`;

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountErr(null);
    if (!discountCode.trim()) return;

    startTransition(async () => {
      const res = await applyDiscountCode(discountCode, subtotal);
      if (!res.valid || !res.discount) {
        setDiscountErr(res.error || 'Invalid code');
        setDiscountApplied(null);
      } else {
        setDiscountApplied({
          code: res.discount.code,
          amount: res.discount.appliedAmount,
        });
        setDiscountErr(null);
      }
    });
  };

  const msg = `Hello Shree Ganesh Pashmina, I would like to place an order.\n\n${lines
    .map(l => `• ${l.product.name} × ${l.qty} — ${money(l.product.price * l.qty)}`)
    .join('\n')}\n\n${
    discountApplied ? `Discount (${discountApplied.code}): -${money(discountApplied.amount)}\n` : ''
  }Estimated total: ${money(total)}\nCurrency: ${currency}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="drawerBackdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="drawerHeader">
              <span className="eyebrow">Your bag · {lines.length}</span>
              <button className="iconBtn" aria-label="Close bag" onClick={onClose}>
                <Icon name="x" />
              </button>
            </div>

            <div className="drawerBody">
              {lines.length === 0 ? (
                <div style={{ paddingTop: 60, textAlign: 'center' }}>
                  <p className="serif" style={{ fontSize: 32 }}>Your bag is quiet.</p>
                  <p className="muted">Add a piece and continue through WhatsApp.</p>
                </div>
              ) : (
                lines.map(l => (
                  <div className="cartItem" key={l.product.id}>
                    <img src={l.product.image} alt="" />
                    <div>
                      <div className="productName">{l.product.name}</div>
                      <div className="productMaterial">{l.product.material}</div>
                      <div className="qty">
                        <button
                          aria-label={`Decrease quantity of ${l.product.name}`}
                          onClick={() => onQty(l.product.id, l.qty - 1)}
                        >
                          <Icon name="minus" size="xs" />
                        </button>
                        <span>{l.qty}</span>
                        <button
                          aria-label={`Increase quantity of ${l.product.name}`}
                          onClick={() => onQty(l.product.id, l.qty + 1)}
                        >
                          <Icon name="plus" size="xs" />
                        </button>
                      </div>
                    </div>
                    <div style={{ fontSize: 13 }}>{money(l.product.price * l.qty)}</div>
                  </div>
                ))
              )}
            </div>

            {lines.length > 0 && (
              <div className="drawerFooter">
                {/* Discount Code Input */}
                <form onSubmit={handleApplyDiscount} style={{ marginBottom: 15 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <input
                      type="text"
                      placeholder="Discount code (e.g. SAVE20)"
                      value={discountCode}
                      onChange={e => setDiscountCode(e.target.value.toUpperCase())}
                      style={{
                        flex: 1,
                        padding: '6px 10px',
                        border: '1px solid var(--admin-line, #ddd)',
                        borderRadius: 4,
                        fontSize: 12,
                        textTransform: 'uppercase',
                      }}
                    />
                    <button
                      type="submit"
                      disabled={isPending}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        background: '#000',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      Apply
                    </button>
                  </div>
                  {discountErr && <p style={{ color: 'red', fontSize: 11, margin: '4px 0 0' }}>{discountErr}</p>}
                  {discountApplied && (
                    <p style={{ color: 'green', fontSize: 11, margin: '4px 0 0' }}>
                      Code <strong>{discountApplied.code}</strong> applied (-{money(discountApplied.amount)})
                    </p>
                  )}
                </form>

                <div className="shippingProgress">
                  {subtotal < 400 ? (
                    <>
                      <div className="shippingProgressTop">
                        <span>Worldwide delivery</span>
                        <strong>{money(400 - subtotal)} away</strong>
                      </div>
                      <div className="shippingTrack">
                        <span style={{ width: `${Math.min((subtotal / 400) * 100, 100)}%` }} />
                      </div>
                      <p>Add {money(400 - subtotal)} more for complimentary worldwide delivery.</p>
                    </>
                  ) : (
                    <div className="shippingUnlocked">
                      <Icon name="check" size="xs" />
                      <span>Complimentary worldwide delivery unlocked.</span>
                    </div>
                  )}
                </div>

                <div className="total">
                  <span>Estimated total</span>
                  <strong>{money(total)}</strong>
                </div>

                <a
                  className="btn dark"
                  style={{ justifyContent: 'center', width: '100%' }}
                  href={whatsappUrl(msg)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Continue via WhatsApp <Icon name="whatsapp" />
                </a>

                <p className="muted" style={{ fontSize: 10, lineHeight: 1.6, marginTop: 12 }}>
                  Final shipping cost and payment instructions will be confirmed in WhatsApp. Online payment is not enabled in V1.
                </p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
