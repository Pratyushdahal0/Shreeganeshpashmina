'use client';

import { Suspense, useState, useTransition } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    startTransition(async () => {
      try {
        const res = await signIn('credentials', {
          email: email.trim(),
          password,
          redirect: false,
          callbackUrl,
        });

        if (res?.error) {
          setError('Invalid email or password.');
        } else if (res?.ok) {
          router.push(callbackUrl);
          router.refresh();
        }
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred.');
      }
    });
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        background: '#FFFFFF',
        borderRadius: '12px',
        padding: '36px 32px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
        border: '1px solid #E5E7EB',
      }}
    >
      <div style={{ marginBottom: '28px', textAlign: 'center' }}>
        <p
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#6B7280',
            marginBottom: '6px',
          }}
        >
          Shree Ganesh Pashmina
        </p>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 6px 0',
          }}
        >
          Admin Sign In
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
          Enter your credentials to access the management portal.
        </p>
      </div>

      {error && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '8px',
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#DC2626',
            fontSize: '13px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          role="alert"
        >
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        <div>
          <label
            htmlFor="email"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '6px',
            }}
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            disabled={isPending}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              outline: 'none',
              background: '#FFFFFF',
            }}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '6px',
            }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            disabled={isPending}
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: '6px',
              border: '1px solid #D1D5DB',
              fontSize: '14px',
              outline: 'none',
              background: '#FFFFFF',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '12px',
            borderRadius: '8px',
            background: '#2563EB',
            color: '#FFFFFF',
            border: 'none',
            fontWeight: 600,
            fontSize: '14px',
            cursor: isPending ? 'not-allowed' : 'pointer',
            opacity: isPending ? 0.7 : 1,
            transition: 'background 150ms ease',
          }}
        >
          {isPending ? 'Signing in...' : 'Sign in to Dashboard'}
        </button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#F4F5F7',
        fontFamily: "'Inter', system-ui, sans-serif",
        padding: '24px',
      }}
    >
      <Suspense fallback={<div>Loading sign in form...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
