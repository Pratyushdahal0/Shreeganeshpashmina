import Link from 'next/link';

const sections = [
  ['Homepage', 'homepage'], ['Pages', 'pages'], ['Hero & banners', 'hero_banners'],
  ['Brand story', 'brand_story'], ['Factory story', 'factory_story'],
  ['Craftsmanship', 'craftsmanship'], ['FAQs', 'faqs'], ['Policies', 'policies'], ['Contact information', 'contact'],
];

export default function Content() {
  return (
    <section className="adminContentCms" aria-labelledby="content-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Website</p>
          <h1 id="content-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Content management</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Manage normal website content once a CMS backend is connected.</p>
        </div>
        <Link className="adminPrimaryAction" href="/admin/journal">Manage journal</Link>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Storefront content remains unchanged</strong>
          <span>Current website content is hardcoded in frontend routes. No migration is performed until a versioned CMS API and preview workflow are ready.</span>
        </div>
        <span className="adminNoticeTag">Migration pending</span>
      </div>

      <div className="adminCmsGrid">
        {sections.map(([title, section]) => (
          <Link key={section} href={`/admin/content/${section}`}>
            <p className="adminEyebrow">Content</p>
            <h2>{title}</h2>
            <span>Unavailable until CMS integration</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ContentDetail({ section }: { section: string }) {
  return (
    <section className="adminEditor" aria-labelledby="content-detail-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Content</p>
          <h1 id="content-detail-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>{section.replaceAll('_', ' ')}</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Editing is ready for a server-backed CMS.</p>
        </div>
        <Link href="/admin/content" className="adminSecondaryAction">Back to content</Link>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Content editing is unavailable</strong>
          <span>No content record can be loaded or saved. Existing storefront content is protected from accidental overwrite.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>
    </section>
  );
}

export function Journal() {
  return (
    <section className="adminContentCms" aria-labelledby="journal-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Journal</p>
          <h1 id="journal-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Articles</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Draft, publish, schedule, categorize, and optimize articles.</p>
        </div>
        <Link href="/admin/journal/new" className="adminPrimaryAction">Create article</Link>
      </div>

      <div className="adminNotice">
        <div>
          <strong>Journal is not connected</strong>
          <span>No articles, authors, categories, tags, featured images, or publishing schedules are available.</span>
        </div>
        <span className="adminNoticeTag">No persistence</span>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Article list</p><h2>All articles</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No articles available</strong>Connect the CMS to author drafts and manage publication, scheduling, slugs, SEO, and media.</p>
        </div>
      </div>
    </section>
  );
}
