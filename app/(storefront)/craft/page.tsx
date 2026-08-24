import Image from 'next/image';
import Reveal from '@/components/Reveal';
import { getSiteContent } from '@/lib/actions/content';

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

        <div className="split" style={{ minHeight: 650 }}>
          <div className="splitMedia">
            <Image
              src={craft.loomImage || '/images/craft-loom.jpg'}
              alt="Hand weaving at a loom"
              fill
              sizes="50vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="splitCopy">
            <div>
              <div className="eyebrow">{craft.loomEyebrow}</div>
              <h2 style={{ whiteSpace: 'pre-line' }}>{craft.loomTitle}</h2>
              <p>{craft.loomCopy}</p>
            </div>
          </div>
        </div>

        <div style={{ height: 80 }} />
        <Reveal>
          <Image src="/images/collection-shawls.jpg" alt="Shawls and stoles" width={1600} height={1100} />
        </Reveal>
      </div>
    </main>
  );
}
