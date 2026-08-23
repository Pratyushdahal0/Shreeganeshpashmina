'use client';
import { useState } from 'react';
import { inventoryService, type InventoryMovementType } from '@/lib/admin/inventory';

const movements: InventoryMovementType[] = ['purchase','sale','return','manual_adjustment','damaged','production','transfer'];

export default function Inventory() {
  const [message, setMessage] = useState<string | null>(null);
  const [movement, setMovement] = useState<InventoryMovementType>('manual_adjustment');

  const submit = async () => {
    const result = await inventoryService.adjust({ inventoryId: '', quantity: 0, type: movement, reason: '', reference: '' });
    setMessage(result.message);
  };

  return (
    <section className="adminInventory" aria-labelledby="inventory-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="inventory-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Inventory</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Stock visibility and controlled adjustments for products and variants.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Inventory source not connected</strong>
          <span>No product or variant stock data is available. Counts, alerts, history, and adjustments cannot be shown or recorded.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      {message && <div className="adminFormMessage" role="status">{message}</div>}

      <section className="adminInventorySummary" aria-label="Inventory summary">
        {['Current stock', 'Available stock', 'Reserved stock', 'Low stock', 'Out of stock', 'Inventory mismatches'].map((label) => (
          <article key={label}>
            <p>{label}</p>
            <strong>—</strong>
            <span>Unavailable</span>
          </article>
        ))}
      </section>

      <div className="adminInventoryGrid">
        <section className="adminPanel">
          <div className="adminPanelHeading">
            <div><p className="adminEyebrow">Stock records</p><h2>Product & variant inventory</h2></div>
            <span>Unavailable</span>
          </div>
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No inventory records available</strong>Connect inventory data to track current, available, reserved, low, and out-of-stock quantities by product or variant.</p>
          </div>
        </section>

        <section className="adminPanel">
          <div className="adminPanelHeading">
            <div><p className="adminEyebrow">Alerts</p><h2>Attention needed</h2></div>
            <span>Unavailable</span>
          </div>
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No alerts can be evaluated</strong>Low-stock, out-of-stock, mismatch, and pending-adjustment alerts need live inventory data.</p>
          </div>
        </section>
      </div>

      <div className="adminInventoryGrid">
        <section className="adminPanel">
          <div className="adminPanelHeading">
            <div><p className="adminEyebrow">Movement history</p><h2>Inventory ledger</h2></div>
            <span>Unavailable</span>
          </div>
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No inventory history available</strong>Every persisted movement will require quantity, reason, user, timestamp, and reference.</p>
          </div>
        </section>

        <section className="adminPanel">
          <div className="adminPanelHeading">
            <div><p className="adminEyebrow">Adjustment</p><h2>Record a movement</h2></div>
          </div>
          <div className="adminAdjustment">
            <label>
              Movement type
              <select value={movement} onChange={(e) => setMovement(e.target.value as InventoryMovementType)}>
                {movements.map((type) => <option key={type} value={type}>{type.replace('_', ' ')}</option>)}
              </select>
            </label>
            <label>Quantity<input disabled placeholder="Select inventory record first" /></label>
            <label>Reason<input disabled placeholder="Required when persistence is connected" /></label>
            <label>Reference<input disabled placeholder="Required audit reference" /></label>
            <button type="button" className="adminPrimaryButton" onClick={submit}>Record adjustment</button>
          </div>
          <p className="adminPanelFootnote">No adjustment is ever applied silently. Bulk adjustments and threshold changes use the same pending inventory-service boundary.</p>
        </section>
      </div>
    </section>
  );
}
