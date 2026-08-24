import { Icon } from '@/components/Icons';
import { whatsappUrl } from '@/lib/whatsapp';
import { getSiteContent } from '@/lib/actions/content';

export default async function Contact() {
  const { data: contact } = await getSiteContent('contact');

  return (
    <main className="section" style={{ paddingTop: 145 }}>
      <div className="container">
        <div className="eyebrow">{contact.eyebrow}</div>
        <h1 className="serif" style={{ fontWeight: 400, fontSize: 'clamp(55px,8vw,110px)', lineHeight: .95, whiteSpace: 'pre-line' }}>
          {contact.title}
        </h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 30, marginTop: 80 }}>
          <a className="btn" href={whatsappUrl('Hello Shree Ganesh Pashmina, I have an enquiry.')} target="_blank" rel="noreferrer">
            WhatsApp <Icon name="whatsapp" />
          </a>
          <div>
            <div className="eyebrow">Location</div>
            <p style={{ fontWeight: 500 }}>{contact.location}</p>
          </div>
          <div>
            <div className="eyebrow">International</div>
            <p style={{ fontWeight: 500 }}>{contact.shipping}</p>
          </div>
          {contact.email && (
            <div>
              <div className="eyebrow">Email</div>
              <p style={{ fontWeight: 500 }}>{contact.email}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
