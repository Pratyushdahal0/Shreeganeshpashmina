import { getUsers, updateUserRole, deleteUser } from '@/lib/actions/users';

export type AdminRole = 'USER' | 'MANAGER' | 'ADMIN';

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
};

export type UserMutationResult =
  | { ok: true; message: string; user?: any }
  | { ok: false; reason: string; message: string };

function transformUser(u: any): AdminUser {
  return {
    id: u.id,
    name: u.name || 'Admin User',
    email: u.email || 'N/A',
    role: u.role || 'USER',
    active: true,
    createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
  };
}

export const userService = {
  async list(): Promise<{ state: 'live' | 'unavailable'; users: AdminUser[] }> {
    const { users, error } = await getUsers();
    if (error || !users) {
      return { state: 'unavailable', users: [] };
    }
    return { state: 'live', users: users.map(transformUser) };
  },

  async setRole(userId: string, role: AdminRole): Promise<UserMutationResult> {
    const { user, error } = await updateUserRole(userId, role as any);
    if (error || !user) {
      return { ok: false, reason: 'error', message: error || 'Failed to set user role' };
    }
    return { ok: true, message: `User role updated to ${role}` };
  },

  async delete(userId: string): Promise<UserMutationResult> {
    const { error } = await deleteUser(userId);
    if (error) {
      return { ok: false, reason: 'error', message: error };
    }
    return { ok: true, message: 'User removed successfully' };
  },
};
