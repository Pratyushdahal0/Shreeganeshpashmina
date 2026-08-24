import { getSiteContent } from '@/lib/actions/content';
import Reveal from '@/components/Reveal';

export default async function Returns() {
  const { data: policies } = await getSiteContent('policies');

  return (
    <main className="section" style={{ paddingTop: 145 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Reveal>
          <div className="eyebrow">Customer Care</div>
          <h1 className="serif" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, marginBottom: '30px' }}>
            Returns & Refunds
          </h1>
          <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#333', whiteSpace: 'pre-line' }}>
            {policies.returnsPolicy}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
