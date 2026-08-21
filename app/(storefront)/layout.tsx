import './globals.css';
import Footer from '@/components/Footer';
import StorefrontShell from '@/components/StorefrontShell';

export default function StorefrontLayout({children}:{children:React.ReactNode}){
  return <StorefrontShell>{children}<Footer/></StorefrontShell>;
}
