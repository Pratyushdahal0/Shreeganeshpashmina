'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { Collection } from '@/lib/admin/collections';
import { collectionService } from '@/lib/admin/collections';

type Props = { collection?: Collection };

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function CollectionEditor({ collection }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(collection?.name || '');
  const [slug, setSlug] = useState(collection?.slug || '');
  const [description, setDescription] = useState(collection?.description || '');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    setMessage(null);
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Collection name is required.';
    if (!slug.trim()) newErrors.slug = 'A URL slug is required.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    startTransition(async () => {
      try {
        const payload = {
          name: name.trim(),
          slug: slug.trim(),
          description: description.trim(),
        };

        const res = collection
          ? await collectionService.update(collection.id, payload)
          : await collectionService.create(payload);

        if (res.ok) {
          setMessage({ type: 'success', text: res.message });
          if (!collection && res.collection?.slug) {
            router.push(`/admin/collections/${res.collection.slug}`);
          }
          router.refresh();
        } else {
          setMessage({ type: 'error', text: res.message });
        }
      } catch (err: any) {
        setMessage({ type: 'error', text: err.message || 'An unexpected error occurred.' });
      }
    });
  };

  const handleDelete = () => {
    if (!collection || !confirm('Are you sure you want to delete this collection?')) return;
    startTransition(async () => {
      const res = await collectionService.delete(collection.id);
      if (res.ok) {
        router.push('/admin/collections');
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <section className="adminEditor" aria-labelledby="collection-editor-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Collections / {collection ? 'Edit' : 'Create'}</p>
          <h1 id="collection-editor-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 600 }}>
            {collection ? collection.name : 'Create collection'}
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Organize products into categories and collections.
          </p>
        </div>
        <Link href="/admin/collections" className="adminSecondaryAction" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px', height: 'fit-content' }}>
          Back to collections
        </Link>
      </div>

      {message && (
        <div
          style={{
            margin: '16px 0',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            background: message.type === 'success' ? '#ECFDF5' : '#FEF2F2',
            border: `1px solid ${message.type === 'success' ? '#A7F3D0' : '#FCA5A5'}`,
            color: message.type === 'success' ? '#065F46' : '#991B1B',
            fontSize: '14px',
            fontWeight: 500,
          }}
          role="status"
        >
          {message.text}
        </div>
      )}

      <div className="adminEditorLayout" style={{ marginTop: '20px' }}>
        <div className="adminEditorFields">
          <Section title="Collection Details">
            <Field label="Collection Name *" error={errors.name}>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!collection) setSlug(toSlug(e.target.value));
                }}
                disabled={isPending}
                placeholder="e.g. Ring Pashmina"
              />
            </Field>
            <Field label="URL Slug *" hint="Unique URL handle" error={errors.slug}>
              <input
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                disabled={isPending}
                placeholder="e.g. ring-pashmina"
              />
            </Field>
            <Field label="Description">
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                placeholder="Category summary for storefront browsing..."
              />
            </Field>
          </Section>
        </div>

        <aside className="adminEditorAside">
          <div
            style={{
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              padding: '20px',
              background: 'var(--admin-panel)',
              border: '1px solid var(--admin-line)',
            }}
          >
            <p className="adminEyebrow">Save Collection</p>
            <h2 style={{ fontSize: '18px', margin: '4px 0 12px 0' }}>{collection ? 'Update Category' : 'Create Category'}</h2>

            <button
              type="button"
              className="adminPrimaryButton"
              onClick={handleSave}
              disabled={isPending}
              style={{
                width: '100%',
                borderRadius: 'var(--radius-md)',
                padding: '10px 16px',
                fontWeight: 600,
                fontSize: '13px',
                background: '#2563EB',
                color: 'white',
                border: 'none',
                cursor: isPending ? 'not-allowed' : 'pointer',
                opacity: isPending ? 0.7 : 1,
              }}
            >
              {isPending ? 'Saving...' : collection ? 'Save changes' : 'Create collection'}
            </button>

            {collection && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                style={{
                  width: '100%',
                  marginTop: '12px',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 16px',
                  fontWeight: 500,
                  fontSize: '13px',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                }}
              >
                Delete collection
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="adminEditorSection" style={{ borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-sm)', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '16px', fontWeight: 600, borderBottom: '1px solid var(--admin-line)', paddingBottom: '16px', marginBottom: '16px' }}>
        {title}
      </h2>
      <div className="adminFieldGrid">{children}</div>
    </section>
  );
}

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="adminField">
      <span>{label}</span>
      {children}
      {error ? <small className="adminFieldError">{error}</small> : hint && <small style={{ color: 'var(--admin-muted)' }}>{hint}</small>}
    </label>
  );
}
