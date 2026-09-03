import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { getSiteContent } from '@/lib/actions/content';

export const metadata = {
  title: 'Our Craft | Shree Ganesh Pashmina',
  description: 'Discover the art of handwoven pashmina and cashmere craftsmanship from the valleys of Nepal.',
};

export default async function Craft() {
  const { data: craft } = await getSiteContent('craftsmanship');

  return (
    <main className="section" style={{ paddingTop: 140 }}>
      <div className="container">
        <Reveal>
          <div className="eyebrow">{craft.eyebrow}</div>
          <h1 className="serif" style={{ fontSize: 'clamp(54px,8vw,120px)', fontWeight: 400, lineHeight: .95, margin: '20px 0 80px', whiteSpace: 'pre-line' }}>
            {craft.title}
          </h1>
        </Reveal>

        {/* Split section: loom image + copy */}
        <div className="split" style={{ minHeight: 650 }}>
          {/* position:relative is required for Next.js fill images */}
          <div className="splitMedia" style={{ position: 'relative' }}>
            <Image
              src={craft.loomImage || '/images/craft-loom.jpg'}
              alt="Hand weaving at a loom"
              fill
              sizes="50vw"
              style={{ objectFit: 'cover' }}
              priority
            />
          </div>
          <div className="splitCopy">
            <div>
              <div className="eyebrow">{craft.loomEyebrow || '01 · Weaving'}</div>
              <h2 style={{ whiteSpace: 'pre-line' }}>{craft.loomTitle || 'Hands at the loom.'}</h2>
              <p>{craft.loomCopy || 'The rhythm of the loom gives every textile its character. We combine traditional wooden handlooms with meticulously selected Himalayan cashmere and pashmina fibers.'}</p>
            </div>
          </div>
        </div>

        <div style={{ height: 80 }} />

        {/* Full-width collection image */}
        <Reveal>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
            <Image
              src="/images/collection-shawls.jpg"
              alt="Shawls and stoles"
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        </Reveal>

        <div style={{ height: 80 }} />

        {/* Process steps */}
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div className="eyebrow">The process</div>
            <h2 className="serif" style={{ fontSize: 'clamp(34px,4vw,64px)', fontWeight: 400, marginTop: 16 }}>
              From fibre to finished piece.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, paddingBottom: 40 }}>
            {[
              { step: '01', label: 'Sourcing', desc: 'Himalayan cashmere and pashmina fibres sourced from carefully selected farms in Nepal and the Himalayas.' },
              { step: '02', label: 'Spinning', desc: 'Fibres are hand-spun into fine yarn using traditional techniques passed through generations of artisans.' },
              { step: '03', label: 'Weaving', desc: 'Yarn is set on hand-operated wooden looms. Each piece takes days of careful, patient work.' },
              { step: '04', label: 'Finishing', desc: 'Hand-fringing, natural dyeing and careful inspection ensure every piece meets our quality standard.' },
            ].map(({ step, label, desc }) => (
              <div key={step} style={{ borderTop: '1px solid #c8bfb5', paddingTop: 24 }}>
                <div className="eyebrow" style={{ marginBottom: 12 }}>{step} · {label}</div>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: '#645e59', margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
