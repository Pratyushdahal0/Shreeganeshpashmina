import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '60px 20px' }}>
      <h1 className="serif" style={{ fontSize: '64px', fontWeight: 400, margin: '0 0 16px' }}>404 - Page Not Found</h1>
      <p style={{ color: '#666', fontSize: '16px', maxWidth: '480px', marginBottom: '30px', lineHeight: 1.6 }}>
        The page or product you are looking for could not be found or has been moved.
      </p>
      <Link href="/" className="btn dark">
        Return to Homepage
      </Link>
    </main>
  );
}
