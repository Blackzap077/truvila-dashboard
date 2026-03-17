import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { SidebarProvider } from '../context/SidebarContext';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutInner>{children}</LayoutInner>
    </SidebarProvider>
  );
}

function LayoutInner({ children }: { children: ReactNode }) {
  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      padding: 16,
      gap: 16,
      background: '#f8f8f6',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <div style={{
        flex: 1,
        background: '#fff',
        borderRadius: 16,
        overflow: 'auto',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        transition: 'all 0.25s ease',
        minWidth: 0,
      }}>
        {children}
      </div>
    </div>
  );
}
