'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { currencies } from '@/lib/data';

export type CurrencyKey = keyof typeof currencies;

type CurrencyCtx = {
  currency: CurrencyKey;
  setCurrency: (next: CurrencyKey) => void;
};

const CurrencyContext = createContext<CurrencyCtx | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyKey>('USD');

  useEffect(() => {
    const saved = localStorage.getItem('sgp-currency') as CurrencyKey | null;
    if (saved && saved in currencies) setCurrencyState(saved);
  }, []);

  const setCurrency = (next: CurrencyKey) => {
    setCurrencyState(next);
    localStorage.setItem('sgp-currency', next);
  };

  const value = useMemo(() => ({ currency, setCurrency }), [currency]);
  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used inside CurrencyProvider');
  return ctx;
}
