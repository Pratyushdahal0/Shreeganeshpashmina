import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getArticleBySlug } from '@/lib/actions/journal';
import Reveal from '@/components/Reveal';

export default async function JournalArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const { article } = await getArticleBySlug(resolvedParams.slug);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  return (
    <main className="section" style={{ paddingTop: 140 }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <Reveal>
          <Link href="/journal" className="eyebrow" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: '20px' }}>
            ← Back to Journal
          </Link>
          <div className="eyebrow">
            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''} · By {article.author}
          </div>
          <h1 className="serif" style={{ fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, lineHeight: 1.05, margin: '15px 0 25px' }}>
            {article.title}
          </h1>
          {article.excerpt && (
            <p style={{ fontSize: '20px', color: '#555', lineHeight: 1.6, fontStyle: 'italic', marginBottom: '40px' }}>
              {article.excerpt}
            </p>
          )}
        </Reveal>

        {article.image && (
          <Reveal>
            <div style={{ position: 'relative', width: '100%', height: '450px', marginBottom: '50px', borderRadius: '4px', overflow: 'hidden' }}>
              <Image src={article.image} alt={article.title} fill style={{ objectFit: 'cover' }} priority />
            </div>
          </Reveal>
        )}

        <Reveal>
          <div
            style={{ fontSize: '16px', lineHeight: 1.8, color: '#333', whiteSpace: 'pre-line' }}
          >
            {article.content}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
