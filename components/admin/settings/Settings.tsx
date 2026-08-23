'use client';
import Link from 'next/link';
import { useState } from 'react';
import { settingsService, type SettingsSection } from '@/lib/admin/settings';

const sections: { key: SettingsSection; title: string; text: string }[] = [
  { key: 'business', title: 'Business', text: 'Company, logo, contact, address, WhatsApp, email, and business hours.' },
  { key: 'store', title: 'Store', text: 'Currency, tax, inventory, checkout, and order configuration.' },
  { key: 'shipping', title: 'Shipping', text: 'Zones, methods, and rates through the shipping service.' },
  { key: 'payments', title: 'Payments', text: 'Enabled gateways and secure test/live configuration.' },
  { key: 'notifications', title: 'Notifications', text: 'Email and administrator notification preferences.' },
  { key: 'seo', title: 'SEO', text: 'Site title, description, and social image.' },
  { key: 'integrations', title: 'Integrations', text: 'WhatsApp, analytics, payment providers, and email.' },
];

export default function Settings() {
  return (
    <section className="adminSettings" aria-labelledby="settings-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">System</p>
          <h1 id="settings-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Settings & integrations</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Server-managed business configuration and provider connections.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Settings are not connected</strong>
          <span>No configuration database or secret manager is configured. Existing storefront values remain untouched.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminSettingsGrid">
        {sections.map(section => (
          <Link key={section.key} href={`/admin/settings/${section.key}`}>
            <p className="adminEyebrow">Settings</p>
            <h2>{section.title}</h2>
            <span>{section.text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SettingsDetail({ section }: { section: string }) {
  const [msg, setMsg] = useState<string | null>(null);

  const save = async () => setMsg((await settingsService.save(section as SettingsSection, {})).message);

  return (
    <section className="adminEditor" aria-labelledby="settings-detail-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Settings</p>
          <h1 id="settings-detail-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>{section}</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Configuration fields will be validated and saved server-side once a secure settings service is connected.</p>
        </div>
        <Link href="/admin/settings" className="adminSecondaryAction">Back to settings</Link>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Secure configuration required</strong>
          <span>API keys, payment credentials, and provider secrets are never displayed or stored in frontend code.</span>
        </div>
        <span className="adminNoticeTag">Unconfigured</span>
      </div>

      {msg && <div className="adminFormMessage">{msg}</div>}

      <div className="adminEditorLayout">
        <section className="adminEditorSection">
          <h2>Configuration unavailable</h2>
          <div className="adminMediaState">
            <strong>No setting record available</strong>
            <span>Connect a server-side configuration store, environment/secret manager, and validation layer before updating {section}.</span>
          </div>
        </section>
        <aside className="adminEditorAside">
          <div>
            <p className="adminEyebrow">Save</p>
            <h2>Not available</h2>
            <p>Changes are intentionally blocked until persistence and authorization are configured.</p>
            <button type="button" className="adminPrimaryButton" onClick={save}>Save settings</button>
          </div>
        </aside>
      </div>
    </section>
  );
}
