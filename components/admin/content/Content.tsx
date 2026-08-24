'use client';
import Link from 'next/link';
import { useEffect, useState, useTransition } from 'react';
import {
  getArticles,
  createArticle,
  updateArticle,
  deleteArticle,
} from '@/lib/actions/journal';
import { getSiteContent, updateSiteContent } from '@/lib/actions/content';
import ImageUpload from '../ImageUpload';

type Article = Awaited<ReturnType<typeof getArticles>>['articles'][number];

export function Journal() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [formError, setFormError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await getArticles();
    setArticles(res.articles);
    setError(res.error);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const resetForm = () => {
    setTitle(''); setExcerpt(''); setContent(''); setImage(''); setStatus('DRAFT');
    setFormError(null); setEditId(null); setShowForm(false);
  };

  const handleSave = () => {
    setFormError(null);
    startTransition(async () => {
      const res = editId
        ? await updateArticle(editId, { title, excerpt, content, image, status })
        : await createArticle({ title, excerpt, content, image, status });
      if (res.error) { setFormError(res.error); return; }
      resetForm();
      await load();
    });
  };

  const handleEdit = (a: Article) => {
    setEditId(a.id);
    setTitle(a.title);
    setExcerpt(a.excerpt || '');
    setContent(a.content || '');
    setImage(a.image || '');
    setStatus(a.status as any);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this article?')) return;
    startTransition(async () => { await deleteArticle(id); await load(); });
  };

  const toggleStatus = (a: Article) => {
    startTransition(async () => {
      await updateArticle(a.id, { status: a.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED' });
      await load();
    });
  };

  return (
    <section className="adminContentCms" aria-labelledby="journal-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Journal</p>
          <h1 id="journal-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Articles & Blog</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Draft, publish, schedule, and manage editorial articles for the storefront.</p>
        </div>
        <button type="button" className="adminPrimaryAction" onClick={() => { resetForm(); setShowForm(v => !v); }}>
          {showForm ? 'Cancel' : 'Create article'}
        </button>
      </div>

      {showForm && (
        <div className="adminPanel">
          <div className="adminPanelHeading">
            <div><p className="adminEyebrow">Article editor</p><h2>{editId ? 'Edit article' : 'New article'}</h2></div>
          </div>
          <div className="adminDiscountCheck">
            <label>Title <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Article title…" /></label>
            <label>Excerpt <input value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="Short summary…" /></label>
            
            <ImageUpload
              label="Cover Image"
              value={image}
              onChange={url => setImage(url)}
              placeholder="Upload cover image file or paste URL..."
            />

            <label>Status
              <select value={status} onChange={e => setStatus(e.target.value as any)}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
              </select>
            </label>
            <label style={{ width: '100%' }}>Content
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={10}
                placeholder="Write your article content here…"
                style={{ width: '100%', fontFamily: 'inherit', fontSize: '14px', padding: '10px' }}
              />
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="adminPrimaryButton" onClick={handleSave} disabled={isPending}>
                {isPending ? 'Saving…' : editId ? 'Update article' : 'Publish article'}
              </button>
              <button type="button" onClick={resetForm}>Cancel</button>
            </div>
            {formError && <p className="adminFormMessage" style={{ color: 'var(--admin-danger)' }}>{formError}</p>}
          </div>
        </div>
      )}

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Article list</p><h2>All articles</h2></div>
          <span>{articles.length} article{articles.length !== 1 ? 's' : ''}</span>
        </div>
        {loading ? (
          <div className="adminEmpty"><p>Loading…</p></div>
        ) : error ? (
          <div className="adminEmpty"><p style={{ color: 'var(--admin-danger)' }}>{error}</p></div>
        ) : articles.length === 0 ? (
          <div className="adminEmpty">
            <span aria-hidden="true">○</span>
            <p><strong>No articles yet</strong>Create your first blog post above.</p>
          </div>
        ) : (
          <table className="adminTable" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th>Title</th><th>Slug</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {articles.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td><code>/{a.slug}</code></td>
                  <td>
                    <button type="button" onClick={() => toggleStatus(a)} style={{ fontSize: '12px' }}>
                      {a.status === 'PUBLISHED' ? '✔ Published' : '○ Draft'}
                    </button>
                  </td>
                  <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  <td style={{ display: 'flex', gap: '6px' }}>
                    <button type="button" onClick={() => handleEdit(a)} style={{ fontSize: '12px' }}>Edit</button>
                    <button type="button" className="adminDangerButton" onClick={() => handleDelete(a.id)} style={{ fontSize: '12px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}

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
          <h1 id="content-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Content Management</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Edit live website copy, hero banners, brand story, FAQs, and policies.</p>
        </div>
        <Link className="adminPrimaryAction" href="/admin/journal">Manage Blog / Journal</Link>
      </div>

      <div className="adminCmsGrid">
        {sections.map(([title, section]) => (
          <Link key={section} href={`/admin/content/${section}`}>
            <p className="adminEyebrow">Content Section</p>
            <h2>{title}</h2>
            <span>Manage and edit live section content →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function ContentDetail({ section }: { section: string }) {
  const [title, setTitle] = useState('');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, startSaving] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      setLoading(true);
      const res = await getSiteContent(section);
      setTitle(res.title);
      setFormData(res.data);
      setLoading(false);
    }
    loadContent();
  }, [section]);

  const handleFieldChange = (key: string, val: any) => {
    setFormData(prev => ({ ...prev, [key]: val }));
  };

  const handleSave = () => {
    setMsg(null);
    setErr(null);
    startSaving(async () => {
      const res = await updateSiteContent(section, title, formData);
      if (res.error) {
        setErr(res.error);
      } else {
        setMsg('Section content saved to database and live on storefront!');
      }
    });
  };

  return (
    <section className="adminEditor" aria-labelledby="content-detail-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Content Section</p>
          <h1 id="content-detail-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>
            {section.replaceAll('_', ' ').toUpperCase()}
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Modify text, images, and layout text. All changes persist to the database and reflect live on the user website.
          </p>
        </div>
        <Link href="/admin/content" className="adminSecondaryAction">← Back to content list</Link>
      </div>

      {loading ? (
        <div className="adminPanel"><div className="adminEmpty"><p>Loading section fields…</p></div></div>
      ) : (
        <div className="adminPanel">
          <div className="adminPanelHeading">
            <div>
              <p className="adminEyebrow">Live CMS Editor</p>
              <h2>Edit Fields for {section.replaceAll('_', ' ')}</h2>
            </div>
            <button
              type="button"
              className="adminPrimaryButton"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving to Database…' : 'Save Changes'}
            </button>
          </div>

          {msg && <p style={{ color: 'green', padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '4px', margin: '0 0 16px' }}>{msg}</p>}
          {err && <p style={{ color: 'red', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '4px', margin: '0 0 16px' }}>{err}</p>}

          <div className="adminDiscountCheck" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 0' }}>
            <label style={{ width: '100%' }}>
              Section Display Title
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Section title..."
              />
            </label>

            <div style={{ height: '1px', background: 'var(--admin-line, #eee)', margin: '8px 0' }} />

            {Object.entries(formData).map(([fieldKey, fieldValue]) => {
              const formattedLabel = fieldKey
                .replace(/([A-Z])/g, ' $1')
                .replace(/_/g, ' ')
                .replace(/^./, str => str.toUpperCase());

              const isImageField = fieldKey.toLowerCase().includes('img') || fieldKey.toLowerCase().includes('image');
              const isLongText = fieldKey.toLowerCase().includes('copy') || fieldKey.toLowerCase().includes('text') || fieldKey.toLowerCase().includes('policy') || fieldKey.toLowerCase().includes('a') || fieldKey.toLowerCase().includes('description');

              if (isImageField) {
                return (
                  <ImageUpload
                    key={fieldKey}
                    label={formattedLabel}
                    value={String(fieldValue || '')}
                    onChange={url => handleFieldChange(fieldKey, url)}
                    placeholder="Upload image file or enter URL..."
                  />
                );
              }

              if (isLongText) {
                return (
                  <label key={fieldKey} style={{ width: '100%' }}>
                    {formattedLabel}
                    <textarea
                      value={String(fieldValue || '')}
                      onChange={e => handleFieldChange(fieldKey, e.target.value)}
                      rows={4}
                      style={{ width: '100%', fontFamily: 'inherit', fontSize: '14px', padding: '10px' }}
                    />
                  </label>
                );
              }

              return (
                <label key={fieldKey} style={{ width: '100%' }}>
                  {formattedLabel}
                  <input
                    type="text"
                    value={String(fieldValue || '')}
                    onChange={e => handleFieldChange(fieldKey, e.target.value)}
                  />
                </label>
              );
            })}

            <div style={{ marginTop: '20px', display: 'flex', gap: '12px' }}>
              <button
                type="button"
                className="adminPrimaryButton"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving to Database…' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
