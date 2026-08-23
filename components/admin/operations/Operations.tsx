'use client';

type Kind = 'Payments' | 'Shipping' | 'Returns & refunds';

const copy: Record<Kind, { eyebrow: string; title: string; notice: string; detail: string; future: string }> = {
  Payments: {
    eyebrow: 'Finance', title: 'Payments',
    notice: 'Payment data is not connected',
    detail: 'No payment record, transaction reference, provider status, or refund can be displayed or recorded.',
    future: 'Prepared for Khalti, eSewa, Fonepay, bank, and card provider adapters. Raw card details are never stored.',
  },
  Shipping: {
    eyebrow: 'Operations', title: 'Shipping',
    notice: 'Shipping data is not connected',
    detail: 'No Nepal delivery zones, methods, charges, free-shipping thresholds, tracking references, or shipment states are configured.',
    future: 'Nepal-first zones and methods are represented by the service boundary; international shipping remains extensible.',
  },
  'Returns & refunds': {
    eyebrow: 'Operations', title: 'Returns & refunds',
    notice: 'Return data is not connected',
    detail: 'No return requests, reasons, linked orders, products, customers, notes, or refunds are available.',
    future: 'Returns connect to orders and refunds through typed service contracts without inventing financial transactions.',
  },
};

const statusSets: Record<Kind, string[]> = {
  Payments: ['Pending', 'Authorized', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'],
  Shipping: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Failed', 'Returned'],
  'Returns & refunds': ['Requested', 'Approved', 'Rejected', 'Received', 'Refunded', 'Closed'],
};

const subtitles: Record<Kind, string> = {
  Payments: 'Manage payment records and safe refund workflows.',
  Shipping: 'Configure delivery operations and shipment tracking.',
  'Returns & refunds': 'Manage controlled return and refund requests.',
};

export default function Operations({ kind }: { kind: Kind }) {
  const c = copy[kind];

  return (
    <section className="adminPayments" aria-labelledby="operations-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">{c.eyebrow}</p>
          <h1 id="operations-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>{c.title}</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>{subtitles[kind]}</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>{c.notice}</strong>
          <span>{c.detail}</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <section className="adminReturnStatuses">
        {statusSets[kind].map(x => (
          <span key={x}>{x}<strong>—</strong></span>
        ))}
      </section>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Configuration & records</p><h2>Unavailable</h2></div>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No live records available</strong>{c.future}</p>
        </div>
      </div>
    </section>
  );
}
