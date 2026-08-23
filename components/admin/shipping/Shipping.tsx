export default function Shipping() {
  return (
    <section className="adminShipping" aria-labelledby="shipping-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Fulfilment</p>
          <h1 id="shipping-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Shipping</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Nepal-first shipping zones and shipment tracking, designed to extend internationally.</p>
        </div>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Shipping configuration is not connected</strong>
          <span>No zones, methods, delivery charges, thresholds, tracking references, or shipment records are configured.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <section className="adminShippingGrid">
        <Panel eyebrow="Shipping zones" title="Nepal & international delivery" text="Configure country coverage, delivery charges, free-shipping thresholds, and estimated delivery time when a shipping service is connected." />
        <Panel eyebrow="Shipments" title="Tracking & status" text="Connect order fulfilment to track pending, packed, shipped, delivered, failed, and returned shipments." />
      </section>
    </section>
  );
}

function Panel({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <div className="adminPanel">
      <div className="adminPanelHeading">
        <div><p className="adminEyebrow">{eyebrow}</p><h2>{title}</h2></div>
        <span>Unavailable</span>
      </div>
      <div className="adminEmpty">
        <span aria-hidden="true">○</span>
        <p><strong>No data available</strong>{text}</p>
      </div>
    </div>
  );
}
