'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCustomer, deleteCustomer } from '@/lib/actions/customers';

type Props = { customers: any[] };

export default function Customers({ customers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const shown = customers.filter((customer) => {
    if (!query) return true;
    const searchString = `${customer.firstName || ''} ${customer.lastName || ''} ${customer.email || ''} ${customer.phone || ''}`.toLowerCase();
    return searchString.includes(query.toLowerCase());
  });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setMessage({ type: 'error', text: 'Please enter a valid email address.' });
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const res = await createCustomer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Customer account created successfully.' });
        setShowAddModal(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPhone('');
        router.refresh();
      }
    });
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (!confirm('Are you sure you want to delete this customer record?')) return;
    setMessage(null);
    startTransition(async () => {
      const res = await deleteCustomer(customerId);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Customer deleted.' });
        router.refresh();
      }
    });
  };

  return (
    <section className="adminCustomers" aria-labelledby="customers-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="customers-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>
            Customers
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Customer database, order totals, contact details, and customer management.
          </p>
        </div>
        <div>
          <button
            type="button"
            className="adminPrimaryAction"
            onClick={() => setShowAddModal(true)}
            style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px' }}
          >
            Add customer
          </button>
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

      {showAddModal && (
        <form
          onSubmit={handleAddCustomer}
          style={{
            margin: '16px 0',
            padding: '20px',
            background: 'var(--admin-panel)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--admin-line)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>Add New Customer</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-muted)' }}>First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-muted)' }}>Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-muted)' }}>Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john.doe@example.com"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--admin-muted)' }}>Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
            <button
              type="submit"
              disabled={isPending}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                background: '#2563EB',
                color: 'white',
                border: 'none',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {isPending ? 'Saving...' : 'Save Customer'}
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                background: '#E5E7EB',
                color: '#374151',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
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
          <span style={{ display: 'none' }}>Search customers</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, or phone number..."
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}
          />
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
              <th>Customer</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Orders</th>
              <th>Total Spent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((customer) => {
              const orderCount = customer.orders?.length || 0;
              const totalSpent = customer.orders?.reduce((sum: number, order: any) => sum + Number(order.total || 0), 0) || 0;
              const name = `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || 'Customer';

              return (
                <tr key={customer.id}>
                  <td>
                    <strong style={{ color: 'var(--admin-ink)' }}>{name}</strong>
                  </td>
                  <td>
                    <span style={{ color: 'var(--admin-muted)' }}>{customer.email}</span>
                  </td>
                  <td>
                    <span style={{ color: 'var(--admin-muted)' }}>{customer.phone || '—'}</span>
                  </td>
                  <td>{orderCount}</td>
                  <td>${totalSpent.toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleDeleteCustomer(customer.id)}
                      disabled={isPending}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#DC2626',
                        fontWeight: 500,
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {shown.length === 0 && (
          <div className="adminEmpty" style={{ background: 'var(--admin-panel)', padding: '40px', textAlign: 'center' }}>
            <span aria-hidden="true" style={{ fontSize: '32px', color: 'var(--admin-line)' }}>
              ○
            </span>
            <p style={{ marginTop: '16px' }}>
              <strong>No customer records found</strong>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
