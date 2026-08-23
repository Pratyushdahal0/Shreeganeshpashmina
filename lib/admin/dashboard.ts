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

const mockKpis: DashboardKpis = {
  sales: 24500.50,
  orders: 142,
  awaitingProcessing: 12,
  pendingPayments: 3,
  pendingShipments: 8,
  lowStockProducts: 4,
  outOfStockProducts: 1,
  newCustomers: 24,
  whatsappInquiries: 45,
  wholesaleInquiries: 5,
  averageOrderValue: 172.50,
};

export const dashboardService: AdminDashboardService = {
  async getDashboard(range: DateRange): Promise<DashboardData> {
    return {
      state: 'live',
      updatedAt: new Date().toISOString(),
      currency: 'USD',
      kpis: mockKpis,
      revenueTrend: [
        { date: '2023-10-01', revenue: 1200 },
        { date: '2023-10-02', revenue: 1500 },
        { date: '2023-10-03', revenue: 900 },
        { date: '2023-10-04', revenue: 2100 },
        { date: '2023-10-05', revenue: 1800 },
        { date: '2023-10-06', revenue: 2400 },
        { date: '2023-10-07', revenue: 3100 },
      ],
      salesByChannel: [
        { channel: 'Online Store', revenue: 18500, orders: 110 },
        { channel: 'WhatsApp', revenue: 4500, orders: 25 },
        { channel: 'Wholesale', revenue: 1500.50, orders: 7 },
      ],
      recentOrders: [
        { id: 'ORD-1001', customer: 'Alice Smith', total: 250.00, status: 'Processing', createdAt: new Date().toISOString() },
        { id: 'ORD-1002', customer: 'Bob Johnson', total: 125.50, status: 'Shipped', createdAt: new Date(Date.now() - 86400000).toISOString() },
        { id: 'ORD-1003', customer: 'Charlie Brown', total: 840.00, status: 'Pending Payment', createdAt: new Date(Date.now() - 172800000).toISOString() },
      ],
      lowStockAlerts: [
        { productId: 'prod_1', productName: 'Cashmere Scarf - Red', sku: 'CS-RED-01', quantity: 3 },
        { productId: 'prod_2', productName: 'Pashmina Shawl - Blue', sku: 'PS-BLU-02', quantity: 1 },
      ],
      topProducts: [
        { productId: 'prod_3', name: 'Classic Silk Pashmina', unitsSold: 45, revenue: 4500 },
        { productId: 'prod_4', name: 'Embroidered Cashmere Wrap', unitsSold: 28, revenue: 5600 },
      ],
      whatsapp: { total: 45, open: 5, replied: 40 },
      wholesale: { total: 5, open: 1, replied: 4 },
    };
  },
};
