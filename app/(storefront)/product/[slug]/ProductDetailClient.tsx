'use client';
import Image from 'next/image';
import { currencies, rates } from '@/lib/data';
import { useCart } from '@/components/CartContext';
import { useCurrency } from '@/components/CurrencyContext';
import { useState, useTransition } from 'react';
import { Icon } from '@/components/Icons';
import { whatsappUrl } from '@/lib/whatsapp';
import { submitReview } from '@/lib/actions/reviews';

type ProductProps = {
  id: string;
  slug: string;
  name: string;
  category: string;
  material: string;
  price: number;
  image: string;
  description: string;
  images: string[];
  thumbs: string[];
};

type ReviewItem = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: Date;
};

const STARS = ['★', '★', '★', '★', '★'];

export default function ProductDetailClient({
  product: p,
  initialReviews,
}: {
  product: ProductProps;
  initialReviews: ReviewItem[];
}) {
  const { add } = useCart();
  const { currency } = useCurrency();
  const [activeImage, setActiveImage] = useState(p.image);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  // Reviews state
  const [reviews, setReviews] = useState(initialReviews);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [formMsg, setFormMsg] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const c = currencies[currency];
  const price = Math.round(p.price * rates[currency]);
  const msg = `Hello Shree Ganesh Pashmina, I am interested in ${p.name}. Please share availability, shipping and payment details.`;

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormMsg(null);
    setFormErr(null);

    startTransition(async () => {
      const res = await submitReview({
        productId: p.id,
        authorName,
        authorEmail,
        rating,
        comment,
      });

      if (res.error) {
        setFormErr(res.error);
      } else {
        setFormMsg('Thank you! Your review has been submitted for moderation.');
        setAuthorName('');
        setAuthorEmail('');
        setComment('');
        setRating(5);
      }
    });
  };

  return (
    <main className="productPage">
      <div className="container productDetail">
        <div className="galleryStack">
          <div 
            className="galleryMain" 
            onClick={() => setLightboxOpen(true)}
            title="Click to open photo detail view"
          >
            <Image
              src={activeImage}
              alt={p.name}
              fill
              sizes="(max-width:720px) 92vw, 520px"
              priority
              style={{ objectFit: 'cover' }}
              onError={() => setActiveImage('/images/product-shawl.jpg')}
            />
          </div>
          {p.images.length > 1 && (
            <div className="galleryThumbs">
              {p.images.map((imgUrl, i) => (
                <button
                  key={imgUrl}
                  type="button"
                  className={activeImage === imgUrl ? 'isActive' : undefined}
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <Image
                    src={p.thumbs[i] || imgUrl}
                    alt=""
                    fill
                    sizes="72px"
                    loading="lazy"
                    style={{ objectFit: 'cover' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox Modal */}
        {lightboxOpen && (
          <div className="lightboxBackdrop" onClick={() => setLightboxOpen(false)}>
            <div className="lightboxContainer" onClick={e => e.stopPropagation()}>
              <button 
                type="button" 
                className="lightboxClose" 
                onClick={() => setLightboxOpen(false)}
                aria-label="Close photo detail view"
              >
                ✕
              </button>
              <div className="lightboxImageContainer">
                <img src={activeImage} alt={p.name} />
              </div>
              <div style={{ color: '#fff', marginTop: '16px', fontSize: '14px', letterSpacing: '.05em' }}>
                {p.name}
              </div>
            </div>
          </div>
        )}

        <div className="detailSticky">
          <div className="eyebrow">{p.category} · {p.material}</div>
          <h1 className="detailTitle">{p.name}</h1>
          <div className="detailPrice">
            {c.symbol}{price.toLocaleString()} <span className="muted">{currency}</span>
          </div>
          <p className="detailText">{p.description}</p>
          
          <div className="detailActions">
            <button className="btn dark" onClick={() => add({ id: p.id, slug: p.slug, name: p.name, category: p.category, material: p.material, price: p.price, image: p.image, description: p.description })}>
              Add to bag <Icon name="bag" />
            </button>
            <a className="btn" href={whatsappUrl(msg)} target="_blank" rel="noreferrer">
              Ask on WhatsApp <Icon name="whatsapp" />
            </a>
          </div>

          <div className="detailFacts">
            <div className="fact"><span>Material</span><strong>{p.material}</strong></div>
            <div className="fact"><span>Origin</span><strong>Kathmandu, Nepal</strong></div>
            <div className="fact"><span>Shipping</span><strong>Worldwide</strong></div>
            <div className="fact"><span>Payment</span><strong>Confirmed via WhatsApp</strong></div>
          </div>

          {/* Customer Reviews Section */}
          <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #eee' }}>
            <h3 className="serif" style={{ fontSize: '24px', marginBottom: '20px' }}>Customer Reviews</h3>

            {reviews.length === 0 ? (
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '30px' }}>No reviews yet. Be the first to review this product!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ padding: '15px', background: '#f9f9f9', borderRadius: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                      <strong>{r.authorName}</strong>
                      <span style={{ color: '#f59e0b' }}>{'★'.repeat(r.rating)}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '14px', color: '#444' }}>{r.comment}</p>
                    <small style={{ color: '#999', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))}
              </div>
            )}

            {/* Write a review form */}
            <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', background: '#fff', padding: '20px', border: '1px solid #eee', borderRadius: '4px' }}>
              <h4 style={{ margin: 0, fontSize: '16px' }}>Write a Review</h4>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Your name *"
                  required
                  value={authorName}
                  onChange={e => setAuthorName(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
                <input
                  type="email"
                  placeholder="Your email *"
                  required
                  value={authorEmail}
                  onChange={e => setAuthorEmail(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <label style={{ fontSize: '14px' }}>Rating:</label>
                <select
                  value={rating}
                  onChange={e => setRating(Number(e.target.value))}
                  style={{ padding: '6px 12px', border: '1px solid #ccc', borderRadius: '4px' }}
                >
                  <option value={5}>5 Stars - Excellent</option>
                  <option value={4}>4 Stars - Good</option>
                  <option value={3}>3 Stars - Average</option>
                  <option value={2}>2 Stars - Poor</option>
                  <option value={1}>1 Star - Terrible</option>
                </select>
              </div>

              <textarea
                placeholder="Write your review here... *"
                required
                rows={3}
                value={comment}
                onChange={e => setComment(e.target.value)}
                style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontFamily: 'inherit' }}
              />

              <button
                type="submit"
                className="btn dark"
                disabled={isPending}
                style={{ alignSelf: 'flex-start', padding: '8px 20px', fontSize: '14px' }}
              >
                {isPending ? 'Submitting...' : 'Submit Review'}
              </button>

              {formMsg && <p style={{ color: 'green', fontSize: '14px', margin: 0 }}>{formMsg}</p>}
              {formErr && <p style={{ color: 'red', fontSize: '14px', margin: 0 }}>{formErr}</p>}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
