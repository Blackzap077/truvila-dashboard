import { NavLink } from 'react-router-dom';
import {
  LayoutGrid, Users, Megaphone, Zap, BarChart2,
  Plug, CreditCard, HelpCircle, Settings,
  Eye, Settings2, ChevronDown, PanelLeftClose,
  MessageCircle, Moon, Sun,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div style={{
      width: 275,
      flexShrink: 0,
      background: '#FFFFFF',
      borderRadius: 16,
      boxShadow: '0 2px 8px rgba(0,0,0,0.082)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* sideHeader */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 24px 20px 24px',
      }}>
        {/* brandRow */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* logoBox */}
          <div style={{
            width: 32, height: 32,
            background: '#E8450A',
            borderRadius: 6,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>T</span>
          </div>
          {/* brandName */}
          <span style={{
            color: '#1A1A1A',
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 2,
          }}>TRUVILA</span>
        </div>

        {/* toggleBtn */}
        <button style={{
          width: 28, height: 28,
          background: '#F2F2F0',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
        }}>
          <PanelLeftClose size={14} color="#888888" />
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#F0F0EE', marginLeft: 0, marginRight: 0 }} />

      {/* navMain */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '12px 16px',
      }}>
        {/* n1 — Dashboard (active) */}
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            padding: '9px 12px',
            borderRadius: 8,
            background: isActive ? '#F2F2F0' : 'transparent',
            boxShadow: isActive ? 'inset 0 0 0 1px #dedede, 0 2px 4px rgba(0,0,0,0.102)' : 'none',
            textDecoration: 'none',
          })}
        >
          {({ isActive }) => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* iconBox */}
                <div style={{
                  width: 28, height: 28,
                  background: isActive ? '#E8E8E6' : '#F5F5F3',
                  borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <LayoutGrid size={14} color={isActive ? '#1A1A1A' : '#888888'} />
                </div>
                <span style={{
                  color: isActive ? '#1A1A1A' : '#666666',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                }}>Dashboard</span>
              </div>
              {isActive && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Eye size={14} color="#AAAAAA" />
                  <Settings2 size={14} color="#AAAAAA" />
                </div>
              )}
            </>
          )}
        </NavLink>

        {/* Contatos */}
        <NavLink to="/contatos" style={({ isActive }) => inactiveItemStyle(isActive)} >
          {({ isActive }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={iconBoxStyle(isActive)}><Users size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
              <span style={labelStyle(isActive)}>Contatos</span>
            </div>
          )}
        </NavLink>

        {/* Campanhas — with badge */}
        <NavLink to="/campanhas" style={({ isActive }) => ({ ...inactiveItemStyle(isActive), justifyContent: 'space-between' })}>
          {({ isActive }) => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={iconBoxStyle(isActive)}><Megaphone size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
                <span style={labelStyle(isActive)}>Campanhas</span>
              </div>
              <div style={{
                width: 20, height: 20,
                background: '#4CAF50',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, lineHeight: 1 }}>3</span>
              </div>
            </>
          )}
        </NavLink>

        {/* Automações — with chevron */}
        <NavLink to="/automacoes" style={({ isActive }) => ({ ...inactiveItemStyle(isActive), justifyContent: 'space-between' })}>
          {({ isActive }) => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={iconBoxStyle(isActive)}><Zap size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
                <span style={labelStyle(isActive)}>Automações</span>
              </div>
              <ChevronDown size={14} color="#BBBBBB" />
            </>
          )}
        </NavLink>

        {/* Relatórios — with chevron */}
        <NavLink to="/relatorios" style={({ isActive }) => ({ ...inactiveItemStyle(isActive), justifyContent: 'space-between' })}>
          {({ isActive }) => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={iconBoxStyle(isActive)}><BarChart2 size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
                <span style={labelStyle(isActive)}>Relatórios</span>
              </div>
              <ChevronDown size={14} color="#BBBBBB" />
            </>
          )}
        </NavLink>

        {/* Integrações */}
        <NavLink to="/integracoes" style={({ isActive }) => inactiveItemStyle(isActive)}>
          {({ isActive }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={iconBoxStyle(isActive)}><Plug size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
              <span style={labelStyle(isActive)}>Integrações</span>
            </div>
          )}
        </NavLink>

        {/* Financeiro — with chevron */}
        <NavLink to="/financeiro" style={({ isActive }) => ({ ...inactiveItemStyle(isActive), justifyContent: 'space-between' })}>
          {({ isActive }) => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={iconBoxStyle(isActive)}><CreditCard size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
                <span style={labelStyle(isActive)}>Financeiro</span>
              </div>
              <ChevronDown size={14} color="#BBBBBB" />
            </>
          )}
        </NavLink>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#F0F0EE' }} />

      {/* navBot */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        padding: '8px 16px',
      }}>
        {/* Suporte — with red badge */}
        <NavLink to="/suporte" style={({ isActive }) => ({ ...inactiveItemStyle(isActive), justifyContent: 'space-between' })}>
          {({ isActive }) => (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={iconBoxStyle(isActive)}><HelpCircle size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
                <span style={labelStyle(isActive)}>Suporte</span>
              </div>
              <div style={{
                width: 20, height: 20,
                background: '#FF5252',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: '#FFFFFF', fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, lineHeight: 1 }}>2</span>
              </div>
            </>
          )}
        </NavLink>

        {/* Configurações */}
        <NavLink to="/configuracoes" style={({ isActive }) => inactiveItemStyle(isActive)}>
          {({ isActive }) => (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={iconBoxStyle(isActive)}><Settings size={14} color={isActive ? '#1A1A1A' : '#888888'} /></div>
              <span style={labelStyle(isActive)}>Configurações</span>
            </div>
          )}
        </NavLink>
      </div>

      {/* spacerS — fills remaining space */}
      <div style={{ flex: 1 }} />

      {/* Divider */}
      <div style={{ height: 1, background: '#F0F0EE' }} />

      {/* footer */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        padding: '12px 20px 20px 20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* chatB */}
          <button style={{
            width: 32, height: 32,
            background: '#F2F2F0',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <MessageCircle size={16} color="#888888" />
          </button>

          {/* moonB */}
          <button style={{
            width: 32, height: 32,
            background: '#F2F2F0',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <Moon size={16} color="#888888" />
          </button>

          {/* sunB */}
          <button style={{
            width: 32, height: 32,
            background: '#1A1A1A',
            borderRadius: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <Sun size={16} color="#FFFFFF" />
          </button>

          {/* logout */}
          <div style={{ flex: 1 }} />
          <button
            onClick={handleLogout}
            title="Sair"
            style={{
              width: 32, height: 32,
              background: '#F2F2F0',
              borderRadius: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', cursor: 'pointer', padding: 0,
              color: '#888888',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Shared style helpers
function inactiveItemStyle(isActive: boolean): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '9px 12px',
    borderRadius: 8,
    background: isActive ? '#F2F2F0' : 'transparent',
    boxShadow: isActive ? 'inset 0 0 0 1px #dedede, 0 2px 4px rgba(0,0,0,0.102)' : 'none',
    textDecoration: 'none',
  };
}

function iconBoxStyle(isActive: boolean): React.CSSProperties {
  return {
    width: 28, height: 28,
    background: isActive ? '#E8E8E6' : '#F5F5F3',
    borderRadius: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  };
}

function labelStyle(isActive: boolean): React.CSSProperties {
  return {
    color: isActive ? '#1A1A1A' : '#666666',
    fontFamily: 'Inter, sans-serif',
    fontSize: 13,
    fontWeight: isActive ? 600 : 400,
  };
}
