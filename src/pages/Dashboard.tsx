import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { Bell, Search, TrendingUp, MessageSquare, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/client';
import Layout from '../components/Layout';

// Fill 7 days (last 7) with zeros where no data
function buildWeeklyData(raw: any[]) {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const result: { day: string; enviados: number; otp: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso = d.toISOString().split('T')[0];
    const dayName = days[d.getDay()];
    const found = raw.find((r: any) => r.day === iso);
    result.push({
      day: dayName,
      enviados: found ? Number(found.enviados) : 0,
      otp: found ? Number(found.otp) : 0,
    });
  }
  return result;
}

function formatAction(action: string) {
  const map: Record<string, { label: string; color: string; icon: string }> = {
    SMS_SEND: { label: 'SMS Enviado', color: '#3B82F6', icon: '↑' },
    SMS_OTP_SEND: { label: 'OTP Enviado', color: '#F59E0B', icon: '🔑' },
    SMS_OTP_VERIFY: { label: 'OTP Verificado', color: '#10B981', icon: '✓' },
    SMS_RCS_SEND: { label: 'RCS Enviado', color: '#8B5CF6', icon: '↑' },
    SMS_CREDITS_CHECK: { label: 'Créditos Verificados', color: '#6B7280', icon: '💳' },
    SMS_CONSULT_CPF: { label: 'Consulta CPF', color: '#F59E0B', icon: '🔍' },
    SMS_CONSULT_PHONE: { label: 'Consulta Telefone', color: '#F59E0B', icon: '📞' },
    AUTH_LOGIN: { label: 'Login realizado', color: '#10B981', icon: '🔓' },
  };
  return map[action] || { label: action, color: '#999', icon: '•' };
}

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

  const todayIdx = new Date().getDay(); // 0=Sun
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const todayName = dayNames[todayIdx];

  return (
    <Layout>
      {/* Topbar — padding [18,24] space_between, exato do .pen */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 24px',
        borderRadius: '16px 16px 0 0',
        borderBottom: '1px solid #F0F0F0',
        background: '#fff',
        flexShrink: 0,
      }}>
        {/* pageTitle */}
        <span style={{
          fontSize: 22, fontWeight: 700, color: '#1A1A1A',
          fontFamily: 'Inter', letterSpacing: -0.3,
        }}>
          Bem-vindo de volta, {firstName}!
        </span>

        {/* topRight — gap 12, alignItems center */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>

          {/* searchBox — width 200, fill #fff, cornerRadius 20, gap 8, padding [10,16] */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            width: 200, background: '#FFFFFF',
            borderRadius: 20, padding: '10px 16px',
            border: '1px solid #F0F0EE',
          }}>
            <Search size={14} color="#AAAAAA" strokeWidth={1.8} />
            <input
              placeholder="Buscar algo..."
              style={{
                border: 'none', background: 'transparent',
                fontSize: 12, color: '#BBBBBB', width: '100%',
                fontFamily: 'Inter',
              }}
            />
          </div>

          {/* createBtn — gradient laranja, cornerRadius 10, padding [10,20] */}
          <button style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '10px 20px',
            background: 'linear-gradient(157deg, #ff917b 0%, #f9755b 17%, #ff5c3c 31%, #ff4e2b 100%)',
            color: '#fff', borderRadius: 10,
            fontSize: 13, fontWeight: 600, fontFamily: 'Inter',
            border: 'none', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            Nova Campanha
          </button>

          {/* bellBtn — width 36, height 36, fill #fff, cornerRadius 18 */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#FFFFFF', border: '1px solid #F0F0EE',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
          }}>
            <Bell size={16} color="#888888" strokeWidth={1.8} />
          </div>

          {/* avatarBox — ellipse 36×36, fill #C4B5A5 */}
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#C4B5A5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 14,
            fontFamily: 'Inter', cursor: 'pointer', flexShrink: 0,
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px', display: 'flex', gap: 16 }}>

        {/* Left: main content */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Resumo Geral */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Resumo Geral</div>
                <div style={{ fontSize: 11.5, color: '#999', marginTop: 2 }}>Acumulado desde o início</div>
              </div>
              <div style={{
                background: '#F5F5F5', borderRadius: 20,
                padding: '5px 12px', fontSize: 12, color: '#555', fontWeight: 500,
              }}>
                Todo período
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <MetricCard
                icon={<TrendingUp size={16} color="#E8450A" />}
                iconBg="#FFF4F0"
                label="SMS Enviados"
                value={isLoading ? '—' : (stats?.smsSent ?? 0).toLocaleString('pt-BR')}
                sub="disparos totais"
                subColor="#10B981"
              />
              <MetricCard
                icon={<MessageSquare size={16} color="#3B82F6" />}
                iconBg="#EFF6FF"
                label="OTP Verificados"
                value={isLoading ? '—' : (stats?.otpVerified ?? 0).toLocaleString('pt-BR')}
                sub="verificações ok"
                subColor="#3B82F6"
              />
              <MetricCard
                icon={<Users size={16} color="#10B981" />}
                iconBg="#F0FDF4"
                label="OTP Enviados"
                value={isLoading ? '—' : (stats?.otpSent ?? 0).toLocaleString('pt-BR')}
                sub="códigos gerados"
                subColor="#10B981"
              />
            </div>
          </div>

          {/* Visão de Disparos — Bar Chart */}
          <div style={{
            background: '#fff', borderRadius: 16, padding: '20px 24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#111' }}>Visão de Disparos</div>
              <div style={{ fontSize: 11.5, color: '#999' }}>Últimos 7 dias</div>
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: '#111', letterSpacing: -1, marginBottom: 16 }}>
              {totalDisparos.toLocaleString('pt-BR')}
              <span style={{ fontSize: 13, fontWeight: 500, color: '#aaa', marginLeft: 6 }}>disparos</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={weeklyData} barSize={22} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11, fill: '#bbb' }}
                  axisLine={false} tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#bbb' }}
                  axisLine={false} tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #F0F0F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                />
                <Bar dataKey="enviados" name="SMS" radius={[4,4,0,0]}>
                  {weeklyData.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={entry.day === todayName ? '#E8450A' : '#F0F0F0'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column: Atividade Recente */}
        <div style={{ width: 280, flexShrink: 0 }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.03)',
            height: '100%',
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#111', marginBottom: 16 }}>
              Atividade Recente
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', color: '#bbb', fontSize: 12, paddingTop: 40 }}>
                Carregando...
              </div>
            ) : recentActivity.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#bbb', fontSize: 12, paddingTop: 40 }}>
                Nenhuma atividade ainda
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {recentActivity.slice(0, 10).map((ev: any, i: number) => {
                  const fmt = formatAction(ev.action);
                  return (
                    <div key={ev.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 0',
                      borderBottom: i < recentActivity.slice(0, 10).length - 1 ? '1px solid #F8F8F8' : 'none',
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
                        background: fmt.color + '15',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14,
                      }}>
                        {fmt.icon}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#111' }}>
                          {fmt.label}
                        </div>
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 1 }}>
                          {new Date(ev.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          {' · '}
                          {new Date(ev.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                        </div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: fmt.color, flexShrink: 0 }} />
                    </div>
                  );
                })}
              </div>
            )}

            {recentActivity.length > 0 && (
              <button style={{
                width: '100%', marginTop: 16,
                padding: '9px', border: '1.5px solid #F0F0F0', borderRadius: 10,
                fontSize: 12.5, color: '#555', fontWeight: 600,
                background: '#fff',
              }}>
                Ver tudo
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function MetricCard({
  icon, iconBg, label, value, sub, subColor,
}: {
  icon: React.ReactNode; iconBg: string;
  label: string; value: string; sub: string; subColor?: string;
}) {
  return (
    <div style={{
      flex: 1,
      border: '1.5px solid #F3F3F3', borderRadius: 12, padding: '14px 16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8, background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {icon}
        </div>
        <span style={{ fontSize: 12, color: '#999', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 24, fontWeight: 800, color: '#111', letterSpacing: -0.8 }}>
        {value}
      </div>
      <div style={{ fontSize: 11.5, color: subColor || '#10B981', marginTop: 4, fontWeight: 500 }}>
        ↑ {sub}
      </div>
    </div>
  );
}
