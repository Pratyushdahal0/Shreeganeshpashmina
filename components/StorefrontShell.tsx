'use client';
import { useState } from 'react';
import Header from './Header';
import CartDrawer from './CartDrawer';
import { CartProvider, useCart } from './CartContext';
import { CurrencyProvider } from './CurrencyContext';

type ActiveDiscount = {
  code: string;
  discountType: string;
  discountValue: number;
  minimumSubtotal: number | null;
};

function Inner({
  children,
  activeDiscounts,
}: {
  children: React.ReactNode;
  activeDiscounts: ActiveDiscount[];
}) {
  const [open, setOpen] = useState(false);
  const { lines, qty, count } = useCart();
  return (
    <>
      <Header cartCount={count} onCart={() => setOpen(true)} activeDiscounts={activeDiscounts} />
      {children}
      <CartDrawer open={open} onClose={() => setOpen(false)} lines={lines} onQty={qty} />
    </>
  );
}

export default function StorefrontShell({
  children,
  activeDiscounts = [],
}: {
  children: React.ReactNode;
  activeDiscounts?: ActiveDiscount[];
}) {
  return (
    <CurrencyProvider>
      <CartProvider>
        <Inner activeDiscounts={activeDiscounts}>{children}</Inner>
      </CartProvider>
    </CurrencyProvider>
  );
}
