import {
  Bell, Search, Wallet, Award, Users, TrendingUp, TrendingDown,
  ChevronDown, Send, Download, RefreshCw, CheckCircle2, XCircle,
  Clock, AlertCircle, Hash, FileText, Zap, ArrowLeft, List,
  Radio, Save, CheckSquare, Square, Upload,
  LayoutGrid, Megaphone, BarChart2, Plug, CreditCard, HelpCircle,
  Settings, PanelLeftClose, MessageCircle, Moon, Sun,
} from 'lucide-react';
import Layout from '../components/Layout';

// ─── Helpers visuais ──────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#E8450A', textTransform: 'uppercase', letterSpacing: 1.2 }}>
          {title}
        </span>
        <div style={{ flex: 1, height: 1, background: '#F0F0EE' }} />
      </div>
      {children}
    </div>
  );
}

function Row({ label, children, col }: { label: string; children: React.ReactNode; col?: boolean }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>
        {label}
      </div>
      <div style={{
        display: 'flex',
        flexDirection: col ? 'column' : 'row',
        gap: 12,
        flexWrap: 'wrap',
        alignItems: col ? 'flex-start' : 'center',
      }}>
        {children}
      </div>
    </div>
  );
}

function Card({ children, w }: { children: React.ReactNode; w?: number | string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12,
      border: '1.5px solid #F0F0EE', padding: '20px 24px',
      width: w ?? 'auto',
    }}>
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 10, color: '#BBBBBB', fontFamily: 'Inter, sans-serif', marginTop: 6, textAlign: 'center' }}>
      {children}
    </div>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Componentes() {
  const inp: React.CSSProperties = {
    padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid #EBEBEB', fontSize: 13, color: '#1A1A1A',
    background: '#FAFAFA', outline: 'none', fontFamily: 'Inter, sans-serif',
    width: '100%', boxSizing: 'border-box',
  };

  return (
    <Layout>
      {/* Topbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px', borderRadius: '16px 16px 0 0',
        borderBottom: '1px solid #E8E8E8', background: '#fff', flexShrink: 0,
      }}>
        <span style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter' }}>
          Componentes
        </span>
        <span style={{ fontSize: 13, color: '#AAAAAA', fontFamily: 'Inter' }}>
          Biblioteca visual completa da Truvila
        </span>
      </div>

      {/* Conteúdo */}
      <div style={{ padding: '32px', fontFamily: 'Inter, sans-serif', maxWidth: 1100 }}>

        {/* ─── CORES ────────────────────────────────────────────────────────── */}
        <Section title="Paleta de Cores">
          <Row label="Primárias e Estado">
            {[
              { hex: '#E8450A', name: 'Primary' },
              { hex: '#FF6B35', name: 'Primary Light' },
              { hex: '#F5C4B8', name: 'Primary Tint' },
              { hex: '#FFF4F0', name: 'Primary Bg' },
              { hex: '#4CAF50', name: 'Success' },
              { hex: '#E8F5E9', name: 'Success Bg' },
              { hex: '#FF5252', name: 'Danger' },
              { hex: '#FFEBEE', name: 'Danger Bg' },
              { hex: '#2060C0', name: 'Info' },
              { hex: '#F44336', name: 'Error' },
              { hex: '#FF9800', name: 'Warning' },
            ].map(c => (
              <div key={c.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: c.hex, border: '1px solid rgba(0,0,0,0.06)' }} />
                <span style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>{c.name}</span>
                <span style={{ fontSize: 10, color: '#BBBBBB', fontFamily: 'monospace' }}>{c.hex}</span>
              </div>
            ))}
          </Row>
          <Row label="Neutros">
            {[
              { hex: '#1A1A1A', name: 'Text Primary' },
              { hex: '#555555', name: 'Text Secondary' },
              { hex: '#666666', name: 'Text Body' },
              { hex: '#888888', name: 'Text Muted' },
              { hex: '#AAAAAA', name: 'Placeholder' },
              { hex: '#BBBBBB', name: 'Disabled' },
              { hex: '#DEDEDE', name: 'Border Strong' },
              { hex: '#E8E8E8', name: 'Border Med' },
              { hex: '#EBEBEB', name: 'Border Soft' },
              { hex: '#EFEFED', name: 'Border Subtle' },
              { hex: '#F0F0EE', name: 'Divider' },
              { hex: '#F2F2F0', name: 'Nav Active Bg' },
              { hex: '#F5F5F3', name: 'Nav Icon Bg' },
              { hex: '#F8F8F6', name: 'Page Bg' },
              { hex: '#FAFAFA', name: 'Card Alt Bg' },
              { hex: '#FFFFFF', name: 'White' },
            ].map(c => (
              <div key={c.hex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: c.hex, border: '1px solid #E8E8E8' }} />
                <span style={{ fontSize: 10, color: '#888', textAlign: 'center' }}>{c.name}</span>
                <span style={{ fontSize: 10, color: '#BBBBBB', fontFamily: 'monospace' }}>{c.hex}</span>
              </div>
            ))}
          </Row>
          <Row label="Gradientes">
            {[
              { bg: 'linear-gradient(157deg, #ff917b 0%, #f9755b 17%, #ff5c3c 31%, #ff4e2b 100%)', name: 'Gradient Topbar CTA' },
              { bg: 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)', name: 'Gradient Button' },
              { bg: 'linear-gradient(90deg, #E8450A, #FF6B35)', name: 'Gradient Progress' },
              { bg: 'linear-gradient(90deg, #4CAF50, #81C784)', name: 'Gradient Progress Green' },
            ].map(c => (
              <div key={c.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 120, height: 48, borderRadius: 10, background: c.bg }} />
                <span style={{ fontSize: 10, color: '#888', textAlign: 'center', maxWidth: 120 }}>{c.name}</span>
              </div>
            ))}
          </Row>
        </Section>

        {/* ─── TIPOGRAFIA ───────────────────────────────────────────────────── */}
        <Section title="Tipografia">
          <Row label="Hierarquia de texto" col>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>Título de página — 22px 700</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A' }}>Título de seção — 20px 700</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>Título de campanha — 18px 700</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>Título de card — 15px 700</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Label de campo — 14px 600</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>Botão / Nav ativo — 13px 600</div>
            <div style={{ fontSize: 13, fontWeight: 400, color: '#666666' }}>Corpo de texto / Nav inativo — 13px 400</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#555555' }}>Label uppercase — 12px 600</div>
            <div style={{ fontSize: 12, fontWeight: 400, color: '#888888' }}>Descrição / meta — 12px 400</div>
            <div style={{ fontSize: 11, fontWeight: 400, color: '#888888' }}>Timestamp / detalhe — 11px 400</div>
            <div style={{ fontSize: 10, fontWeight: 600, color: '#666666', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              Micro label uppercase — 10px 600
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>32px 700 — Valor grande</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>28px 700 — Valor médio</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>22px 700 — Valor stat card</div>
          </Row>
        </Section>

        {/* ─── BOTÕES ───────────────────────────────────────────────────────── */}
        <Section title="Botões">
          <Row label="Primários">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '11px 28px', borderRadius: 10, background: 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={15} /> Disparar SMS
              </button>
              <Label>Primário com ícone</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '10px 20px', borderRadius: 10, background: 'linear-gradient(157deg, #ff917b 0%, #f9755b 17%, #ff5c3c 31%, #ff4e2b 100%)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                Nova Campanha
              </button>
              <Label>Topbar CTA</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '10px 20px', borderRadius: 10, background: '#4CAF50', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={14} /> ✓ Salvo!
              </button>
              <Label>Sucesso</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button disabled style={{ padding: '11px 28px', borderRadius: 10, background: '#E0E0E0', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={15} /> Disparar SMS
              </button>
              <Label>Desabilitado</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '11px 22px', borderRadius: 10, background: '#F44336', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <XCircle size={14} /> Parar
              </button>
              <Label>Destrutivo</Label>
            </div>
          </Row>

          <Row label="Secundários / Outline">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '9px 16px', borderRadius: 8, border: '1.5px solid #E0E0E0', background: '#FAFAFA', fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Download size={14} /> Exportar CSV
              </button>
              <Label>Outline padrão</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '9px 14px', borderRadius: 8, border: '1.5px solid #E0E0E0', background: '#FAFAFA', fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={13} /> Atualizar
              </button>
              <Label>Outline com ícone</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '7px 12px', borderRadius: 8, border: '1.5px solid #E0E0E0', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#555', fontWeight: 600 }}>
                <ArrowLeft size={14} /> Voltar
              </button>
              <Label>Voltar</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ padding: '11px 22px', borderRadius: 10, border: '1.5px solid #E0E0E0', background: '#FAFAFA', fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Upload size={14} /> Novo disparo
              </button>
              <Label>Novo disparo (pós-concluído)</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <button style={{ width: '100%', padding: '10px 0', borderRadius: 20, border: '1px solid #E0E0E0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 160 }}>
                <span style={{ fontSize: 12, color: '#555555' }}>Ver tudo</span>
              </button>
              <Label>Ver tudo (pill)</Label>
            </div>
          </Row>

          <Row label="Pills de filtro / período">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 20, border: '1px solid #E0E0E0', padding: '6px 12px', cursor: 'pointer' }}>
                <span style={{ fontSize: 12, color: '#666666' }}>Último mês</span>
                <ChevronDown size={12} color="#888888" strokeWidth={1.8} />
              </div>
              <Label>Filtro de período</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderRadius: 20, border: '1px solid #E0E0E0', padding: '6px 12px', cursor: 'pointer' }}>
                <span style={{ fontSize: 12, color: '#666666' }}>Últimos 7 dias</span>
                <ChevronDown size={12} color="#888888" strokeWidth={1.8} />
              </div>
              <Label>Filtro de período</Label>
            </div>
          </Row>

          <Row label="Botões de ação — sidebar footer">
            {[
              { icon: <MessageCircle size={16} color="#888888" />, bg: '#F2F2F0', label: 'Chat' },
              { icon: <Moon size={16} color="#888888" />, bg: '#F2F2F0', label: 'Moon' },
              { icon: <Sun size={16} color="#FFFFFF" />, bg: '#1A1A1A', label: 'Sun' },
              { icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>, bg: '#F2F2F0', label: 'Logout' },
            ].map(b => (
              <div key={b.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <button style={{ width: 32, height: 32, background: b.bg, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                  {b.icon}
                </button>
                <Label>{b.label}</Label>
              </div>
            ))}
          </Row>
        </Section>

        {/* ─── BADGES & PILLS ───────────────────────────────────────────────── */}
        <Section title="Badges & Status Pills">
          <Row label="Trend badges">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E8F5E9', borderRadius: 12, padding: '4px 10px' }}>
                <TrendingUp size={10} color="#4CAF50" strokeWidth={2} />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#4CAF50' }}>36.8%</span>
              </div>
              <Label>Trend positivo</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#FFEBEE', borderRadius: 12, padding: '4px 10px' }}>
                <TrendingDown size={10} color="#FF5252" strokeWidth={2} />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#FF5252' }}>06.8%</span>
              </div>
              <Label>Trend negativo</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#E8F5E9', borderRadius: 12, padding: '3px 6px' }}>
                <TrendingUp size={8} color="#4CAF50" strokeWidth={2} />
                <span style={{ fontSize: 9, fontWeight: 600, color: '#4CAF50' }}>16.8%</span>
              </div>
              <Label>Trend pequeno (metric card)</Label>
            </div>
          </Row>

          <Row label="Numeric badges (sidebar)">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 20, height: 20, background: '#4CAF50', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, lineHeight: 1 }}>3</span>
              </div>
              <Label>Badge verde</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 20, height: 20, background: '#FF5252', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#fff', fontSize: 10, fontWeight: 600, lineHeight: 1 }}>2</span>
              </div>
              <Label>Badge vermelho</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ background: '#E8450A', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                42 números
              </span>
              <Label>Badge contador (disparos)</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, background: '#E8450A', color: '#fff', borderRadius: 20, padding: '2px 8px' }}>
                padrão
              </span>
              <Label>Badge "padrão" ativo</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: 10, fontWeight: 600, background: '#E0E0E0', color: '#666', borderRadius: 20, padding: '2px 8px' }}>
                padrão
              </span>
              <Label>Badge "padrão" inativo</Label>
            </div>
          </Row>

          <Row label="Status de SMS">
            {[
              { icon: <CheckCircle2 size={13} color="#4CAF50" />, label: 'Entregue', color: '#4CAF50' },
              { icon: <RefreshCw size={13} color="#2196F3" />, label: 'Enviado', color: '#2196F3' },
              { icon: <Clock size={13} color="#AAAAAA" />, label: 'Pendente', color: '#AAAAAA' },
              { icon: <XCircle size={13} color="#F44336" />, label: 'Falha', color: '#F44336' },
              { icon: <AlertCircle size={13} color="#FF9800" />, label: 'Expirado', color: '#FF9800' },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', borderRadius: 8, border: `1px solid ${s.color}33`, background: `${s.color}11` }}>
                  {s.icon}
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.color }}>{s.label}</span>
                </div>
                <Label>{s.label}</Label>
              </div>
            ))}
          </Row>

          <Row label="Status dot (activity feed)">
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#E8450A' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#AAAAAA' }} />
          </Row>
        </Section>

        {/* ─── INPUTS & FORMS ───────────────────────────────────────────────── */}
        <Section title="Inputs & Formulários">
          <Row label="Text Input">
            <div style={{ width: 280 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, letterSpacing: 0.1 }}>E-mail</label>
              <input type="email" placeholder="seu@email.com" style={{ ...inp, border: '1.5px solid #E8E8E8', borderRadius: 10, padding: '10px 14px', fontSize: 14, background: '#FAFAFA' }} />
            </div>
            <div style={{ width: 280 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, letterSpacing: 0.1 }}>Senha</label>
              <input type="password" placeholder="••••••••" style={{ ...inp, border: '1.5px solid #E8450A', borderRadius: 10, padding: '10px 14px', fontSize: 14, background: '#FAFAFA' }} />
            </div>
          </Row>

          <Row label="Input de busca (topbar)">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, width: 200, background: '#FFFFFF', borderRadius: 20, padding: '10px 16px', border: '1px solid #EFEFED' }}>
              <Search size={14} color="#AAAAAA" strokeWidth={1.8} />
              <input placeholder="Buscar algo..." style={{ border: 'none', background: 'transparent', fontSize: 12, color: '#1A1A1A', width: '100%', outline: 'none', fontFamily: 'Inter' }} />
            </div>
          </Row>

          <Row label="Textarea">
            <div style={{ width: 300 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Texto do SMS</div>
              <textarea
                style={{ ...inp, height: 90, resize: 'vertical', lineHeight: 1.5 }}
                placeholder="Digite o texto que será enviado..."
                defaultValue=""
              />
              <div style={{ marginTop: 6, fontSize: 11, color: '#AAAAAA', textAlign: 'right' }}>0 / 160 chars</div>
            </div>
            <div style={{ width: 300 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Números</div>
              <textarea
                style={{ ...inp, height: 90, resize: 'vertical', lineHeight: 1.6, fontFamily: 'monospace', fontSize: 12 }}
                placeholder={'5511911420402\n5521987654321'}
              />
              <div style={{ marginTop: 6, fontSize: 12, color: '#4CAF50' }}>✓ 2 números válidos detectados</div>
            </div>
          </Row>

          <Row label="Select com chevron">
            <div style={{ minWidth: 200, position: 'relative' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Disparos simultâneos</div>
              <div style={{ position: 'relative' }}>
                <select style={{ ...inp, appearance: 'none', paddingRight: 32, cursor: 'pointer', width: '100%' }}>
                  <option>1 por vez</option>
                  <option>5 por vez</option>
                  <option selected>10 por vez</option>
                  <option>20 por vez</option>
                </select>
                <ChevronDown size={13} color="#888" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
            <div style={{ minWidth: 200, position: 'relative' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>Intervalo entre lotes</div>
              <div style={{ position: 'relative' }}>
                <select style={{ ...inp, appearance: 'none', paddingRight: 32, cursor: 'pointer', width: '100%' }}>
                  <option>Sem intervalo</option>
                  <option>200ms</option>
                  <option selected>500ms</option>
                  <option>1000ms</option>
                </select>
                <ChevronDown size={13} color="#888" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
              </div>
            </div>
          </Row>

          <Row label="Alert de erro (formulário)">
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', maxWidth: 360 }}>
              Credenciais inválidas. Verifique seu e-mail e senha.
            </div>
          </Row>

          <Row label="Alert de erro (mutation)">
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', maxWidth: 360 }}>
              Erro ao salvar. Tente novamente.
            </div>
          </Row>
        </Section>

        {/* ─── CARDS ────────────────────────────────────────────────────────── */}
        <Section title="Cards">
          <Row label="Card padrão (border 1.5px)">
            <Card w={300}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A', marginBottom: 8 }}>Título do card</div>
              <div style={{ fontSize: 13, color: '#666' }}>Conteúdo interno do card com padding 20px 24px.</div>
            </Card>
          </Row>

          <Row label="Metric Cards — Dashboard">
            {[
              { bg: '#f9f9f9', icon: <Wallet size={14} color="#888888" strokeWidth={1.8} />, label: 'Receita', value: '12.480 SMS', badge: { pct: '16.8%', up: true } },
              { bg: '#FFFFFF', center: true, icon: <Award size={14} color="#888888" strokeWidth={1.8} />, label: 'Taxa de Entrega', value: '98%', badge: undefined },
              { bg: '#f9f9f9', icon: <Users size={14} color="#888888" strokeWidth={1.8} />, label: 'Contatos', value: '3.200', badge: { pct: '06.8%', up: false } },
            ].map((m, i) => (
              <div key={i} style={{
                flex: '0 0 auto', width: 180, height: 120, background: m.bg,
                borderRadius: 16, border: '1px solid #E8E8E8', padding: 20,
                display: 'flex', flexDirection: 'column', gap: 12, justifyContent: 'center',
                alignItems: m.center ? 'center' : 'flex-start',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {m.icon}
                  <span style={{ fontSize: 12, color: '#888888' }}>{m.label}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: m.center ? 'center' : 'flex-start' }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: '#1A1A1A', lineHeight: 1 }}>{m.value}</span>
                  {m.badge && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: m.badge.up ? '#E8F5E9' : '#FFEBEE', borderRadius: 12, padding: '3px 6px' }}>
                        {m.badge.up ? <TrendingUp size={8} color="#4CAF50" strokeWidth={2} /> : <TrendingDown size={8} color="#FF5252" strokeWidth={2} />}
                        <span style={{ fontSize: 9, fontWeight: 600, color: m.badge.up ? '#4CAF50' : '#FF5252' }}>{m.badge.pct}</span>
                      </div>
                      <span style={{ fontSize: 9, color: '#AAAAAA' }}>vs. mês anterior</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </Row>

          <Row label="Stat Cards — Disparos / Campanhas">
            {[
              { label: 'Total', val: 4758, color: '#888888' },
              { label: 'Entregues', val: 4151, color: '#4CAF50' },
              { label: 'Enviados', val: 180, color: '#2196F3' },
              { label: 'Falhas', val: 319, color: '#F44336' },
              { label: 'Pendentes', val: 108, color: '#AAAAAA' },
            ].map(s => (
              <div key={s.label} style={{ flex: 1, minWidth: 80, background: '#fff', borderRadius: 10, border: `1.5px solid ${s.color}22`, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 600, color: s.color, textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.label === 'Total' ? '#1A1A1A' : s.color }}>{s.val.toLocaleString('pt-BR')}</div>
              </div>
            ))}
          </Row>

          <Row label="Card selecionável (rota/shortcode)">
            <button style={{ padding: '14px 16px', borderRadius: 10, border: '1.5px solid #E8450A', background: '#FFF4F0', cursor: 'pointer', textAlign: 'left', minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#E8450A', marginBottom: 3 }}>Rota Principal</div>
              <div style={{ fontSize: 12, color: '#888' }}>3 shortcodes disponíveis</div>
            </button>
            <button style={{ padding: '14px 16px', borderRadius: 10, border: '1.5px solid #EBEBEB', background: '#FAFAFA', cursor: 'pointer', textAlign: 'left', minWidth: 200 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 3 }}>Rota Alternativa</div>
              <div style={{ fontSize: 12, color: '#888' }}>1 shortcode disponível</div>
            </button>
          </Row>

          <Row label="Card de campanha (lista)">
            <button style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #F0F0EE', padding: '20px 24px', cursor: 'pointer', textAlign: 'left', width: '100%', maxWidth: 640 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>20/03/2026 14:32</div>
                  <div style={{ fontSize: 12, color: '#888' }}>Rota: <strong>blk</strong> · Shortcode: <strong>TRUVILA</strong></div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A' }}>4758</div><div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.3 }}>Total</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: '#4CAF50' }}>4151</div><div style={{ fontSize: 10, color: '#4CAF50', textTransform: 'uppercase', letterSpacing: 0.3 }}>Entregues</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: '#F44336' }}>319</div><div style={{ fontSize: 10, color: '#F44336', textTransform: 'uppercase', letterSpacing: 0.3 }}>Falhas</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ fontSize: 18, fontWeight: 700, color: '#E8450A' }}>95%</div><div style={{ fontSize: 10, color: '#888', textTransform: 'uppercase', letterSpacing: 0.3 }}>Resposta</div></div>
                </div>
              </div>
              <div style={{ height: 4, background: '#F0F0EE', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '95%', background: 'linear-gradient(90deg, #4CAF50, #81C784)', borderRadius: 2 }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#AAA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                Prezado cliente, sua fatura vence amanhã...
              </div>
            </button>
          </Row>

          <Row label="Card resumo + salvar (Integrações)">
            <div style={{ background: '#FAFAFA', borderRadius: 12, border: '1.5px solid #F0F0EE', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, maxWidth: 560 }}>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Configuração atual</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                  Rota Principal
                  <span style={{ color: '#888', fontWeight: 400, margin: '0 6px' }}>via</span>
                  <span style={{ fontFamily: 'monospace', color: '#E8450A' }}>TRUVILA</span>
                </div>
              </div>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', background: 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)', color: '#fff', borderRadius: 10, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', flexShrink: 0 }}>
                <Save size={14} /> Salvar padrão
              </button>
            </div>
          </Row>
        </Section>

        {/* ─── PROGRESS BARS ────────────────────────────────────────────────── */}
        <Section title="Progress Bars">
          <Row label="Barra de progresso — laranja (disparos)" col>
            <div style={{ width: '100%', maxWidth: 480 }}>
              <div style={{ height: 5, background: '#F0F0EE', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '72%', background: 'linear-gradient(90deg, #E8450A, #FF6B35)', borderRadius: 3, transition: 'width 0.3s ease' }} />
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4, textAlign: 'right' }}>72% processado</div>
            </div>
            <div style={{ width: '100%', maxWidth: 480 }}>
              <div style={{ height: 5, background: '#F0F0EE', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '95%', background: 'linear-gradient(90deg, #E8450A, #FF6B35)', borderRadius: 3 }} />
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4, textAlign: 'right' }}>95% com resposta</div>
            </div>
          </Row>

          <Row label="Mini barra de progresso — verde (card de campanha)" col>
            <div style={{ width: '100%', maxWidth: 480 }}>
              <div style={{ height: 4, background: '#F0F0EE', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: '87%', background: 'linear-gradient(90deg, #4CAF50, #81C784)', borderRadius: 2 }} />
              </div>
            </div>
          </Row>
        </Section>

        {/* ─── GRÁFICO DE BARRAS ─────────────────────────────────────────────── */}
        <Section title="Gráfico de Barras">
          <Row label="Bar chart semanal (Dashboard)">
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, width: 320 }}>
              {[
                { day: 'Dom', h: 40 }, { day: 'Seg', h: 70 }, { day: 'Ter', h: 110 },
                { day: 'Qua', h: 140 }, { day: 'Qui', h: 100 }, { day: 'Sex', h: 55 },
                { day: 'Sáb', h: 30, today: true },
              ].map(b => (
                <div key={b.day} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 6 }}>
                  <div style={{ width: '100%', height: b.h, background: b.today ? '#E8450A' : '#F5C4B8', borderRadius: '6px 6px 0 0' }} />
                  <span style={{ fontSize: 10, color: b.today ? '#E8450A' : '#AAAAAA', fontWeight: b.today ? 700 : 400 }}>{b.day}</span>
                </div>
              ))}
            </div>
          </Row>
        </Section>

        {/* ─── TABELAS ─────────────────────────────────────────────────────── */}
        <Section title="Tabela de Resultados">
          <Row label="Tabela de disparo / campanha" col>
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #F0F0EE', padding: 0, overflow: 'hidden', width: '100%', maxWidth: 760 }}>
              <div style={{ padding: '12px 20px', borderBottom: '1px solid #F0F0EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Resultados do disparo</span>
                <span style={{ fontSize: 12, color: '#888' }}>Atualiza via webhook a cada 3s</span>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAFA' }}>
                    {['Número', 'Message ID', 'Status', 'Enviado em', 'Atualizado em'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.4, borderBottom: '1px solid #F0F0EE', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { number: '5511911420402', messageId: 'abc-123-def', status: 'entregue', color: '#4CAF50', icon: <CheckCircle2 size={13} color="#4CAF50" />, sent: '14:32:10', updated: '14:32:18' },
                    { number: '5521987654321', messageId: 'ghi-456-jkl', status: 'enviado', color: '#2196F3', icon: <RefreshCw size={13} color="#2196F3" />, sent: '14:32:11', updated: '—' },
                    { number: '5531000001111', messageId: null, status: 'pendente', color: '#AAAAAA', icon: <Clock size={13} color="#AAAAAA" />, sent: '—', updated: '—' },
                    { number: '5541999998888', messageId: 'mno-789-pqr', status: 'falha', color: '#F44336', icon: <XCircle size={13} color="#F44336" />, sent: '14:32:12', updated: '14:32:15' },
                  ].map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F8F8F8' }}>
                      <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'monospace', color: '#1A1A1A' }}>{r.number}</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, fontFamily: 'monospace', color: '#888' }}>{r.messageId ?? '—'}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {r.icon}
                          <span style={{ fontSize: 12, fontWeight: 600, color: r.color }}>{r.status.charAt(0).toUpperCase() + r.status.slice(1)}</span>
                        </div>
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>{r.sent}</td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>{r.updated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Row>
        </Section>

        {/* ─── NAVIGATION ───────────────────────────────────────────────────── */}
        <Section title="Navegação">
          <Row label="Tab bar (Disparos)">
            <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #F0F0EE', fontFamily: 'Inter, sans-serif', width: 360 }}>
              {[
                { key: 'novo', label: 'Novo Disparo', icon: <Send size={13} />, active: true },
                { key: 'campanhas', label: 'Campanhas', icon: <List size={13} />, active: false },
              ].map(t => (
                <button key={t.key} style={{ padding: '14px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: t.active ? '#E8450A' : '#888', borderBottom: t.active ? '2px solid #E8450A' : '2px solid transparent', marginBottom: -2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Nav items sidebar">
            <div style={{ background: '#fff', borderRadius: 12, border: '1px solid #EFEFED', padding: '8px', width: 240 }}>
              {[
                { icon: <LayoutGrid size={14} />, label: 'Dashboard', active: true },
                { icon: <Users size={14} />, label: 'Contatos', active: false },
                { icon: <Megaphone size={14} />, label: 'Campanhas', active: false },
                { icon: <Send size={14} />, label: 'Disparos', active: false },
                { icon: <Zap size={14} />, label: 'Automações', active: false },
                { icon: <BarChart2 size={14} />, label: 'Relatórios', active: false },
                { icon: <Plug size={14} />, label: 'Integrações', active: false },
                { icon: <CreditCard size={14} />, label: 'Financeiro', active: false },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, padding: '9px 12px', borderRadius: 8, background: item.active ? '#F2F2F0' : 'transparent', boxShadow: item.active ? 'inset 0 0 0 1px #dedede, 0 2px 4px rgba(0,0,0,0.102)' : 'none', marginBottom: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, background: item.active ? '#E8E8E6' : '#F5F5F3', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.active ? '#1A1A1A' : '#888888' }}>
                      {item.icon}
                    </div>
                    <span style={{ color: item.active ? '#1A1A1A' : '#666666', fontSize: 13, fontWeight: item.active ? 600 : 400 }}>{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Row>
        </Section>

        {/* ─── ACTIVITY FEED ────────────────────────────────────────────────── */}
        <Section title="Activity Feed">
          <Row label="Lista de atividades recentes">
            <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EFEFED', padding: 18, width: 280, display: 'flex', flexDirection: 'column', gap: 0 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 14, display: 'block' }}>Transações Recentes</span>
              {[
                { label: 'SMS Enviado', sub: 'Disparo de mensagem', color: '#4CAF50', time: 'há 2min', date: '20/03 14:32' },
                { label: 'OTP Enviado', sub: 'Código de verificação', color: '#E8450A', time: 'há 6min', date: '20/03 14:28' },
                { label: 'Login realizado', sub: 'Acesso à plataforma', color: '#4CAF50', time: 'há 22min', date: '20/03 14:10' },
              ].map((ev, i, arr) => (
                <div key={ev.label + i}>
                  <div style={{ display: 'flex', gap: 10, padding: '0 0 12px' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: ev.color, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 700 }}>
                      {ev.label[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A' }}>{ev.label}</span>
                        <span style={{ fontSize: 10, color: '#AAAAAA', whiteSpace: 'nowrap' }}>{ev.time}</span>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', flexShrink: 0 }} />
                      </div>
                      <span style={{ fontSize: 11, color: '#666666' }}>{ev.sub}</span>
                      <span style={{ fontSize: 11, color: '#888888' }}>{ev.date}</span>
                    </div>
                  </div>
                  {i < arr.length - 1 && <div style={{ height: 1, background: '#F5F5F5', marginBottom: 12 }} />}
                </div>
              ))}
              <button style={{ width: '100%', padding: '10px 0', borderRadius: 20, border: '1px solid #E0E0E0', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                <span style={{ fontSize: 12, color: '#555555' }}>Ver tudo</span>
              </button>
            </div>
          </Row>
        </Section>

        {/* ─── LOGO & AVATAR ────────────────────────────────────────────────── */}
        <Section title="Logo, Avatar & Identidade">
          <Row label="Logo">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 32, height: 32, background: '#E8450A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>T</span>
                </div>
                <span style={{ color: '#1A1A1A', fontSize: 13, fontWeight: 700, letterSpacing: 2 }}>TRUVILA</span>
              </div>
              <Label>Logo sidebar expandida</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 32, height: 32, background: '#E8450A', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: '#FFFFFF', fontSize: 12, fontWeight: 700, lineHeight: 1 }}>T</span>
              </div>
              <Label>Logo sidebar colapsada</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: '#E8450A', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16 }}>T</div>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#111', letterSpacing: -0.3 }}>TRUVILA</span>
              </div>
              <Label>Logo login (36px)</Label>
            </div>
          </Row>

          <Row label="Avatar & Topbar icons">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#C4B5A5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14 }}>S</div>
              <Label>Avatar usuário</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#FFFFFF', border: '1px solid #EFEFED', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <Bell size={16} color="#888888" strokeWidth={1.8} />
              </div>
              <Label>Bell icon</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 28, height: 28, background: '#F2F2F0', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <PanelLeftClose size={14} color="#888888" />
              </div>
              <Label>Colapsar sidebar</Label>
            </div>
          </Row>
        </Section>

        {/* ─── LOADING STATES ───────────────────────────────────────────────── */}
        <Section title="Loading States">
          <Row label="Spinners">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <RefreshCw size={20} color="#E8450A" style={{ animation: 'spin 1s linear infinite' }} />
              <Label>Spinner 20px (tela de campanha)</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 13 }}>
                <RefreshCw size={13} color="#888" style={{ animation: 'spin 1s linear infinite' }} />
                Carregando rotas...
              </div>
              <Label>Inline loading text</Label>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#888', fontSize: 13 }}>
                <RefreshCw size={13} color="#888" style={{ animation: 'spin 1s linear infinite' }} />
                Enviando 24/100
              </div>
              <Label>Running status</Label>
            </div>
          </Row>

          <Row label="Empty states">
            <div style={{ background: '#fff', borderRadius: 12, border: '1.5px solid #F0F0EE', padding: 40, textAlign: 'center', color: '#888', fontSize: 13, maxWidth: 400 }}>
              Nenhuma campanha encontrada. Faça um disparo para criar o primeiro relatório.
            </div>
          </Row>
        </Section>

        {/* ─── ÍCONES ───────────────────────────────────────────────────────── */}
        <Section title="Ícones (Lucide React)">
          <Row label="Todos os ícones utilizados">
            {[
              { icon: <Send size={20} />, name: 'Send' },
              { icon: <Upload size={20} />, name: 'Upload' },
              { icon: <Download size={20} />, name: 'Download' },
              { icon: <RefreshCw size={20} />, name: 'RefreshCw' },
              { icon: <CheckCircle2 size={20} />, name: 'CheckCircle2' },
              { icon: <XCircle size={20} />, name: 'XCircle' },
              { icon: <Clock size={20} />, name: 'Clock' },
              { icon: <AlertCircle size={20} />, name: 'AlertCircle' },
              { icon: <Hash size={20} />, name: 'Hash' },
              { icon: <Users size={20} />, name: 'Users' },
              { icon: <FileText size={20} />, name: 'FileText' },
              { icon: <Zap size={20} />, name: 'Zap' },
              { icon: <ChevronDown size={20} />, name: 'ChevronDown' },
              { icon: <List size={20} />, name: 'List' },
              { icon: <ArrowLeft size={20} />, name: 'ArrowLeft' },
              { icon: <Bell size={20} />, name: 'Bell' },
              { icon: <Search size={20} />, name: 'Search' },
              { icon: <Wallet size={20} />, name: 'Wallet' },
              { icon: <Award size={20} />, name: 'Award' },
              { icon: <TrendingUp size={20} />, name: 'TrendingUp' },
              { icon: <TrendingDown size={20} />, name: 'TrendingDown' },
              { icon: <Radio size={20} />, name: 'Radio' },
              { icon: <Save size={20} />, name: 'Save' },
              { icon: <CheckSquare size={20} />, name: 'CheckSquare' },
              { icon: <Square size={20} />, name: 'Square' },
              { icon: <LayoutGrid size={20} />, name: 'LayoutGrid' },
              { icon: <Megaphone size={20} />, name: 'Megaphone' },
              { icon: <BarChart2 size={20} />, name: 'BarChart2' },
              { icon: <Plug size={20} />, name: 'Plug' },
              { icon: <CreditCard size={20} />, name: 'CreditCard' },
              { icon: <HelpCircle size={20} />, name: 'HelpCircle' },
              { icon: <Settings size={20} />, name: 'Settings' },
              { icon: <PanelLeftClose size={20} />, name: 'PanelLeftClose' },
              { icon: <MessageCircle size={20} />, name: 'MessageCircle' },
              { icon: <Moon size={20} />, name: 'Moon' },
              { icon: <Sun size={20} />, name: 'Sun' },
            ].map(ic => (
              <div key={ic.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#555' }}>
                {ic.icon}
                <span style={{ fontSize: 9, color: '#AAAAAA', textAlign: 'center' }}>{ic.name}</span>
              </div>
            ))}
          </Row>
        </Section>

      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </Layout>
  );
}
