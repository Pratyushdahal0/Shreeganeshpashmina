'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { currencies } from '@/lib/data';
import { Icon } from './Icons';

type CurrencyKey = keyof typeof currencies;
const regions: Record<CurrencyKey, string> = { USD: 'United States', GBP: 'United Kingdom', EUR: 'Europe / Eurozone', AUD: 'Australia', CAD: 'Canada', INR: 'India', NPR: 'Nepal' };

export default function CurrencySelector() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyKey>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('sgp-currency') as CurrencyKey | null;
    if (saved && saved in currencies) setCurrency(saved);

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function choose(next: CurrencyKey) {
    setCurrency(next);
    localStorage.setItem('sgp-currency', next);
    window.dispatchEvent(new Event('currencychange'));
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        className="navBtn currencyBtn"
        aria-label="Select region and currency"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <img className="flag" src={currencies[currency].flag} alt="" />
        <span>{currency}</span>
        <Icon name="chevron" size="xs" />
      </button>

      {typeof document !== 'undefined' && createPortal(<AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close region and currency"
              className="drawerBackdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Region and currency"
              className="currencyDrawer"
              initial={{ x: '100%', opacity: 0.96 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0.96 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="drawerHeader">
                <div>
                  <div className="eyebrow">Region &amp; Currency</div>
                  <p className="drawerSubhead">Choose the market you are shopping from.</p>
                </div>
                <button type="button" className="iconBtn" aria-label="Close" onClick={() => setOpen(false)}>
                  <Icon name="x" />
                </button>
              </div>

              <div className="currencyList">
                {(Object.entries(currencies) as [CurrencyKey, (typeof currencies)[CurrencyKey]][]).map(([key, item]) => (
                  <button
                    type="button"
                    key={key}
                    className={`currencyOption ${currency === key ? 'isActive' : ''}`}
                    onClick={() => choose(key)}
                  >
                    <span className="currencyOptionLeft">
                      <img className="currencyFlag" src={item.flag} alt="" />
                      <span>
                        <strong>{regions[key]}</strong>
                        <small>{item.code}</small>
                      </span>
                    </span>
                    <span className="currencyOptionRight">
                      <span>{item.symbol}</span>
                      {currency === key && <Icon name="check" size="xs" />}
                    </span>
                  </button>
                ))}
              </div>

              <div className="currencyNote">
                <Icon name="globe" size="sm" />
                <span>Prices update to your selected currency. Final shipping and payment details are confirmed via WhatsApp.</span>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>,document.body)}
    </>
  );
}
