'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navGroups = [
  {
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/admin' }],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'Orders', href: '/admin/orders' },
      { label: 'Products', href: '/admin/products' },
      { label: 'Collections', href: '/admin/collections' },
      { label: 'Inventory', href: '/admin/inventory' },
      { label: 'Customers', href: '/admin/customers' },
      { label: 'Discounts', href: '/admin/discounts' },
      { label: 'Reviews', href: '/admin/reviews' },
    ],
  },
  {
    label: 'Sales Channels',
    items: [
      { label: 'WhatsApp', href: '/admin/whatsapp' },
      { label: 'Wholesale / B2B', href: '/admin/wholesale' },
    ],
  },
  {
    label: 'Manufacturing',
    items: [
      { label: 'Factory', href: '/admin/factory' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Content Management', href: '/admin/content' },
      { label: 'Media Library', href: '/admin/media' },
      { label: 'Journal', href: '/admin/journal' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Payments', href: '/admin/payments' },
      { label: 'Shipping', href: '/admin/shipping' },
      { label: 'Returns', href: '/admin/returns' },
      { label: 'Notifications', href: '/admin/notifications' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { label: 'Sales & Reports', href: '/admin/analytics' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', href: '/admin/settings' },
      { label: 'Users & Roles', href: '/admin/users' },
      { label: 'Audit Logs', href: '/admin/audit-logs' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="adminSidebar">
      <div>
        <p className="adminWordmark">
          Shree Ganesh Pashmina<span>Admin / Backoffice</span>
        </p>
      </div>
      <nav className="adminNav" aria-label="Admin navigation">
        {navGroups.map((group) => (
          <div key={group.label} className="adminNavGroup">
            <p className="adminSidebarLabel">{group.label}</p>
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive ? 'isActive' : ''}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div>
        <p className="adminSidebarLabel">Catalogue source</p>
        <p className="adminSidebarStatus">Products and categories are read from the existing static storefront catalogue.</p>
      </div>
    </aside>
  );
}
