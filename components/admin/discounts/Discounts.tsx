'use client';
import { useState } from 'react';
import { validateDiscount } from '@/lib/admin/discounts';

export default function Discounts() {
  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const check = () => {
    const validated = validateDiscount({ type: 'fixed', value: Number(value || 0), minimumOrderAmount: undefined });
    setResult(validated.valid
      ? 'Rule is valid, but cannot be saved without a promotion service.'
      : validated.errors.join(' ')
    );
  };

  return (
    <section className="adminDiscounts" aria-labelledby="discounts-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Commerce</p>
          <h1 id="discounts-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Discounts</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Promotions with controlled scope, dates, limits, and eligibility.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Discounts are not connected</strong>
          <span>No active discounts or promotion records are available. Rules cannot be saved or redeemed.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <section className="adminDiscountRules">
        <span>Percentage or fixed value</span>
        <span>Product or collection scope</span>
        <span>Minimum order and customer restrictions</span>
        <span>Dates and usage limits</span>
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Rule validation</p><h2>Negative-price protection</h2></div>
        </div>
        <div className="adminDiscountCheck">
          <label>
            Fixed discount value
            <input type="number" min="0" value={value} onChange={e => setValue(e.target.value)} placeholder="Enter amount to validate..." />
          </label>
          <button type="button" className="adminPrimaryButton" onClick={check}>Validate rule</button>
          {result && <p className="adminFormMessage">{result}</p>}
        </div>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Promotions</p><h2>All discounts</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No discounts available</strong>Connect a promotion backend to create server-validated discounts and enforce eligibility at checkout.</p>
        </div>
      </div>
    </section>
  );
}
