import Link from "next/link";

const groups = [
  { label: "Overview", items: [["▦", "Dashboard", "/admin"]] },
  { label: "Commerce", items: [["□", "Orders", "/admin/orders"], ["◫", "Products", "/admin/products"], ["◇", "Collections", "/admin/collections"], ["▤", "Inventory", "/admin/inventory"], ["○", "Customers", "/admin/customers"]] },
  { label: "Sales channels", items: [["◌", "WhatsApp", "/admin/whatsapp"], ["▢", "Enquiries", "/admin/requests"]] },
  { label: "Content", items: [["▤", "Homepage banners", "/admin/banners"]] },
  { label: "System", items: [["◉", "Users & roles", "/admin/users"], ["⚙", "Settings", "/admin/settings"], ["≡", "Audit logs", "/admin/audit-logs"]] },
];

export default function AdminNav() { return <nav className="adminNav" aria-label="Administration">{groups.map((group) => <div className="adminNavGroup" key={group.label}><small>{group.label}</small>{group.items.map(([icon, label, href]) => <Link key={href} href={href}><span aria-hidden="true">{icon}</span>{label}</Link>)}</div>)}</nav>; }
