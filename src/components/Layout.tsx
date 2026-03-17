import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }: { children: ReactNode }) {
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
      }}>
        {children}
      </div>
    </div>
  );
}
