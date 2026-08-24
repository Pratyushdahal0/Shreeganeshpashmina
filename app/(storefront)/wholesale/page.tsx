'use client';
import { useState, useTransition } from 'react';
import Reveal from '@/components/Reveal';
import { submitInquiry } from '@/lib/actions/inquiries';

export default function WholesalePage() {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [estimatedQuantity, setEstimatedQuantity] = useState('');
  const [message, setMessage] = useState('');
  
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const res = await submitInquiry({
        type: 'WHOLESALE',
        customerName,
        customerEmail,
        customerPhone,
        companyName,
        estimatedQuantity: estimatedQuantity ? Number(estimatedQuantity) : undefined,
        message,
      });

      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setCompanyName('');
        setEstimatedQuantity('');
        setMessage('');
      }
    });
  };

  return (
    <main className="section" style={{ paddingTop: 140 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Reveal>
          <div className="eyebrow">B2B & Trade</div>
          <h1 className="serif" style={{ fontSize: 'clamp(48px,7vw,96px)', fontWeight: 400, lineHeight: .95, margin: '20px 0 30px' }}>
            Wholesale Inquiries
          </h1>
          <p className="introCopy" style={{ marginBottom: 50 }}>
            Partner with Shree Ganesh Pashmina for luxury boutique, private label, and custom wholesale manufacturing from Kathmandu.
          </p>
        </Reveal>

        <Reveal>
          {success ? (
            <div style={{ padding: '30px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', textAlign: 'center' }}>
              <h3 style={{ color: '#166534', margin: '0 0 10px' }}>Inquiry Received</h3>
              <p style={{ color: '#15803d', margin: 0 }}>
                Thank you for your business interest. Our wholesale team will review your requirements and respond shortly.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="btn dark"
                style={{ marginTop: '20px' }}
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500 }}>Contact Name *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500 }}>Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500 }}>Email Address</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500 }}>Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500 }}>Estimated Order Quantity (pieces)</label>
                <input
                  type="number"
                  min="1"
                  placeholder="e.g. 50"
                  value={estimatedQuantity}
                  onChange={e => setEstimatedQuantity(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', marginBottom: '6px', fontWeight: 500 }}>Project Details / Message *</label>
                <textarea
                  required
                  rows={5}
                  placeholder="Please describe products of interest, target delivery dates, or custom specs..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }}
                />
              </div>

              {error && <p style={{ color: 'red', margin: 0, fontSize: '14px' }}>{error}</p>}

              <button type="submit" className="btn dark" disabled={isPending} style={{ alignSelf: 'flex-start' }}>
                {isPending ? 'Submitting...' : 'Submit Wholesale Inquiry'}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </main>
  );
}
