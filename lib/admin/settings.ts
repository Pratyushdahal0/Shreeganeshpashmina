export type SettingsSection = 'business' | 'store' | 'shipping' | 'payments' | 'notifications' | 'seo' | 'integrations';
export type IntegrationName = 'whatsapp' | 'analytics' | 'khalti' | 'esewa' | 'fonepay' | 'email';
export type IntegrationStatus = 'unconfigured' | 'configured' | 'error';

export type Settings = {
  business: {
    companyName: string;
    logoUrl: string | null;
    contact: string | null;
    address: string | null;
    whatsapp: string | null;
    email: string | null;
    businessHours: string | null;
  };
  store: {
    currency: string;
    taxEnabled: boolean;
    inventoryTracking: boolean;
    checkoutEnabled: boolean;
    orderPrefix: string | null;
  };
  shipping: { enabled: boolean };
  payments: { mode: 'test' | 'live'; enabledGateways: IntegrationName[] };
  notifications: { emailEnabled: boolean; adminNotificationsEnabled: boolean };
  seo: { siteTitle: string; description: string | null; socialImageUrl: string | null };
};

export type SettingsMutationResult =
  | { ok: true; message: string }
  | { ok: false; reason: string; message: string };

const defaultSettings: Settings = {
  business: {
    companyName: 'Shree Ganesh Pashmina',
    logoUrl: null,
    contact: '+977 1 4251234',
    address: 'Thamel, Kathmandu, Nepal',
    whatsapp: '+977 9801234567',
    email: 'info@shreeganeshpashmina.com',
    businessHours: 'Mon-Sun 09:00 - 19:00',
  },
  store: {
    currency: 'USD',
    taxEnabled: false,
    inventoryTracking: true,
    checkoutEnabled: true,
    orderPrefix: 'SGP-',
  },
  shipping: { enabled: true },
  payments: { mode: 'test', enabledGateways: ['whatsapp', 'email'] },
  notifications: { emailEnabled: true, adminNotificationsEnabled: true },
  seo: {
    siteTitle: 'Shree Ganesh Pashmina — Authentic Nepalese Pashmina & Cashmere',
    description: 'Handcrafted luxury pashmina shawls, scarves, and cashmere garments direct from Nepal.',
    socialImageUrl: null,
  },
};

let inMemorySettings: Settings = { ...defaultSettings };

export const settingsService = {
  async get(): Promise<{ state: 'live'; settings: Settings }> {
    return { state: 'live', settings: inMemorySettings };
  },

  async save(section: SettingsSection, input: any): Promise<SettingsMutationResult> {
    if (section in inMemorySettings) {
      (inMemorySettings as any)[section] = { ...(inMemorySettings as any)[section], ...input };
    }
    return { ok: true, message: `${section} settings saved successfully` };
  },

  async integrations(): Promise<{ state: 'live'; items: { name: IntegrationName; status: IntegrationStatus }[] }> {
    return {
      state: 'live',
      items: [
        { name: 'whatsapp', status: 'configured' },
        { name: 'email', status: 'configured' },
        { name: 'analytics', status: 'unconfigured' },
        { name: 'khalti', status: 'unconfigured' },
        { name: 'esewa', status: 'unconfigured' },
        { name: 'fonepay', status: 'unconfigured' },
      ],
    };
  },
};
