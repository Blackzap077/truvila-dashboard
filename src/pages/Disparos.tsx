import { useState, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Send, Upload, Download, RefreshCw, CheckCircle2, XCircle,
  Clock, AlertCircle, Hash, Users, FileText, Zap, ChevronDown,
} from 'lucide-react';
import { api, webhookApi, smsRoutesApi } from '../api/client';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface SmsRoute {
  id: string;
  key: string;
  name: string;
  shortcodes: string[];
  defaultShortcode: string;
  isActive: boolean;
}

interface SmsResult {
  number: string;
  messageId: string | null;
  status: 'pendente' | 'enviando' | 'enviado' | 'entregue' | 'falha' | 'expirado' | 'invalido';
  statusLabel: string;
  sentAt: string | null;
  updatedAt: string | null;
  error: string | null;
}

interface WebhookEvent {
  messageId: string;
  statusCode: string;
  statusLabel: string;
  to: string;
  updatedAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseNumbers(raw: string): string[] {
  return raw
    .split(/[\n,;|\s]+/)
    .map(n => n.replace(/\D/g, ''))
    .filter(n => n.length >= 10 && n.length <= 15);
}

function statusColor(status: SmsResult['status']): string {
  switch (status) {
    case 'entregue':  return '#4CAF50';
    case 'enviado':
    case 'enviando':  return '#2196F3';
    case 'pendente':  return '#888888';
    case 'falha':
    case 'invalido':  return '#F44336';
    case 'expirado':  return '#FF9800';
    default:          return '#888888';
  }
}

function statusIcon(status: SmsResult['status']) {
  const s = 14;
  switch (status) {
    case 'entregue':  return <CheckCircle2 size={s} color="#4CAF50" />;
    case 'enviado':
    case 'enviando':  return <RefreshCw size={s} color="#2196F3" style={{ animation: status === 'enviando' ? 'spin 1s linear infinite' : undefined }} />;
    case 'falha':
    case 'invalido':  return <XCircle size={s} color="#F44336" />;
    case 'expirado':  return <AlertCircle size={s} color="#FF9800" />;
    default:          return <Clock size={s} color="#AAAAAA" />;
  }
}

function mapWebhookStatus(raw: string): SmsResult['status'] {
  switch (raw.toUpperCase()) {
    case 'DELIVRD':  case 'ENTREGUE':  return 'entregue';
    case 'ENROUTE':  case 'ACCEPTD':   return 'enviado';
    case 'UNDELIV':  case 'REJECTD':   return 'invalido';
    case 'EXPIRED':                     return 'expirado';
    case 'DELETED':  case 'FALHA':     return 'falha';
    default:                            return 'enviado';
  }
}

function exportCSV(results: SmsResult[]) {
  const header = 'Número,Message ID,Status,Label,Enviado em,Atualizado em';
  const rows = results.map(r =>
    [r.number, r.messageId ?? '', r.status, r.statusLabel,
     r.sentAt ?? '', r.updatedAt ?? ''].join(',')
  );
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `disparo_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Componente Principal ─────────────────────────────────────────────────────

export default function Disparos() {
  // Rotas do backend
  const { data: routes = [], isLoading: loadingRoutes } = useQuery<SmsRoute[]>({
    queryKey: ['sms-routes'],
    queryFn: () => smsRoutesApi.list().then(r => r.data),
  });

  // Config — inicializa quando rotas carregam
  const [rotaKey, setRotaKey]       = useState('');
  const [shortcode, setShortcode]   = useState('');
  const [mensagem, setMensagem]     = useState('');
  const [rawNumbers, setRawNumbers] = useState('');
  const [batchSize, setBatchSize]   = useState(10);
  const [delay, setDelay]           = useState(500);

  // Inicializa rota e shortcode quando rotas chegam
  useEffect(() => {
    if (routes.length > 0 && !rotaKey) {
      setRotaKey(routes[0].key);
      setShortcode(routes[0].defaultShortcode);
    }
  }, [routes, rotaKey]);

  // Rota selecionada
  const rotaSelecionada = routes.find(r => r.key === rotaKey) ?? null;

  function handleRotaChange(key: string) {
    setRotaKey(key);
    const r = routes.find(r => r.key === key);
    setShortcode(r?.defaultShortcode ?? r?.shortcodes[0] ?? '');
  }

  // Estado do disparo
  const [results, setResults]   = useState<SmsResult[]>([]);
  const [running, setRunning]   = useState(false);
  const [done, setDone]         = useState(false);
  const abortRef                = useRef(false);
  const intervalRef             = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollUntilRef            = useRef<number>(0); // timestamp até quando continuar polling

  // Números
  const numbers = parseNumbers(rawNumbers);
  const total   = numbers.length;

  // Contadores
  const sent      = results.filter(r => r.status !== 'pendente' && r.status !== 'enviando').length;
  const delivered = results.filter(r => r.status === 'entregue').length;
  const failed    = results.filter(r => r.status === 'falha' || r.status === 'invalido').length;
  const pending   = results.filter(r => r.status === 'pendente').length;

  // ── Polling webhooks ──────────────────────────────────────────────────────
  const pollWebhooks = useCallback(async () => {
    try {
      const res = await webhookApi.events();
      const events: WebhookEvent[] = res.data;
      setResults(prev => prev.map(r => {
        if (!r.messageId) return r;
        const ev = events.find(e => e.messageId === r.messageId);
        if (!ev) return r;
        const newStatus = mapWebhookStatus(ev.statusCode);
        if (newStatus === r.status) return r;
        return { ...r, status: newStatus, statusLabel: ev.statusLabel ?? r.statusLabel, updatedAt: ev.updatedAt ?? new Date().toISOString() };
      }));
    } catch { /* silencioso */ }
  }, []);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const shouldPoll = running || (done && Date.now() < pollUntilRef.current);
    if (shouldPoll) {
      intervalRef.current = setInterval(pollWebhooks, 3000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, done, pollWebhooks]);

  // ── Disparo ───────────────────────────────────────────────────────────────
  async function startDisparo() {
    if (!rotaKey || !shortcode.trim() || !mensagem.trim() || numbers.length === 0) return;

    abortRef.current = false;
    setDone(false);
    setRunning(true);

    const initial: SmsResult[] = numbers.map(n => ({
      number: n, messageId: null, status: 'pendente',
      statusLabel: 'Aguardando', sentAt: null, updatedAt: null, error: null,
    }));
    setResults(initial);

    for (let i = 0; i < numbers.length; i += batchSize) {
      if (abortRef.current) break;
      const batch = numbers.slice(i, i + batchSize);

      await Promise.all(batch.map(async (number, bi) => {
        const idx = i + bi;
        setResults(prev => prev.map((r, j) => j === idx ? { ...r, status: 'enviando', statusLabel: 'Enviando...' } : r));
        try {
          const res = await api.post(`/sms/send?route=${rotaKey}`, {
            to: [number],
            from: shortcode,
            message: mensagem,
          });
          const data = res.data as Record<string, unknown>;
          // Sintegrax pode retornar id, message_id, messageId, ou nested em data
          const nested = (data?.data ?? data) as Record<string, unknown>;
          const msgId = (nested?.id ?? nested?.message_id ?? nested?.messageId ?? null) as string | null;
          setResults(prev => prev.map((r, j) => j === idx ? {
            ...r, status: 'enviado', statusLabel: 'Enviado',
            messageId: msgId,
            sentAt: new Date().toISOString(),
          } : r));
        } catch (e: unknown) {
          const msg =
            (e as { response?: { data?: { message?: string } } })?.response?.data?.message
            ?? (e instanceof Error ? e.message : 'Erro no envio');
          setResults(prev => prev.map((r, j) => j === idx ? {
            ...r, status: 'falha', statusLabel: 'Falha', error: msg,
          } : r));
        }
      }));

      if (i + batchSize < numbers.length && delay > 0) {
        await new Promise(res => setTimeout(res, delay));
      }
    }

    setRunning(false);
    pollUntilRef.current = Date.now() + 5 * 60 * 1000; // polling por mais 5 minutos
    setDone(true);
  }

  function stopDisparo() {
    abortRef.current = true;
    setRunning(false);
    pollUntilRef.current = Date.now() + 5 * 60 * 1000;
    setDone(true);
  }

  function resetDisparo() {
    setResults([]);
    setDone(false);
    abortRef.current = false;
  }

  // ── Estilos ───────────────────────────────────────────────────────────────
  const card: React.CSSProperties = {
    background: '#fff', borderRadius: 12,
    border: '1.5px solid #F0F0EE', padding: '20px 24px',
  };
  const lbl: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  };
  const inp: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1.5px solid #EBEBEB', fontSize: 13, color: '#1A1A1A',
    background: '#FAFAFA', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif',
  };
  const statCard = (color: string): React.CSSProperties => ({
    flex: 1, background: '#fff', borderRadius: 10,
    border: `1.5px solid ${color}22`, padding: '14px 16px',
    display: 'flex', flexDirection: 'column', gap: 4,
  });

  const canDispatch = !!rotaKey && !!shortcode.trim() && !!mensagem.trim() && total > 0;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', maxWidth: 920, fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginBottom: 4, letterSpacing: -0.3 }}>
            Disparos SMS
          </h1>
          <p style={{ fontSize: 13, color: '#888' }}>
            Configure e dispare SMS em massa com atualização de status em tempo real.
          </p>
        </div>
        {results.length > 0 && (
          <button onClick={() => exportCSV(results)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 8,
            border: '1.5px solid #E0E0E0', background: '#FAFAFA',
            fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer',
          }}>
            <Download size={14} /> Exportar CSV
          </button>
        )}
      </div>

      {/* ── Seleção de Rota (cards clicáveis) ── */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <Zap size={15} color="#E8450A" />
          <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Rota de envio</span>
          {loadingRoutes && <RefreshCw size={13} color="#888" style={{ animation: 'spin 1s linear infinite' }} />}
        </div>

        {routes.length === 0 && !loadingRoutes && (
          <div style={{ fontSize: 13, color: '#888' }}>Nenhuma rota encontrada. Configure em Integrações.</div>
        )}

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {routes.map(route => {
            const sel = rotaKey === route.key;
            return (
              <button
                key={route.key}
                onClick={() => handleRotaChange(route.key)}
                disabled={running}
                style={{
                  flex: 1, minWidth: 160,
                  padding: '14px 18px', borderRadius: 10, textAlign: 'left',
                  border: sel ? '1.5px solid #E8450A' : '1.5px solid #EBEBEB',
                  background: sel ? '#FFF4F0' : '#FAFAFA',
                  cursor: running ? 'not-allowed' : 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 700, color: sel ? '#E8450A' : '#1A1A1A', marginBottom: 4 }}>
                  {route.name}
                </div>
                <div style={{ fontSize: 11, color: '#888', fontFamily: 'monospace' }}>
                  key: {route.key}
                </div>
                <div style={{ fontSize: 11, color: '#AAAAAA', marginTop: 2 }}>
                  {route.shortcodes.length} shortcode{route.shortcodes.length !== 1 ? 's' : ''}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Shortcode (bolinha clicável por rota) ── */}
      {rotaSelecionada && (
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Hash size={15} color="#E8450A" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Shortcode (Remetente)</span>
            <span style={{ fontSize: 12, color: '#888' }}>— rota <strong>{rotaSelecionada.name}</strong></span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {rotaSelecionada.shortcodes.map(sc => {
              const sel = shortcode === sc;
              return (
                <button
                  key={sc}
                  onClick={() => setShortcode(sc)}
                  disabled={running}
                  style={{
                    padding: '10px 18px', borderRadius: 8,
                    border: sel ? '1.5px solid #E8450A' : '1.5px solid #EBEBEB',
                    background: sel ? '#FFF4F0' : '#FAFAFA',
                    fontSize: 13, fontWeight: sel ? 700 : 400,
                    color: sel ? '#E8450A' : '#444',
                    fontFamily: 'monospace',
                    cursor: running ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}
                >
                  {sc}
                  {sc === rotaSelecionada.defaultShortcode && (
                    <span style={{
                      fontSize: 10, fontWeight: 600, background: sel ? '#E8450A' : '#E0E0E0',
                      color: sel ? '#fff' : '#666', borderRadius: 20, padding: '2px 7px',
                    }}>padrão</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Mensagem + Números ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Mensagem */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FileText size={15} color="#E8450A" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Mensagem</span>
          </div>
          <div style={lbl}>Texto do SMS</div>
          <textarea
            style={{ ...inp, height: 110, resize: 'vertical', lineHeight: 1.5 }}
            placeholder="Digite o texto que será enviado..."
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            disabled={running}
          />
          <div style={{ marginTop: 6, fontSize: 11, color: mensagem.length > 160 ? '#F44336' : '#AAAAAA', textAlign: 'right' }}>
            {mensagem.length} / 160 chars
          </div>
        </div>

        {/* Números */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={15} color="#E8450A" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Números</span>
            </div>
            {total > 0 && (
              <span style={{ background: '#E8450A', color: '#fff', borderRadius: 20, padding: '2px 10px', fontSize: 12, fontWeight: 600 }}>
                {total} número{total !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          <div style={lbl}>Um por linha, vírgula ou espaço</div>
          <textarea
            style={{ ...inp, height: 110, resize: 'vertical', lineHeight: 1.6, fontFamily: 'monospace', fontSize: 12 }}
            placeholder={'5511911420402\n5521987654321\n5531999998888'}
            value={rawNumbers}
            onChange={e => setRawNumbers(e.target.value)}
            disabled={running}
          />
          {total > 0 && (
            <div style={{ marginTop: 6, fontSize: 12, color: '#4CAF50' }}>
              ✓ {total} número{total !== 1 ? 's' : ''} válido{total !== 1 ? 's' : ''} detectado{total !== 1 ? 's' : ''}
            </div>
          )}
        </div>
      </div>

      {/* ── Opções + Botão ── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>

        {/* Lotes */}
        <div style={{ minWidth: 160 }}>
          <div style={lbl}>Disparos simultâneos</div>
          <div style={{ position: 'relative' }}>
            <select value={batchSize} onChange={e => setBatchSize(Number(e.target.value))} disabled={running}
              style={{ ...inp, appearance: 'none', paddingRight: 32, cursor: 'pointer', width: 'auto', minWidth: 160 }}>
              {[1, 5, 10, 20, 50, 100].map(n => <option key={n} value={n}>{n} por vez</option>)}
            </select>
            <ChevronDown size={13} color="#888" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Intervalo */}
        <div style={{ minWidth: 160 }}>
          <div style={lbl}>Intervalo entre lotes</div>
          <div style={{ position: 'relative' }}>
            <select value={delay} onChange={e => setDelay(Number(e.target.value))} disabled={running}
              style={{ ...inp, appearance: 'none', paddingRight: 32, cursor: 'pointer', width: 'auto', minWidth: 160 }}>
              {[0, 200, 500, 1000, 2000, 5000].map(n => <option key={n} value={n}>{n === 0 ? 'Sem intervalo' : `${n}ms`}</option>)}
            </select>
            <ChevronDown size={13} color="#888" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          </div>
        </div>

        {/* Estimativa */}
        {total > 0 && (
          <div style={{ fontSize: 12, color: '#888', paddingBottom: 10 }}>
            ~{Math.ceil(total / batchSize)} lotes · ~{((Math.ceil(total / batchSize) * delay) / 1000).toFixed(1)}s
          </div>
        )}

        {/* Botões */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginLeft: 'auto', paddingBottom: 2 }}>
          {!running && !done && (
            <button onClick={startDisparo} disabled={!canDispatch} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '11px 28px', borderRadius: 10,
              background: canDispatch ? 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)' : '#E0E0E0',
              color: '#fff', border: 'none', fontSize: 14, fontWeight: 600,
              cursor: canDispatch ? 'pointer' : 'not-allowed',
            }}>
              <Send size={15} /> Disparar {total > 0 ? `${total} SMS` : ''}
            </button>
          )}
          {running && (
            <>
              <div style={{ fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
                <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
                Enviando {sent}/{total}
              </div>
              <button onClick={stopDisparo} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 22px', borderRadius: 10,
                background: '#F44336', color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                <XCircle size={14} /> Parar
              </button>
            </>
          )}
          {done && (
            <>
              <button onClick={resetDisparo} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 22px', borderRadius: 10,
                background: 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)',
                color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>
                <Upload size={14} /> Novo disparo
              </button>
              <button onClick={pollWebhooks} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '11px 18px', borderRadius: 10,
                border: '1.5px solid #E0E0E0', background: '#FAFAFA',
                fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer',
              }}>
                <RefreshCw size={13} /> Atualizar status
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Stats + Tabela ── */}
      {results.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Total',     val: total,                       color: '#888888' },
              { label: 'Entregues', val: delivered,                   color: '#4CAF50' },
              { label: 'Enviados',  val: sent - delivered - failed,   color: '#2196F3' },
              { label: 'Falhas',    val: failed,                      color: '#F44336' },
              { label: 'Pendentes', val: pending,                     color: '#AAAAAA' },
            ].map(({ label, val, color }) => (
              <div key={label} style={statCard(color)}>
                <div style={{ fontSize: 10, fontWeight: 600, color, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: label === 'Total' ? '#1A1A1A' : color }}>{val}</div>
              </div>
            ))}
          </div>

          {/* Barra de progresso */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ height: 5, background: '#F0F0EE', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${total > 0 ? (sent / total) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #E8450A, #FF6B35)',
                borderRadius: 3, transition: 'width 0.3s ease',
              }} />
            </div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 4, textAlign: 'right' }}>
              {total > 0 ? `${Math.round((sent / total) * 100)}%` : '0%'} processado
            </div>
          </div>

          {/* Tabela */}
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 20px', borderBottom: '1px solid #F0F0EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Resultados do disparo</span>
              <span style={{ fontSize: 12, color: '#888' }}>Atualiza via webhook a cada 3s</span>
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAFA' }}>
                    {['Número', 'Message ID', 'Status', 'Enviado em', 'Atualizado em'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left',
                        fontSize: 11, fontWeight: 600, color: '#888',
                        textTransform: 'uppercase', letterSpacing: 0.4,
                        borderBottom: '1px solid #F0F0EE', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F8F8F8' }}>
                      <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'monospace', color: '#1A1A1A' }}>{r.number}</td>
                      <td style={{ padding: '10px 16px', fontSize: 11, fontFamily: 'monospace', color: '#888' }}>{r.messageId ?? '—'}</td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {statusIcon(r.status)}
                          <span style={{ fontSize: 12, fontWeight: 600, color: statusColor(r.status) }}>{r.statusLabel}</span>
                        </div>
                        {r.error && <div style={{ fontSize: 11, color: '#F44336', marginTop: 2 }}>{r.error}</div>}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                        {r.sentAt ? new Date(r.sentAt).toLocaleTimeString('pt-BR') : '—'}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>
                        {r.updatedAt ? new Date(r.updatedAt).toLocaleTimeString('pt-BR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        textarea:focus, input:focus, select:focus { border-color: #E8450A !important; }
        input:disabled, textarea:disabled, select:disabled { opacity: 0.6; cursor: not-allowed; }
        button:disabled { opacity: 0.6; }
      `}</style>
    </div>
  );
}
