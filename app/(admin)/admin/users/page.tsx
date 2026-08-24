import Users from '@/components/admin/auth/Users';
import { getUsers } from '@/lib/actions/users';

export default async function UsersPage() {
  const { users } = await getUsers();
  return <Users initialUsers={users || []} />;
}
