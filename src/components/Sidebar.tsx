import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Users, Megaphone, Zap, BarChart2,
  Plug, CreditCard, HelpCircle, Settings,
  Eye, Settings2, ChevronDown, PanelLeftClose, PanelLeftOpen,
  MessageCircle, Moon, Sun, Send, Layers,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '../context/SidebarContext';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { collapsed, toggle } = useSidebar();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const w = collapsed ? 64 : 275;

  return (
    <div style={{
      width: w,
      flexShrink: 0,
      background: '#FFFFFF',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.082)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.25s ease',
    }}>

      {/* sideHeader */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        padding: collapsed ? '20px 0' : '24px 24px 20px 24px',
        transition: 'padding 0.25s ease',
      }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, background: '#E8450A', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>T</span>
            </div>
            <span style={{ color: '#1A1A1A', fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>TRUVILA</span>
          </div>
        )}

        {collapsed && (
          <div style={{
            width: 32, height: 32, background: '#E8450A', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>T</span>
          </div>
        )}

        {!collapsed && (
          <button onClick={toggle} style={{
            width: 28, height: 28, background: '#F2F2F0', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
          }}>
            <PanelLeftClose size={14} color="#888888" />
          </button>
        )}
      </div>

      {/* Collapsed: expand button below logo */}
      {collapsed && (
        <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
          <button onClick={toggle} style={{
            width: 28, height: 28, background: '#F2F2F0', borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <PanelLeftOpen size={14} color="#888888" />
          </button>
        </div>
      )}

      {/* Divider */}
      <div style={{ height: 1, background: '#F0F0EE' }} />

      {/* navMain */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        padding: collapsed ? '12px 8px' : '12px 16px',
        transition: 'padding 0.25s ease',
      }}>
        <NavItem to="/" end collapsed={collapsed}
          icon={<LayoutGrid size={14} />}
          label="Dashboard"
          rightExpanded={<><Eye size={14} color="#AAAAAA" /><Settings2 size={14} color="#AAAAAA" /></>}
          showRightWhenActive
        />
        <NavItem to="/contatos" collapsed={collapsed} icon={<Users size={14} />} label="Contatos" />
        <NavItem to="/campanhas" collapsed={collapsed} icon={<Megaphone size={14} />} label="Campanhas"
          rightExpanded={
            <div style={{ width: 20, height: 20, background: '#4CAF50', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>3</span>
            </div>
          }
        />
        <NavItem to="/disparos" collapsed={collapsed} icon={<Send size={14} />} label="Disparos" />
        <NavItem to="/automacoes" collapsed={collapsed} icon={<Zap size={14} />} label="Automações"
          rightExpanded={<ChevronDown size={14} color="#BBBBBB" />}
        />
        <NavItem to="/relatorios" collapsed={collapsed} icon={<BarChart2 size={14} />} label="Relatórios"
          rightExpanded={<ChevronDown size={14} color="#BBBBBB" />}
        />
        <NavItem to="/integracoes" collapsed={collapsed} icon={<Plug size={14} />} label="Integrações" />
        <NavItem to="/financeiro" collapsed={collapsed} icon={<CreditCard size={14} />} label="Financeiro"
          rightExpanded={<ChevronDown size={14} color="#BBBBBB" />}
        />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#F0F0EE' }} />

      {/* navBot */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 2,
        padding: collapsed ? '8px 8px' : '8px 16px',
        transition: 'padding 0.25s ease',
      }}>
        <NavItem to="/suporte" collapsed={collapsed} icon={<HelpCircle size={14} />} label="Suporte"
          rightExpanded={
            <div style={{ width: 20, height: 20, background: '#FF5252', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, fontFamily: 'Inter, sans-serif', lineHeight: 1 }}>2</span>
            </div>
          }
        />
        <NavItem to="/configuracoes" collapsed={collapsed} icon={<Settings size={14} />} label="Configurações" />
        <NavItem to="/componentes" collapsed={collapsed} icon={<Layers size={14} />} label="Componentes" />
      </div>

      {/* spacer */}
      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={{ height: 1, background: '#F0F0EE' }} />

      {/* footer */}
      <div style={{
        display: 'flex',
        flexDirection: collapsed ? 'column' : 'row',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        gap: 8,
        padding: collapsed ? '12px 0 20px' : '12px 20px 20px 20px',
        transition: 'padding 0.25s ease',
      }}>
        <button style={{ width: 32, height: 32, background: '#F2F2F0', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', padding: 0 }}>
          <MessageCircle size={16} color="#888888" />
        </button>
        <button style={{ width: 32, height: 32, background: '#F2F2F0', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Moon size={16} color="#888888" />
        </button>
        <button style={{ width: 32, height: 32, background: '#1A1A1A', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', padding: 0 }}>
          <Sun size={16} color="#FFFFFF" />
        </button>
        {!collapsed && <div style={{ flex: 1 }} />}
        <button onClick={handleLogout} title="Sair" style={{ width: 32, height: 32, background: '#F2F2F0', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// ---- NavItem component ----
function NavItem({
  to, end, collapsed, icon, label, rightExpanded, showRightWhenActive,
}: {
  to: string;
  end?: boolean;
  collapsed: boolean;
  icon: React.ReactElement;
  label: string;
  rightExpanded?: React.ReactNode;
  showRightWhenActive?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={collapsed ? label : undefined}
      style={({ isActive }) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        gap: 10,
        padding: collapsed ? '9px 0' : '9px 12px',
        borderRadius: 8,
        background: isActive ? '#F2F2F0' : 'transparent',
        boxShadow: isActive ? 'inset 0 0 0 1px #dedede, 0 2px 4px rgba(0,0,0,0.102)' : 'none',
        textDecoration: 'none',
        transition: 'background 0.15s, box-shadow 0.15s',
        overflow: 'hidden',
      })}
    >
      {({ isActive }) => (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10 }}>
            <div style={{
              width: 28, height: 28,
              background: isActive ? '#E8E8E6' : '#F5F5F3',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              color: isActive ? '#1A1A1A' : '#888888',
            }}>
              {icon}
            </div>
            {!collapsed && (
              <span style={{
                color: isActive ? '#1A1A1A' : '#666666',
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                whiteSpace: 'nowrap',
              }}>{label}</span>
            )}
          </div>
          {!collapsed && rightExpanded && (!showRightWhenActive || isActive) && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {rightExpanded}
            </div>
          )}
        </>
      )}
    </NavLink>
  );
}

