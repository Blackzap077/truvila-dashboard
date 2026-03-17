import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Megaphone, Zap, BarChart2,
  Plug, CreditCard, HelpCircle, Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const navMain = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Contatos', icon: Users, to: '/contatos' },
  { label: 'Campanhas', icon: Megaphone, to: '/campanhas', badge: 3 },
  { label: 'Automações', icon: Zap, to: '/automacoes' },
  { label: 'Relatórios', icon: BarChart2, to: '/relatorios' },
  { label: 'Integrações', icon: Plug, to: '/integracoes' },
  { label: 'Financeiro', icon: CreditCard, to: '/financeiro' },
];

const navBottom = [
  { label: 'Suporte', icon: HelpCircle, to: '/suporte', badge: 2, badgeColor: '#DC2626' },
  { label: 'Configurações', icon: Settings, to: '/configuracoes' },
];

function NavItem({
  label, icon: Icon, to, badge, badgeColor,
}: {
  label: string; icon: any; to: string;
  badge?: number; badgeColor?: string;
}) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      style={({ isActive }) => ({
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 10,
        fontSize: 13.5, fontWeight: isActive ? 600 : 500,
        color: isActive ? '#E8450A' : '#555',
        background: isActive ? '#FFF4F0' : 'transparent',
        boxShadow: isActive ? '0 0 0 1.5px rgba(232,69,10,0.2)' : 'none',
        textDecoration: 'none',
        transition: 'all 0.15s',
        position: 'relative',
      })}
    >
      <Icon size={17} strokeWidth={isActiveCheck(to) ? 2.2 : 1.8} />
      <span style={{ flex: 1 }}>{label}</span>
      {badge && (
        <span style={{
          background: badgeColor || '#E8450A',
          color: '#fff', borderRadius: 20,
          fontSize: 10, fontWeight: 700,
          padding: '1px 6px', minWidth: 18, textAlign: 'center',
        }}>{badge}</span>
      )}
    </NavLink>
  );
}

function isActiveCheck(to: string) {
  return window.location.pathname === to || (to === '/' && window.location.pathname === '/');
}

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{
      width: 260,
      flexShrink: 0,
      background: '#fff',
      borderRadius: 16,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 24px rgba(0,0,0,0.04)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px 16px',
      gap: 0,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 20px', borderBottom: '1px solid #F3F3F3' }}>
        <div style={{
          width: 32, height: 32, background: '#E8450A', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0,
        }}>T</div>
        <span style={{ fontWeight: 700, fontSize: 15, color: '#111', letterSpacing: -0.3 }}>TRUVILA</span>
      </div>

      {/* Main nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 16, flex: 1 }}>
        {navMain.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Bottom nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 8, borderTop: '1px solid #F3F3F3', paddingBottom: 12 }}>
        {navBottom.map(item => (
          <NavItem key={item.to} {...item} />
        ))}
      </nav>

      {/* Footer: user info + logout */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 8px 0', borderTop: '1px solid #F3F3F3',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%', background: '#E8450A',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0,
        }}>
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.name || 'Usuário'}
          </div>
          <div style={{ fontSize: 11, color: '#999', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {user?.email}
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Sair"
          style={{ background: 'none', padding: 4, color: '#bbb', borderRadius: 6, display: 'flex' }}
        >
          <LogOut size={15} />
        </button>
      </div>
    </div>
  );
}
