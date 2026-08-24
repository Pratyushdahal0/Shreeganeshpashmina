'use client';

import Link from 'next/link';
import { useState, useEffect, useTransition } from 'react';
import { settingsService, type SettingsSection, type Settings as SettingsType } from '@/lib/admin/settings';

const sections: { key: SettingsSection; title: string; text: string }[] = [
  { key: 'business', title: 'Business', text: 'Company, logo, contact, address, WhatsApp, email, and business hours.' },
  { key: 'store', title: 'Store', text: 'Currency, tax, inventory, checkout, and order configuration.' },
  { key: 'shipping', title: 'Shipping', text: 'Shipping zones, delivery options, and rate preferences.' },
  { key: 'payments', title: 'Payments', text: 'Payment gateway configuration and payment methods.' },
  { key: 'notifications', title: 'Notifications', text: 'Email and administrator notification preferences.' },
  { key: 'seo', title: 'SEO', text: 'Site title, description, and social meta image.' },
  { key: 'integrations', title: 'Integrations', text: 'WhatsApp CRM, analytics, payment providers, and email.' },
];

export default function Settings() {
  return (
    <section className="adminSettings" aria-labelledby="settings-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">System</p>
          <h1 id="settings-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>
            Settings & Integrations
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Store preferences, payment settings, business profiles, and integrations.
          </p>
        </div>
      </div>

      <div className="adminSettingsGrid" style={{ marginTop: '20px' }}>
        {sections.map((section) => (
          <Link key={section.key} href={`/admin/settings/${section.key}`}>
            <p className="adminEyebrow">Configuration</p>
            <h2 style={{ fontSize: '18px', fontWeight: 600, margin: '6px 0' }}>{section.title}</h2>
            <span style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>{section.text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function SettingsDetail({ section }: { section: string }) {
  const [isPending, startTransition] = useTransition();
  const [settings, setSettings] = useState<SettingsType | null>(null);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});

  useEffect(() => {
    settingsService.get().then((res) => {
      if (res.settings) {
        setSettings(res.settings);
        if (section in res.settings) {
          setFormData((res.settings as any)[section] || {});
        }
      }
    });
  }, [section]);

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setMsg(null);
    startTransition(async () => {
      const res = await settingsService.save(section as SettingsSection, formData);
      if (res.ok) {
        setMsg({ type: 'success', text: res.message });
      } else {
        setMsg({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <section className="adminEditor" aria-labelledby="settings-detail-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Settings / {section}</p>
          <h1 id="settings-detail-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700, textTransform: 'capitalize' }}>
            {section} Settings
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Manage {section} preferences for your Pashmina storefront.
          </p>
        </div>
        <Link href="/admin/settings" className="adminSecondaryAction" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}>
          Back to settings
        </Link>
      </div>

      {msg && (
        <div
          style={{
            margin: '16px 0',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: msg.type === 'success' ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${msg.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
            color: msg.type === 'success' ? '#065F46' : '#991B1B',
            fontSize: '14px',
            fontWeight: 500,
          }}
          role="status"
        >
          {msg.text}
        </div>
      )}

      <div className="adminEditorLayout" style={{ marginTop: '20px' }}>
        <section className="adminEditorSection" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--admin-line)', paddingBottom: '16px', marginBottom: '16px', textTransform: 'capitalize' }}>
            {section} Configuration
          </h2>
          <div className="adminFieldGrid">
            {Object.keys(formData).map((key) => {
              const val = formData[key];
              const isBool = typeof val === 'boolean';
              return (
                <label key={key} className="adminField" style={{ display: 'block', marginBottom: '12px' }}>
                  <span style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: 'var(--admin-ink)', textTransform: 'capitalize', marginBottom: '4px' }}>
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  {isBool ? (
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => handleChange(key, e.target.checked)}
                      disabled={isPending}
                    />
                  ) : (
                    <input
                      type="text"
                      value={val ?? ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                      disabled={isPending}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
                    />
                  )}
                </label>
              );
            })}
          </div>
        </section>

        <aside className="adminEditorAside">
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '20px',
              background: 'var(--admin-panel)',
              border: '1px solid var(--admin-line)',
            }}
          >
            <p className="adminEyebrow">Save</p>
            <h2 style={{ fontSize: '18px', margin: '4px 0 12px 0' }}>Update Preferences</h2>
            <button
              type="button"
              className="adminPrimaryButton"
              onClick={handleSave}
              disabled={isPending}
              style={{
                width: '100%',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: '13px',
                background: '#2563EB',
                color: 'white',
                border: 'none',
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
