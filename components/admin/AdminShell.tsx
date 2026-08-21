import type { ReactNode } from 'react';
import AdminBreadcrumbs from './AdminBreadcrumbs';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

export default function AdminShell({children}:{children:ReactNode}){
  return <div className="adminShell"><AdminSidebar/><div className="adminContent"><AdminHeader/><main className="adminMain"><AdminBreadcrumbs/>{children}</main></div></div>;
}
