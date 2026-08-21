import Dashboard from '@/components/admin/dashboard/Dashboard';
import { dashboardService } from '@/lib/admin/dashboard';

export default async function AdminDashboardPage(){
  const data = await dashboardService.getDashboard({ preset: 'today' });
  return <Dashboard data={data} />;
}
