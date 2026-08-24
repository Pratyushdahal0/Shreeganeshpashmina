'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { updateInventory } from '@/lib/actions/inventory';

export default function Inventory({ products }: { products: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [query, setQuery] = useState('');
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [stockInput, setStockInput] = useState<number | ''>('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const shown = products.filter(
    (p) => !query || p.title.toLowerCase().includes(query.toLowerCase())
  );

  const allVariants = products.flatMap((p) =>
    (p.variants || []).map((v: any) => ({ ...v, productTitle: p.title, productId: p.id }))
  );

  const totalStock = allVariants.reduce((sum, v) => sum + (v.inventory || 0), 0);
  const lowStockCount = allVariants.filter((v) => (v.inventory || 0) <= 5).length;

  const handleStartEdit = (variantId: string, currentStock: number) => {
    setEditingVariantId(variantId);
    setStockInput(currentStock);
  };

  const handleSaveStock = (variantId: string) => {
    if (stockInput === '' || isNaN(Number(stockInput)) || Number(stockInput) < 0) {
      setMessage({ type: 'error', text: 'Stock quantity must be a non-negative number.' });
      return;
    }

    setMessage(null);
    startTransition(async () => {
      const res = await updateInventory(variantId, Number(stockInput));
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'Inventory updated successfully.' });
        setEditingVariantId(null);
        router.refresh();
      }
    });
  };

  return (
    <section className="adminInventory" aria-labelledby="inventory-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="inventory-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>
            Inventory
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Real-time stock monitoring and instant inventory level adjustments.
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

      <section
        className="adminInventorySummary"
        aria-label="Inventory summary"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px',
          marginTop: '16px',
        }}
      >
        <article style={{ background: 'var(--admin-panel)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--admin-line)' }}>
          <p style={{ color: 'var(--admin-muted)', fontSize: '12px', margin: 0 }}>Total Items in Stock</p>
          <strong style={{ fontSize: '28px', fontWeight: 700, color: 'var(--admin-ink)' }}>{totalStock}</strong>
          <span style={{ display: 'block', color: 'var(--admin-muted)', fontSize: '12px', marginTop: '4px' }}>Across {allVariants.length} variants</span>
        </article>
        <article style={{ background: 'var(--admin-panel)', padding: '20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--admin-line)' }}>
          <p style={{ color: 'var(--admin-muted)', fontSize: '12px', margin: 0 }}>Low / Out of Stock</p>
          <strong style={{ fontSize: '28px', fontWeight: 700, color: lowStockCount > 0 ? '#DC2626' : 'var(--admin-ink)' }}>
            {lowStockCount}
          </strong>
          <span style={{ display: 'block', color: 'var(--admin-muted)', fontSize: '12px', marginTop: '4px' }}>Items requiring replenishment</span>
        </article>
      </section>

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
          <span style={{ display: 'none' }}>Search inventory</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name..."
            style={{ width: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--admin-line)' }}
          />
        </label>
      </div>

      <div
        className="adminProductTableWrap"
        style={{
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          background: 'var(--admin-panel)',
          marginTop: '16px',
        }}
      >
        <table className="adminTable">
          <thead style={{ background: 'var(--admin-bg)' }}>
            <tr>
              <th>Product</th>
              <th>Variant</th>
              <th>SKU</th>
              <th>In Stock</th>
              <th>Quick Edit</th>
            </tr>
          </thead>
          <tbody>
            {shown.flatMap((product) =>
              (product.variants || []).map((variant: any) => (
                <tr key={variant.id}>
                  <td>
                    <Link href={`/admin/products/${product.id}`} style={{ fontWeight: 600, color: 'var(--admin-ink)', textDecoration: 'none' }}>
                      {product.title}
                    </Link>
                  </td>
                  <td>
                    <span style={{ color: 'var(--admin-muted)' }}>{variant.title || 'Default'}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', color: 'var(--admin-muted)' }}>{variant.sku || '—'}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: variant.inventory > 5 ? '#ECFDF5' : variant.inventory > 0 ? '#FFFBEB' : '#FEF2F2',
                        color: variant.inventory > 5 ? '#047857' : variant.inventory > 0 ? '#D97706' : '#B91C1C',
                        fontSize: '12px',
                        fontWeight: 600,
                      }}
                    >
                      {variant.inventory} in stock
                    </span>
                  </td>
                  <td>
                    {editingVariantId === variant.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <input
                          type="number"
                          min="0"
                          value={stockInput}
                          onChange={(e) => setStockInput(e.target.value === '' ? '' : Number(e.target.value))}
                          style={{ width: '80px', padding: '4px 8px', borderRadius: '4px', border: '1px solid #D1D5DB' }}
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveStock(variant.id)}
                          disabled={isPending}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '4px',
                            background: '#2563EB',
                            color: 'white',
                            border: 'none',
                            fontWeight: 600,
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingVariantId(null)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '4px',
                            background: '#E5E7EB',
                            color: '#374151',
                            border: 'none',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleStartEdit(variant.id, variant.inventory)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563EB',
                          fontWeight: 500,
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        Adjust stock
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {allVariants.length === 0 && (
          <div className="adminEmpty" style={{ background: 'var(--admin-panel)', borderTop: '1px solid var(--admin-line)', padding: '40px', textAlign: 'center' }}>
            <span aria-hidden="true" style={{ fontSize: '32px', color: 'var(--admin-line)' }}>
              ○
            </span>
            <p style={{ marginTop: '16px' }}>
              <strong>No inventory records found</strong>
            </p>
            <p style={{ color: 'var(--admin-muted)', fontSize: '13px' }}>
              Create products with variants to begin managing stock levels.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
