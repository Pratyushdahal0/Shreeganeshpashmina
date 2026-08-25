'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import type { AdminProduct } from '@/lib/admin/products';
import { productService } from '@/lib/admin/products';
import MultiImageUpload, { type UploadedImage } from '../MultiImageUpload';

type Props = { product?: AdminProduct; categories?: { id: string; name: string }[] };

const toSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export default function ProductEditor({ product, categories = [] }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(product?.name || '');
  const [slug, setSlug] = useState(product?.slug || '');
  const [sku, setSku] = useState(product?.sku || '');
  const [categoryId, setCategoryId] = useState(
    categories.find(c => c.name.toLowerCase() === product?.category?.toLowerCase())?.id || ''
  );
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState<number | ''>(product?.price ?? 0);
  const [stock, setStock] = useState<number | ''>(product?.stock ?? 10);
  const [images, setImages] = useState<UploadedImage[]>(
    product?.imageAssets?.length
      ? product.imageAssets
      : (product?.images || []).map(url => ({ url, thumbUrl: null }))
  );
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>(
    product?.publicationStatus === 'published'
      ? 'PUBLISHED'
      : product?.publicationStatus === 'archived'
      ? 'ARCHIVED'
      : 'DRAFT'
  );

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = () => {
    setMessage(null);
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Product name is required.';
    if (!slug.trim()) newErrors.slug = 'A URL slug is required.';
    if (price === '' || isNaN(Number(price)) || Number(price) < 0) newErrors.price = 'Valid non-negative price is required.';
    if (stock === '' || isNaN(Number(stock)) || Number(stock) < 0) newErrors.stock = 'Valid stock count is required.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    startTransition(async () => {
      try {
        const payload = {
          name: name.trim(),
          slug: slug.trim(),
          sku: sku.trim(),
          description: description.trim(),
          categoryId: categoryId || undefined,
          price: Number(price),
          stock: Number(stock),
          status,
          images,
        };

        const res = product
          ? await productService.update(product.id, payload)
          : await productService.create(payload);

        if (res.ok) {
          setMessage({ type: 'success', text: res.message });
          if (!product && res.product?.id) {
            router.push(`/admin/products/${res.product.id}`);
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

  const handleStatusChange = (newStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED') => {
    setStatus(newStatus);
    if (product) {
      startTransition(async () => {
        const fn =
          newStatus === 'PUBLISHED'
            ? productService.publish
            : newStatus === 'ARCHIVED'
            ? productService.archive
            : productService.unpublish;
        const res = await fn(product.id);
        if (res.ok) {
          setMessage({ type: 'success', text: res.message });
          router.refresh();
        } else {
          setMessage({ type: 'error', text: res.message });
        }
      });
    }
  };

  const handleDelete = () => {
    if (!product || !confirm('Are you sure you want to delete this product?')) return;
    startTransition(async () => {
      const res = await productService.delete(product.id);
      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        setMessage({ type: 'error', text: res.message });
      }
    });
  };

  return (
    <section className="adminEditor" aria-labelledby="product-editor-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Catalogue / {product ? 'Edit Product' : 'Create Product'}</p>
          <h1 id="product-editor-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 600 }}>
            {product ? product.name : 'Create product'}
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Manage product details, pricing, stock levels, images, and publication status.
          </p>
        </div>
        <Link href="/admin/products" className="adminSecondaryAction" style={{ borderRadius: 'var(--radius-md)', padding: '8px 16px', height: 'fit-content' }}>
          Back to products
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
          <EditorSection title="Basic information">
            <Field label="Product title *" error={errors.name}>
              <input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!product) setSlug(toSlug(e.target.value));
                }}
                disabled={isPending}
                placeholder="e.g. Pure Handspun Ring Pashmina Shawl"
              />
            </Field>

            <Field label="URL Handle / Slug *" hint="Unique URL handle for storefront" error={errors.slug}>
              <input
                value={slug}
                onChange={(e) => setSlug(toSlug(e.target.value))}
                disabled={isPending}
                placeholder="e.g. pure-handspun-ring-pashmina-shawl"
              />
            </Field>

            <div style={{ padding: '8px 0' }}>
              <MultiImageUpload
                label="Product photos (multiple files)"
                value={images}
                onChange={setImages}
              />
            </div>

            <Field label="SKU / Product Code">
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                disabled={isPending}
                placeholder="e.g. SGP-PAS-001"
              />
            </Field>

            <Field label="Category">
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} disabled={isPending}>
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Description">
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isPending}
                placeholder="Describe material, weave density, dimensions, and care instructions..."
              />
            </Field>
          </EditorSection>

          <EditorSection title="Pricing & Inventory">
            <Field label="Regular Price (USD) *" error={errors.price}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={isPending}
              />
            </Field>
            <Field label="Initial Stock Level *" error={errors.stock}>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))}
                disabled={isPending}
              />
            </Field>
          </EditorSection>
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
            <p className="adminEyebrow">Publishing</p>
            <h2 style={{ fontSize: '18px', margin: '4px 0 12px 0' }}>Status & Visibility</h2>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: 'var(--admin-muted)', marginBottom: '6px' }}>
                Status
              </label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                disabled={isPending}
                style={{ width: '100%', borderRadius: 'var(--radius-md)', padding: '8px', border: '1px solid var(--admin-line)' }}
              >
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published (Active)</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

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
              {isPending ? 'Saving...' : product ? 'Save product' : 'Create product'}
            </button>

            {product && (
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
                Delete product
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function EditorSection({ title, children }: { title: string; children: React.ReactNode }) {
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
