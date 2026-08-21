/**
 * Dashboard boundary for the future admin API.
 * `null` means the metric is unavailable — it must never be rendered as zero.
 */
export type DashboardDatePreset = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'last90days' | 'thisYear' | 'custom';

export type DateRange = { preset: DashboardDatePreset; from?: string; to?: string };
export type DataState = 'unavailable' | 'live';

export type DashboardKpis = {
  sales: number | null;
  orders: number | null;
  awaitingProcessing: number | null;
  pendingPayments: number | null;
  pendingShipments: number | null;
  lowStockProducts: number | null;
  outOfStockProducts: number | null;
  newCustomers: number | null;
  whatsappInquiries: number | null;
  wholesaleInquiries: number | null;
  averageOrderValue: number | null;
};

export type RevenuePoint = { date: string; revenue: number };
export type ChannelSale = { channel: string; revenue: number; orders: number };
export type RecentOrder = { id: string; customer: string; total: number; status: string; createdAt: string };
export type StockAlert = { productId: string; productName: string; sku: string; quantity: number };
export type TopProduct = { productId: string; name: string; unitsSold: number; revenue: number };
export type InquirySummary = { total: number | null; open: number | null; replied: number | null };

export type DashboardData = {
  state: DataState;
  updatedAt: string | null;
  currency: string | null;
  kpis: DashboardKpis;
  revenueTrend: RevenuePoint[];
  salesByChannel: ChannelSale[];
  recentOrders: RecentOrder[];
  lowStockAlerts: StockAlert[];
  topProducts: TopProduct[];
  whatsapp: InquirySummary;
  wholesale: InquirySummary;
};

export interface AdminDashboardService {
  getDashboard(range: DateRange): Promise<DashboardData>;
}

const unavailableKpis: DashboardKpis = {
  sales: null, orders: null, awaitingProcessing: null, pendingPayments: null,
  pendingShipments: null, lowStockProducts: null, outOfStockProducts: null,
  newCustomers: null, whatsappInquiries: null, wholesaleInquiries: null, averageOrderValue: null,
};

/** Replace this adapter with the authenticated admin API when it is available. */
export const dashboardService: AdminDashboardService = {
  async getDashboard(): Promise<DashboardData> {
    return {
      state: 'unavailable', updatedAt: null, currency: null, kpis: unavailableKpis,
      revenueTrend: [], salesByChannel: [], recentOrders: [], lowStockAlerts: [], topProducts: [],
      whatsapp: { total: null, open: null, replied: null },
      wholesale: { total: null, open: null, replied: null },
    };
  },
};
