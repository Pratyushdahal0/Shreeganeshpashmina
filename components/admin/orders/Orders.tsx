'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateOrderStatus, updatePaymentStatus } from '@/lib/actions/orders';

type Props = { orders: any[] };

export default function Orders({ orders }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const filteredOrders = orders.filter((order) => {
    const searchString = `${order.orderNumber || ''} ${order.customer?.firstName || ''} ${order.customer?.lastName || ''} ${order.customer?.email || ''}`.toLowerCase();
    const matchesQuery = !query || searchString.includes(query.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setMessage(null);
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, newStatus as any);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: `Order status updated to ${newStatus}` });
        router.refresh();
      }
    });
  };

  const handlePaymentChange = (orderId: string, newPaymentStatus: string) => {
    setMessage(null);
    startTransition(async () => {
      const res = await updatePaymentStatus(orderId, newPaymentStatus as any);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: `Payment status updated to ${newPaymentStatus}` });
        router.refresh();
      }
    });
  };

  return (
    <section className="adminOrders" aria-labelledby="orders-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="orders-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 600 }}>
            Orders
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Manage order fulfillments, payment statuses, and customer purchase records.
          </p>
        </div>
      </div>

      {message && (
        <div
          style={{
            margin: '16px 0',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
            color: message.type === 'success' ? '#065F46' : '#991B1B',
            fontSize: '14px',
            fontWeight: 500,
          }}
          role="status"
        >
          {message.text}
        </div>
      )}

      <div
        className="adminProductTools"
        style={{
          display: 'flex',
          gap: '16px',
          padding: '16px',
          marginTop: '16px',
          background: 'var(--admin-panel)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--admin-line)',
        }}
      >
        <label className="adminSearch" style={{ flex: 1, margin: 0 }}>
          <span style={{ display: 'none' }}>Search orders</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by order number, customer name, or email..."
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}
          />
        </label>
        <label style={{ margin: 0, width: '220px' }}>
          <span style={{ display: 'none' }}>Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}
          >
            <option value="ALL">All order statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </label>
      </div>

      <div
        className="adminProductTableWrap"
        style={{
          marginTop: '16px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          background: 'var(--admin-panel)',
        }}
      >
        <table className="adminTable">
          <thead style={{ background: 'var(--admin-bg)' }}>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Payment status</th>
              <th>Fulfillment status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong style={{ color: 'var(--admin-ink)' }}>
                    {order.orderNumber || order.id.slice(0, 8)}
                  </strong>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                  {order.customer
                    ? `${order.customer.firstName || ''} ${order.customer.lastName || ''}`.trim() || 'Customer'
                    : 'Guest Customer'}
                  <br />
                  <small style={{ color: 'var(--admin-muted)' }}>{order.customer?.email}</small>
                </td>
                <td>${Number(order.total).toLocaleString()}</td>
                <td>
                  <select
                    value={order.paymentStatus}
                    onChange={(e) => handlePaymentChange(order.id, e.target.value)}
                    disabled={isPending}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: order.paymentStatus === 'PAID' ? '#D1FAE5' : '#FEE2E2',
                      color: order.paymentStatus === 'PAID' ? '#065F46' : '#991B1B',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="UNPAID">UNPAID</option>
                    <option value="PAID">PAID</option>
                    <option value="REFUNDED">REFUNDED</option>
                  </select>
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    disabled={isPending}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: '#EFF6FF',
                      color: '#1D4ED8',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="PROCESSING">PROCESSING</option>
                    <option value="SHIPPED">SHIPPED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredOrders.length === 0 && (
          <div className="adminEmpty" style={{ background: 'var(--admin-panel)', padding: '40px', textAlign: 'center' }}>
            <span aria-hidden="true" style={{ fontSize: '32px', color: 'var(--admin-line)' }}>
              ○
            </span>
            <p style={{ marginTop: '16px' }}>
              <strong>No orders found</strong>
            </p>
            <p style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>
              No order records match your current filter settings.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
