'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserRole, deleteUser } from '@/lib/actions/users';

type Props = { initialUsers: any[] };

export default function Users({ initialUsers }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleRoleChange = (userId: string, newRole: string) => {
    setMessage(null);
    startTransition(async () => {
      const res = await updateUserRole(userId, newRole as any);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'User role updated successfully.' });
        router.refresh();
      }
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!confirm('Are you sure you want to remove this user?')) return;
    setMessage(null);
    startTransition(async () => {
      const res = await deleteUser(userId);
      if (res.error) {
        setMessage({ type: 'error', text: res.error });
      } else {
        setMessage({ type: 'success', text: 'User removed.' });
        router.refresh();
      }
    });
  };

  return (
    <section className="adminUsers" aria-labelledby="users-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Security</p>
          <h1 id="users-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>
            Users & Permissions
          </h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>
            Manage staff accounts, assign roles, and control access permissions.
          </p>
        </div>
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

      <div
        className="adminProductTableWrap"
        style={{
          marginTop: '20px',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
          background: 'var(--admin-panel)',
        }}
      >
        <table className="adminTable">
          <thead style={{ background: 'var(--admin-bg)' }}>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {initialUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong style={{ color: 'var(--admin-ink)' }}>{user.name || 'Admin User'}</strong>
                </td>
                <td>
                  <span style={{ color: 'var(--admin-muted)' }}>{user.email}</span>
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={isPending}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600,
                      background: user.role === 'ADMIN' ? '#EFF6FF' : user.role === 'MANAGER' ? '#FEF3C7' : '#F3F4F6',
                      color: user.role === 'ADMIN' ? '#1D4ED8' : user.role === 'MANAGER' ? '#92400E' : '#374151',
                      border: '1px solid var(--admin-line)',
                    }}
                  >
                    <option value="USER">USER</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={isPending}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#DC2626',
                      fontWeight: 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {initialUsers.length === 0 && (
          <div className="adminEmpty" style={{ background: 'var(--admin-panel)', padding: '40px', textAlign: 'center' }}>
            <span aria-hidden="true" style={{ fontSize: '32px', color: 'var(--admin-line)' }}>
              ○
            </span>
            <p style={{ marginTop: '16px' }}>
              <strong>No user accounts found</strong>
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
