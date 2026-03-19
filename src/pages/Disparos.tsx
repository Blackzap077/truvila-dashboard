import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Send, Upload, Download, RefreshCw, CheckCircle2, XCircle,
  Clock, AlertCircle, Hash, Users, FileText, Zap, ChevronDown,
} from 'lucide-react';
import { api, webhookApi } from '../api/client';

// ─── Tipos ────────────────────────────────────────────────────────────────────

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
  status: string;       // coluna "event" no banco (statusCode)
  statusLabel: string;  // coluna "status" no banco
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
    case 'DELIVRD':   case 'ENTREGUE':   return 'entregue';
    case 'ENROUTE':   case 'ACCEPTD':    return 'enviado';
    case 'UNDELIV':   case 'REJECTD':    return 'invalido';
    case 'EXPIRED':                       return 'expirado';
    case 'DELETED':   case 'FALHA':      return 'falha';
    default:                              return 'enviado';
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
  // Config
  const [shortcode, setShortcode]   = useState('');
  const [rota, setRota]             = useState<'blk' | 'bet' | 'white'>('blk');
  const [mensagem, setMensagem]     = useState('');
  const [rawNumbers, setRawNumbers] = useState('');
  const [batchSize, setBatchSize]   = useState(10);
  const [delay, setDelay]           = useState(500);

  // Estado do disparo
  const [results, setResults]       = useState<SmsResult[]>([]);
  const [running, setRunning]       = useState(false);
  const [done, setDone]             = useState(false);
  const abortRef                    = useRef(false);
  const intervalRef                 = useRef<ReturnType<typeof setInterval> | null>(null);

  // Números parseados
  const numbers = parseNumbers(rawNumbers);
  const total   = numbers.length;

  // Contadores derivados
  const sent      = results.filter(r => r.status !== 'pendente' && r.status !== 'enviando').length;
  const delivered = results.filter(r => r.status === 'entregue').length;
  const failed    = results.filter(r => r.status === 'falha' || r.status === 'invalido').length;
  const pending   = results.filter(r => r.status === 'pendente').length;

  // ── Polling de webhooks ───────────────────────────────────────────────────
  const pollWebhooks = useCallback(async () => {
    try {
      const res = await webhookApi.events();
      const events: WebhookEvent[] = res.data;
      setResults(prev => prev.map(r => {
        if (!r.messageId) return r;
        const ev = events.find(e => e.messageId === r.messageId);
        if (!ev) return r;
        const newStatus = mapWebhookStatus(ev.status);
        // só atualiza se status mudou
        if (newStatus === r.status) return r;
        return {
          ...r,
          status: newStatus,
          statusLabel: ev.statusLabel ?? r.statusLabel,
          updatedAt: ev.updatedAt ?? new Date().toISOString(),
        };
      }));
    } catch {
      // silencioso
    }
  }, []);

  useEffect(() => {
    if (running || (done && results.some(r => r.status === 'enviado'))) {
      intervalRef.current = setInterval(pollWebhooks, 3000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, done, results, pollWebhooks]);

  // ── Disparo ───────────────────────────────────────────────────────────────
  async function startDisparo() {
    if (!shortcode.trim() || !mensagem.trim() || numbers.length === 0) return;

    abortRef.current = false;
    setDone(false);
    setRunning(true);

    // Inicializa todos como pendente
    const initial: SmsResult[] = numbers.map(n => ({
      number: n, messageId: null, status: 'pendente',
      statusLabel: 'Aguardando', sentAt: null, updatedAt: null, error: null,
    }));
    setResults(initial);

    // Processa em lotes
    for (let i = 0; i < numbers.length; i += batchSize) {
      if (abortRef.current) break;
      const batch = numbers.slice(i, i + batchSize);

      await Promise.all(batch.map(async (number, bi) => {
        const idx = i + bi;
        setResults(prev => prev.map((r, j) => j === idx ? { ...r, status: 'enviando', statusLabel: 'Enviando...' } : r));
        try {
          const res = await api.post(`/sms/send?route=${rota}`, {
            to: [number],
            from: shortcode,
            message: mensagem,
          });
          const data = res.data as Record<string, unknown>;
          setResults(prev => prev.map((r, j) => j === idx ? {
            ...r, status: 'enviado', statusLabel: 'Enviado',
            messageId: (data?.messageId ?? data?.id ?? null) as string | null,
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

      // delay entre lotes
      if (i + batchSize < numbers.length && delay > 0) {
        await new Promise(res => setTimeout(res, delay));
      }
    }

    setRunning(false);
    setDone(true);
  }

  function stopDisparo() {
    abortRef.current = true;
    setRunning(false);
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

  const label: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.5,
  };

  const input: React.CSSProperties = {
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

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, fontFamily: 'Inter, sans-serif' }}>

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
          <button
            onClick={() => exportCSV(results)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '9px 16px', borderRadius: 8,
              border: '1.5px solid #E0E0E0', background: '#FAFAFA',
              fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer',
            }}
          >
            <Download size={14} /> Exportar CSV
          </button>
        )}
      </div>

      {/* Config cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>

        {/* Rota + Shortcode */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Zap size={15} color="#E8450A" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Configuração</span>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={label}>Rota de envio</div>
            <div style={{ position: 'relative' }}>
              <select
                value={rota}
                onChange={e => setRota(e.target.value as 'blk' | 'bet' | 'white')}
                disabled={running}
                style={{ ...input, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
              >
                <option value="blk">ALL Brazil (blk)</option>
                <option value="bet">Cassino Direct (bet)</option>
                <option value="white">White Label (white)</option>
              </select>
              <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>
          <div>
            <div style={label}>Shortcode (Remetente)</div>
            <input
              style={{ ...input, fontFamily: 'monospace' }}
              placeholder="Ex: 9100663"
              value={shortcode}
              onChange={e => setShortcode(e.target.value)}
              disabled={running}
            />
          </div>
        </div>

        {/* Mensagem */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <FileText size={15} color="#E8450A" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Mensagem</span>
          </div>
          <div style={label}>Texto do SMS</div>
          <textarea
            style={{ ...input, height: 90, resize: 'vertical', lineHeight: 1.5 }}
            placeholder="Digite o texto que será enviado..."
            value={mensagem}
            onChange={e => setMensagem(e.target.value)}
            disabled={running}
          />
          <div style={{ marginTop: 6, fontSize: 11, color: '#AAAAAA', textAlign: 'right' }}>
            {mensagem.length} / 160 chars
          </div>
        </div>
      </div>

      {/* Números + Opções */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, marginBottom: 16 }}>

        {/* Números */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={15} color="#E8450A" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Números</span>
            </div>
            {total > 0 && (
              <span style={{
                background: '#E8450A', color: '#fff', borderRadius: 20,
                padding: '2px 10px', fontSize: 12, fontWeight: 600,
              }}>{total} número{total !== 1 ? 's' : ''}</span>
            )}
          </div>
          <div style={label}>Cole os números (um por linha, ou separados por vírgula/espaço)</div>
          <textarea
            style={{ ...input, height: 140, resize: 'vertical', lineHeight: 1.6, fontFamily: 'monospace', fontSize: 12 }}
            placeholder={'5511911420402\n5521987654321\n5531999998888\n...'}
            value={rawNumbers}
            onChange={e => setRawNumbers(e.target.value)}
            disabled={running}
          />
          {total > 0 && (
            <div style={{ marginTop: 8, fontSize: 12, color: '#888' }}>
              ✓ {total} número{total !== 1 ? 's' : ''} válido{total !== 1 ? 's' : ''} detectado{total !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Opções de disparo */}
        <div style={card}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Hash size={15} color="#E8450A" />
            <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Opções</span>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={label}>Disparos simultâneos</div>
            <div style={{ position: 'relative' }}>
              <select
                value={batchSize}
                onChange={e => setBatchSize(Number(e.target.value))}
                disabled={running}
                style={{ ...input, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
              >
                {[1, 5, 10, 20, 50, 100].map(n => (
                  <option key={n} value={n}>{n} por vez</option>
                ))}
              </select>
              <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <div style={label}>Intervalo entre lotes (ms)</div>
            <div style={{ position: 'relative' }}>
              <select
                value={delay}
                onChange={e => setDelay(Number(e.target.value))}
                disabled={running}
                style={{ ...input, appearance: 'none', paddingRight: 32, cursor: 'pointer' }}
              >
                {[0, 200, 500, 1000, 2000, 5000].map(n => (
                  <option key={n} value={n}>{n === 0 ? 'Sem intervalo' : `${n}ms`}</option>
                ))}
              </select>
              <ChevronDown size={14} color="#888" style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: 8 }}>
            <div style={label}>Estimativa</div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>
              {total > 0
                ? `~${Math.ceil(total / batchSize)} lotes × ${delay}ms = ~${((Math.ceil(total / batchSize) * delay) / 1000).toFixed(1)}s`
                : '—'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Botão de ação */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center' }}>
        {!running && !done && (
          <button
            onClick={startDisparo}
            disabled={!shortcode.trim() || !mensagem.trim() || total === 0}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10,
              background: (!shortcode.trim() || !mensagem.trim() || total === 0)
                ? '#E0E0E0'
                : 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)',
              color: '#fff', border: 'none',
              fontSize: 14, fontWeight: 600, cursor: (!token.trim() || !mensagem.trim() || total === 0) ? 'not-allowed' : 'pointer',
            }}
          >
            <Send size={15} /> Disparar {total > 0 ? `${total} SMS` : ''}
          </button>
        )}

        {running && (
          <button
            onClick={stopDisparo}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', borderRadius: 10,
              background: '#F44336', color: '#fff',
              border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            }}
          >
            <XCircle size={15} /> Parar disparo
          </button>
        )}

        {done && (
          <>
            <button
              onClick={resetDisparo}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 28px', borderRadius: 10,
                background: 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)',
                color: '#fff', border: 'none',
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <Upload size={15} /> Novo disparo
            </button>
            <button
              onClick={pollWebhooks}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', borderRadius: 10,
                border: '1.5px solid #E0E0E0', background: '#FAFAFA',
                fontSize: 13, fontWeight: 600, color: '#444', cursor: 'pointer',
              }}
            >
              <RefreshCw size={14} /> Atualizar status
            </button>
          </>
        )}

        {running && (
          <div style={{ fontSize: 13, color: '#888', display: 'flex', alignItems: 'center', gap: 6 }}>
            <RefreshCw size={13} style={{ animation: 'spin 1s linear infinite' }} />
            Enviando... {sent}/{total}
          </div>
        )}
      </div>

      {/* Stats */}
      {results.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
            <div style={statCard('#888888')}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.4 }}>Total</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A' }}>{total}</div>
            </div>
            <div style={statCard('#4CAF50')}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#4CAF50', textTransform: 'uppercase', letterSpacing: 0.4 }}>Entregues</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#4CAF50' }}>{delivered}</div>
            </div>
            <div style={statCard('#2196F3')}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#2196F3', textTransform: 'uppercase', letterSpacing: 0.4 }}>Enviados</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#2196F3' }}>{sent - delivered - failed}</div>
            </div>
            <div style={statCard('#F44336')}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#F44336', textTransform: 'uppercase', letterSpacing: 0.4 }}>Falhas</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#F44336' }}>{failed}</div>
            </div>
            <div style={statCard('#AAAAAA')}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#AAAAAA', textTransform: 'uppercase', letterSpacing: 0.4 }}>Pendentes</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#AAAAAA' }}>{pending}</div>
            </div>
          </div>

          {/* Barra de progresso */}
          {(running || done) && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ height: 6, background: '#F0F0EE', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${total > 0 ? (sent / total) * 100 : 0}%`,
                  background: 'linear-gradient(90deg, #E8450A, #FF6B35)',
                  borderRadius: 3,
                  transition: 'width 0.3s ease',
                }} />
              </div>
              <div style={{ fontSize: 11, color: '#888', marginTop: 4, textAlign: 'right' }}>
                {total > 0 ? `${Math.round((sent / total) * 100)}%` : '0%'} processado
              </div>
            </div>
          )}

          {/* Tabela de resultados */}
          <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F0EE', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Resultados do disparo</span>
              <span style={{ fontSize: 12, color: '#888' }}>Atualiza automaticamente via webhook</span>
            </div>

            <div style={{ maxHeight: 420, overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#FAFAFA' }}>
                    {['Número', 'Message ID', 'Status', 'Enviado em', 'Atualizado em'].map(h => (
                      <th key={h} style={{
                        padding: '10px 16px', textAlign: 'left',
                        fontSize: 11, fontWeight: 600, color: '#888888',
                        textTransform: 'uppercase', letterSpacing: 0.4,
                        borderBottom: '1px solid #F0F0EE', whiteSpace: 'nowrap',
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F8F8F8' }}>
                      <td style={{ padding: '10px 16px', fontSize: 13, fontFamily: 'monospace', color: '#1A1A1A' }}>
                        {r.number}
                      </td>
                      <td style={{ padding: '10px 16px', fontSize: 11, fontFamily: 'monospace', color: '#888' }}>
                        {r.messageId ?? '—'}
                      </td>
                      <td style={{ padding: '10px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          {statusIcon(r.status)}
                          <span style={{ fontSize: 12, fontWeight: 600, color: statusColor(r.status) }}>
                            {r.statusLabel}
                          </span>
                        </div>
                        {r.error && (
                          <div style={{ fontSize: 11, color: '#F44336', marginTop: 2 }}>{r.error}</div>
                        )}
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
        textarea:focus, input:focus, select:focus { border-color: #E8450A !important; outline: none; }
        input:disabled, textarea:disabled, select:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
