import Link from 'next/link';
import Image from 'next/image';
import { getArticles } from '@/lib/actions/journal';
import Reveal from '@/components/Reveal';

export default async function JournalListing() {
  const { articles } = await getArticles('PUBLISHED');

  return (
    <main className="section" style={{ paddingTop: 140 }}>
      <div className="container">
        <Reveal>
          <div className="eyebrow">Editorial</div>
          <h1 className="serif" style={{ fontSize: 'clamp(54px,8vw,120px)', fontWeight: 400, lineHeight: .95, margin: '20px 0 60px' }}>
            The Journal
          </h1>
        </Reveal>

        {articles.length === 0 ? (
          <p style={{ fontSize: '18px', color: '#666' }}>No articles published yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '40px' }}>
            {articles.map(a => (
              <Reveal key={a.id}>
                <Link href={`/journal/${a.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {a.image && (
                    <div style={{ position: 'relative', width: '100%', height: '240px', overflow: 'hidden', borderRadius: '4px' }}>
                      <Image src={a.image} alt={a.title} fill style={{ objectFit: 'cover' }} />
                    </div>
                  )}
                  <div>
                    <div className="eyebrow" style={{ fontSize: '12px' }}>
                      {a.publishedAt ? new Date(a.publishedAt).toLocaleDateString() : ''} · By {a.author}
                    </div>
                    <h2 className="serif" style={{ fontSize: '24px', margin: '8px 0', fontWeight: 400 }}>{a.title}</h2>
                    {a.excerpt && <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>{a.excerpt}</p>}
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
