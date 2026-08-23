import { rolePermissions, type AdminRole } from '@/lib/admin/auth';

const roles = Object.keys(rolePermissions) as AdminRole[];

export default function Users() {
  return (
    <section className="adminUsers" aria-labelledby="users-title">
      <div className="adminProductsIntro" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--admin-line)' }}>
        <div>
          <p className="adminEyebrow">Security</p>
          <h1 id="users-title" style={{ fontSize: '24px', margin: '4px 0 8px 0', fontWeight: 700 }}>Users & permissions</h1>
          <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: '14px' }}>Server-verified identities, role-based access, and audited permission changes.</p>
        </div>
        <button className="adminPrimaryAction" type="button" disabled>Invite user</button>
      </div>

      <div className="adminNotice">
        <div>
          <strong>User management is not connected</strong>
          <span>No identity provider or user store is configured. Users, invitations, role assignments, and audit events cannot be created or changed.</span>
        </div>
        <span className="adminNoticeTag">Authentication pending</span>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Role access</p><h2>Permission matrix</h2></div>
          <span>Architecture ready</span>
        </div>
        <div className="adminRoleGrid" style={{ marginTop: '16px' }}>
          {roles.map(role => (
            <article key={role}>
              <strong>{role}</strong>
              <span>{rolePermissions[role].length} granular permissions</span>
            </article>
          ))}
        </div>
      </div>

      <div className="adminPanel">
        <div className="adminPanelHeading">
          <div><p className="adminEyebrow">Audit trail</p><h2>Important access changes</h2></div>
          <span>Unavailable</span>
        </div>
        <div className="adminEmpty">
          <span aria-hidden="true">○</span>
          <p><strong>No audit events available</strong>Role and permission changes must be recorded server-side with actor, target, action, timestamp, and metadata.</p>
        </div>
      </div>
    </section>
  );
}
