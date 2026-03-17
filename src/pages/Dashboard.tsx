import { useQuery } from '@tanstack/react-query';
// recharts not used — custom bars
import { Bell, Search, Wallet, Award, Users, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/client';
import Layout from '../components/Layout';

/* ─── helpers ─────────────────────────────────────────────── */

function buildWeeklyData(raw: any[]) {
  const labels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const result: { day: string; enviados: number; otp: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const found = raw.find((r: any) => r.day === iso);
    result.push({
      day: labels[d.getDay()],
      enviados: found ? Number(found.enviados) : 0,
      otp: found ? Number(found.otp) : 0,
    });
  }
  return result;
}

const ACTION_MAP: Record<string, { label: string; color: string; sub: string }> = {
  SMS_SEND:          { label: 'SMS Enviado',          color: '#4CAF50', sub: 'Disparo de mensagem' },
  SMS_OTP_SEND:      { label: 'OTP Enviado',          color: '#E8450A', sub: 'Código de verificação' },
  SMS_OTP_VERIFY:    { label: 'OTP Verificado',       color: '#4CAF50', sub: 'Verificação bem-sucedida' },
  SMS_RCS_SEND:      { label: 'RCS Enviado',          color: '#2060C0', sub: 'Mensagem rica' },
  SMS_CREDITS_CHECK: { label: 'Créditos Verificados', color: '#2060C0', sub: 'Consulta de saldo' },
  SMS_CONSULT_CPF:   { label: 'Consulta CPF',         color: '#E8450A', sub: 'Verificação de documento' },
  SMS_CONSULT_PHONE: { label: 'Consulta Telefone',    color: '#E8450A', sub: 'Verificação de número' },
  AUTH_LOGIN:        { label: 'Login realizado',      color: '#4CAF50', sub: 'Acesso à plataforma' },
};

function getAction(action: string) {
  return ACTION_MAP[action] ?? { label: action, color: '#AAAAAA', sub: '—' };
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h}h`;
  return `há ${Math.floor(h / 24)}d`;
}

/* ─── component ───────────────────────────────────────────── */

export default function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'você';

  const { data: stats, isLoading } = useQuery({
    queryKey: ['user-stats'],
    queryFn: () => userApi.stats().then(r => r.data),
    refetchInterval: 60_000,
    retry: false,
  });

  const weeklyData = buildWeeklyData(stats?.smsDaily ?? []);
  const totalDisparos = weeklyData.reduce((s, d) => s + d.enviados + d.otp, 0);
  const recentActivity: any[] = stats?.recentActivity ?? [];

  const todayLabel = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][new Date().getDay()];

  // bar heights proportional (max bar = 140px like .pen bar5)
  const maxVal = Math.max(...weeklyData.map(d => d.enviados + d.otp), 1);
  const barHeights = weeklyData.map(d => Math.max(8, Math.round(((d.enviados + d.otp) / maxVal) * 140)));

  return (
    <Layout>
      {/* ── Topbar (EMyYT) ── cornerRadius [16,16,0,0], stroke bottom 1, padding [18,24] */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px',
        borderRadius: '16px 16px 0 0',
        borderBottom: '1px solid #E8E8E8',
        background: '#fff',
        flexShrink: 0,
      }}>
        {/* pageTitle */}
        <span style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter' }}>
          Bem-vindo de volta, {firstName}!
        </span>

        {/* topRight — gap 12 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* searchBox — width 200, #fff, r20, gap 8, padding [10,16] */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: 200, background: '#FFFFFF', borderRadius: 20,
            padding: '10px 16px', border: '1px solid #EFEFED',
          }}>
            <Search size={14} color="#AAAAAA" strokeWidth={1.8} />
            <input placeholder="Buscar algo..." style={{
              border: 'none', background: 'transparent',
              fontSize: 12, color: '#1A1A1A', width: '100%', fontFamily: 'Inter',
            }} />
          </div>

          {/* createBtn — gradient laranja, r10, padding [10,20] */}
          <button style={{
            padding: '10px 20px',
            background: 'linear-gradient(157deg, #ff917b 0%, #f9755b 17%, #ff5c3c 31%, #ff4e2b 100%)',
            color: '#fff', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'Inter',
            border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
          }}>
            Nova Campanha
          </button>

          {/* bellBtn — 36×36, #fff, r18 */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#FFFFFF', border: '1px solid #EFEFED',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <Bell size={16} color="#888888" strokeWidth={1.8} />
          </div>

          {/* avatarBox — ellipse 36×36, #C4B5A5 */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%', background: '#C4B5A5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'Inter',
            cursor: 'pointer', flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* ── Content (nyXA7) — padding [0,16,16,16], gap 16, horizontal ── */}
      <div style={{
        display: 'flex', gap: 16,
        padding: '0 16px 16px 16px',
        flex: 1, overflow: 'hidden', minHeight: 0,
      }}>

        {/* ── Center (900kX) — fill_container vertical, gap 16 ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', gap: 16,
          minWidth: 0, paddingTop: 16,
        }}>

          {/* ── Overall Summary (I4dsk) — #fff, r16, stroke #EFEFED, shadow 0 4 6 #00000040, gap 16, padding 20 ── */}
          <div style={{
            background: '#FFFFFF', borderRadius: 16,
            border: '1px solid #EFEFED',
            boxShadow: '0 4px 6px rgba(0,0,0,0.25)',
            display: 'flex', flexDirection: 'column', gap: 16, padding: 20,
          }}>
            {/* summaryHead — space_between, center */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter' }}>
                Resumo Geral
              </span>
              {/* periodBtn — r20, stroke #E0E0E0, gap 6, padding [6,12] */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                borderRadius: 20, border: '1px solid #E0E0E0',
                padding: '6px 12px', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 12, color: '#666666', fontFamily: 'Inter' }}>Último mês</span>
                <ChevronDown size={12} color="#888888" strokeWidth={1.8} />
              </div>
            </div>

            {/* metricsRow — #f9f9f9, r16, stroke #dedede, gap 12, padding 10 */}
            <div style={{
              display: 'flex', gap: 12,
              background: '#f9f9f9', borderRadius: 16,
              border: '1px solid #dedede', padding: 10,
            }}>
              {/* metricBalance — fill_container, h120, #f9f9f9, r16, stroke, vertical, gap 12, padding 20, justifyCenter */}
              <MetricCard
                bg="#f9f9f9"
                icon={<Wallet size={14} color="#888888" strokeWidth={1.8} />}
                label="Receita"
                value={isLoading ? '—' : `${(stats?.smsSent ?? 0).toLocaleString('pt-BR')} SMS`}
                badge={{ pct: '16.8%', up: true }}
              />
              {/* metricAchieve — #fff, r16, stroke, vertical, gap 12, padding 20, center */}
              <MetricCard
                bg="#FFFFFF"
                center
                icon={<Award size={14} color="#888888" strokeWidth={1.8} />}
                label="Taxa de Entrega"
                value={isLoading ? '—' : (() => { const sent = stats?.smsSent ?? 0; const ver = stats?.otpVerified ?? 0; return `${sent > 0 && ver > 0 ? Math.round((ver / sent) * 100) : 98}%`; })()}
              />
              {/* metricCust — #f9f9f9, r16, stroke, vertical, gap 12, padding 20 */}
              <MetricCard
                bg="#f9f9f9"
                icon={<Users size={14} color="#888888" strokeWidth={1.8} />}
                label="Contatos"
                value={isLoading ? '—' : (stats?.otpSent ?? 0).toLocaleString('pt-BR')}
                badge={{ pct: '06.8%', up: false }}
              />
            </div>
          </div>

          {/* ── Sales Overview (UncG2) — #fff, r16, stroke #EFEFED, vertical, gap 16, padding 20 ── */}
          <div style={{
            background: '#FFFFFF', borderRadius: 16,
            border: '1px solid #EFEFED',
            display: 'flex', flexDirection: 'column', gap: 16, padding: 20,
            flex: 1,
          }}>
            {/* salesHead */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter' }}>
                Visão de Disparos
              </span>
              {/* periodBtn2 */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                borderRadius: 20, border: '1px solid #E0E0E0',
                padding: '6px 12px', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 12, color: '#666666', fontFamily: 'Inter' }}>Últimos 7 dias</span>
                <ChevronDown size={12} color="#888888" strokeWidth={1.8} />
              </div>
            </div>

            {/* salesStats — vertical, gap 4 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {/* salesValue */}
              <span style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter' }}>
                {totalDisparos >= 1000
                  ? `${(totalDisparos / 1000).toFixed(1)}k`
                  : totalDisparos.toString()}
              </span>
              {/* salesBadgeRow */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {/* salesBadge — #E8F5E9, r12, gap 4, padding [4,10] */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  background: '#E8F5E9', borderRadius: 12, padding: '4px 10px',
                }}>
                  <TrendingUp size={10} color="#4CAF50" strokeWidth={2} />
                  <span style={{ fontSize: 10, fontWeight: 600, color: '#4CAF50', fontFamily: 'Inter' }}>36.8%</span>
                </div>
                <span style={{ fontSize: 12, color: '#AAAAAA', fontFamily: 'Inter' }}>vs. mês anterior</span>
              </div>
            </div>

            {/* Chart (BsCc6) — fill_container, h160, gap 8, alignItems end */}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 8,
              height: 160, width: '100%',
            }}>
              {weeklyData.map((d, i) => {
                const isToday = d.day === todayLabel;
                const h = barHeights[i];
                return (
                  /* barW — fill_container, fill_container, vertical, gap 6, justifyEnd, center */
                  <div key={i} style={{
                    flex: 1, height: '100%',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'flex-end', gap: 6,
                  }}>
                    {/* bar rect — fill_container width, h varies, r [6,6,0,0] */}
                    <div style={{
                      width: '100%', height: h,
                      background: isToday ? '#E8450A' : '#F5C4B8',
                      borderRadius: '6px 6px 0 0',
                    }} />
                    {/* bar label */}
                    <span style={{
                      fontSize: 10, color: '#AAAAAA', fontFamily: 'Inter',
                      fontWeight: isToday ? 700 : 400,
                    }}>{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Right Column (wMAUA) — width 280, vertical, gap 16 ── */}
        <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>

          {/* Recent Activity (XlYVj) — fill_container w, h557, #fff, r16, stroke #EFEFED, vertical, gap 14, padding 18 */}
          <div style={{
            flex: 1, background: '#FFFFFF', borderRadius: 16,
            border: '1px solid #EFEFED',
            display: 'flex', flexDirection: 'column', gap: 14, padding: 18,
            overflow: 'hidden',
          }}>
            {/* actTitle */}
            <span style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter', flexShrink: 0 }}>
              Transações Recentes
            </span>

            {/* activity list */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 0 }}>
              {isLoading ? (
                <div style={{ textAlign: 'center', color: '#AAAAAA', fontSize: 12, paddingTop: 32 }}>
                  Carregando...
                </div>
              ) : recentActivity.length === 0 ? (
                <EmptyActivity />
              ) : (
                recentActivity.slice(0, 8).map((ev: any, i: number) => {
                  const act = getAction(ev.action);
                  const isLast = i === Math.min(recentActivity.length, 8) - 1;
                  return (
                    <div key={ev.id}>
                      {/* act row — gap 10 */}
                      <div style={{ display: 'flex', gap: 10, padding: '0 0 12px' }}>
                        {/* avatar ellipse 32×32 */}
                        <div style={{
                          width: 32, height: 32, borderRadius: '50%',
                          background: act.color, flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontSize: 12, fontWeight: 700,
                        }}>
                          {ev.action[0]}
                        </div>
                        {/* body — vertical, gap 3 */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {/* header — space_between, center */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter' }}>
                              {act.label}
                            </span>
                            <span style={{ fontSize: 10, color: '#AAAAAA', fontFamily: 'Inter', whiteSpace: 'nowrap' }}>
                              {timeAgo(ev.createdAt)}
                            </span>
                            {/* dot */}
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4CAF50', flexShrink: 0 }} />
                          </div>
                          {/* action text */}
                          <span style={{
                            fontSize: 11, color: '#666666', fontFamily: 'Inter',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                          }}>
                            {act.sub}
                          </span>
                          {/* comment */}
                          <span style={{ fontSize: 11, color: '#888888', fontFamily: 'Inter' }}>
                            {new Date(ev.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      {/* divider */}
                      {!isLast && (
                        <div style={{ height: 1, background: '#F5F5F5', marginBottom: 12 }} />
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* seeAllBtn — fill_container, r20, stroke #E0E0E0, padding [10,0], center */}
            {recentActivity.length > 0 && (
              <button style={{
                width: '100%', padding: '10px 0',
                borderRadius: 20, border: '1px solid #E0E0E0',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: 12, color: '#555555', fontFamily: 'Inter' }}>Ver tudo</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

/* ─── MetricCard ─── */
function MetricCard({
  bg, icon, label, value, badge, center,
}: {
  bg: string; icon: React.ReactNode;
  label: string; value: string;
  badge?: { pct: string; up: boolean };
  center?: boolean;
}) {
  return (
    /* fill_container, h120, r16, stroke, vertical, gap 12, padding 20, justifyCenter */
    <div style={{
      flex: 1, height: 120, background: bg,
      borderRadius: 16, border: '1px solid #E8E8E8',
      display: 'flex', flexDirection: 'column', gap: 12, padding: 20,
      justifyContent: 'center',
      alignItems: center ? 'center' : 'flex-start',
    }}>
      {/* label row — gap 6, center */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        {icon}
        <span style={{ fontSize: 12, color: '#888888', fontFamily: 'Inter' }}>{label}</span>
      </div>
      {/* value row — gap 12, center */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: center ? 'center' : 'flex-start' }}>
        <span style={{ fontSize: 32, fontWeight: 700, color: '#1A1A1A', fontFamily: 'Inter', lineHeight: 1 }}>
          {value}
        </span>
        {badge && (
          /* sideInfo — vertical, gap 4 */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
            {/* badge pill */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: badge.up ? '#E8F5E9' : '#FFEBEE',
              borderRadius: 12, padding: '3px 6px',
            }}>
              {badge.up
                ? <TrendingUp size={8} color="#4CAF50" strokeWidth={2} />
                : <TrendingDown size={8} color="#FF5252" strokeWidth={2} />
              }
              <span style={{ fontSize: 9, fontWeight: 600, color: badge.up ? '#4CAF50' : '#FF5252', fontFamily: 'Inter' }}>
                {badge.pct}
              </span>
            </div>
            <span style={{ fontSize: 9, color: '#AAAAAA', fontFamily: 'Inter' }}>vs. mês anterior</span>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyActivity() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8, paddingTop: 32,
    }}>
      <span style={{ fontSize: 11, color: '#AAAAAA', fontFamily: 'Inter', textAlign: 'center' }}>
        Nenhuma atividade registrada ainda
      </span>
    </div>
  );
}
