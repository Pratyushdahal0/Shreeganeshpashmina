import './globals.css';
import Footer from '@/components/Footer';
import StorefrontShell from '@/components/StorefrontShell';
import { getActiveDiscounts } from '@/lib/actions/discounts';

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  // Fetch active discounts server-side so the announcement bar reflects admin changes
  const { discounts: activeDiscounts } = await getActiveDiscounts();

  return (
    <StorefrontShell activeDiscounts={activeDiscounts}>
      {children}
      <Footer />
    </StorefrontShell>
  );
}
