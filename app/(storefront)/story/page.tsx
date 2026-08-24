import { getSiteContent } from '@/lib/actions/content';
import Reveal from '@/components/Reveal';
import Image from 'next/image';

export default async function Story() {
  const { data: story } = await getSiteContent('brand_story');

  return (
    <main className="section" style={{ paddingTop: 145 }}>
      <div className="container" style={{ maxWidth: 1100 }}>
        <Reveal>
          <div className="eyebrow">{story.eyebrow}</div>
          <h1 className="serif" style={{ fontSize: 'clamp(55px,8vw,110px)', fontWeight: 400, lineHeight: .95, whiteSpace: 'pre-line' }}>
            {story.title}
          </h1>
        </Reveal>

        {story.image && (
          <div style={{ marginTop: 40, position: 'relative', width: '100%', height: '400px', borderRadius: '4px', overflow: 'hidden' }}>
            <Image src={story.image} alt={story.title || 'Brand Story'} fill style={{ objectFit: 'cover' }} />
          </div>
        )}

        <div style={{ marginTop: 60, maxWidth: 750, marginLeft: 'auto' }}>
          <Reveal>
            <p className="introCopy">{story.introCopy}</p>
            <p className="detailText" style={{ marginTop: 30, whiteSpace: 'pre-line' }}>
              {story.detailText}
            </p>
          </Reveal>
        </div>
      </div>
    </main>
  );
}
