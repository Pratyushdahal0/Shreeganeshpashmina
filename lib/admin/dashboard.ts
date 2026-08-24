import { getDashboardMetrics } from '@/lib/actions/dashboard';

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

export const dashboardService = {
  async getDashboard(_range?: DateRange): Promise<DashboardData> {
    return await getDashboardMetrics();
  },
};
