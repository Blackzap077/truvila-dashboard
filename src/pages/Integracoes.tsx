import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { smsRoutesApi } from '../api/client';
import { Radio, CheckSquare, Square, Save, RefreshCw } from 'lucide-react';

interface SmsRoute {
  id: string;
  key: string;
  name: string;
  shortcodes: string[];
  defaultShortcode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function Integracoes() {
  const qc = useQueryClient();

  const { data: routes = [], isLoading } = useQuery<SmsRoute[]>({
    queryKey: ['sms-routes'],
    queryFn: () => smsRoutesApi.list().then(r => r.data),
  });

  const [selectedRouteKey, setSelectedRouteKey] = useState<string | null>(null);
  const [selectedShortcode, setSelectedShortcode] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedRoute = routes.find(r => r.key === selectedRouteKey) ?? routes[0] ?? null;

  // Inicializa seleção com a primeira rota e seu shortcode padrão
  if (!selectedRouteKey && routes.length > 0) {
    setSelectedRouteKey(routes[0].key);
    setSelectedShortcode(routes[0].defaultShortcode);
  }

  const mutation = useMutation({
    mutationFn: ({ key, shortcodes, defaultShortcode }: { key: string; shortcodes: string[]; defaultShortcode: string }) =>
      smsRoutesApi.updateShortcodes(key, shortcodes, defaultShortcode),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['sms-routes'] });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    },
  });

  function handleRouteSelect(key: string) {
    setSelectedRouteKey(key);
    const route = routes.find(r => r.key === key);
    setSelectedShortcode(route?.defaultShortcode ?? route?.shortcodes[0] ?? null);
  }

  function handleSave() {
    if (!selectedRoute || !selectedShortcode) return;
    mutation.mutate({
      key: selectedRoute.key,
      shortcodes: selectedRoute.shortcodes,
      defaultShortcode: selectedShortcode,
    });
  }

  const cardStyle: React.CSSProperties = {
    background: '#fff',
    borderRadius: 12,
    border: '1.5px solid #F0F0EE',
    padding: '20px 24px',
    marginBottom: 16,
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 720 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1A1A1A', marginBottom: 4, letterSpacing: -0.3 }}>
          Integrações
        </h1>
        <p style={{ fontSize: 13, color: '#888' }}>
          Configure as rotas e remetentes (shortcodes) da Sintegrax para envio de SMS.
        </p>
      </div>

      {isLoading ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 13 }}>
          <RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} />
          Carregando rotas...
        </div>
      ) : (
        <>
          {/* Seleção de Rota */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Radio size={16} color="#E8450A" />
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Rota de envio</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {routes.map(route => {
                const isSelected = selectedRouteKey === route.key;
                return (
                  <button
                    key={route.key}
                    onClick={() => handleRouteSelect(route.key)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: 10,
                      border: isSelected ? '1.5px solid #E8450A' : '1.5px solid #EBEBEB',
                      background: isSelected ? '#FFF4F0' : '#FAFAFA',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      textAlign: 'left',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: isSelected ? '#E8450A' : '#1A1A1A', marginBottom: 3 }}>
                        {route.name}
                      </div>
                      <div style={{ fontSize: 12, color: '#888' }}>
                        {route.shortcodes.length} shortcode{route.shortcodes.length !== 1 ? 's' : ''} disponível{route.shortcodes.length !== 1 ? 'is' : ''}
                      </div>
                    </div>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: isSelected ? '5px solid #E8450A' : '2px solid #CCC',
                      background: '#fff',
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Seleção de Remetente */}
          {selectedRoute && (
            <div style={cardStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>Remetente (shortcode)</span>
              </div>
              <p style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
                Selecione o shortcode padrão para a rota <strong>{selectedRoute.name}</strong>.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {selectedRoute.shortcodes.map(sc => {
                  const isDefault = selectedShortcode === sc;
                  return (
                    <button
                      key={sc}
                      onClick={() => setSelectedShortcode(sc)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '12px 16px',
                        borderRadius: 10,
                        border: isDefault ? '1.5px solid #E8450A' : '1.5px solid #EBEBEB',
                        background: isDefault ? '#FFF4F0' : '#FAFAFA',
                        cursor: 'pointer',
                        transition: 'all 0.15s',
                        textAlign: 'left',
                      }}
                    >
                      {isDefault
                        ? <CheckSquare size={16} color="#E8450A" />
                        : <Square size={16} color="#BBBBBB" />
                      }
                      <div>
                        <span style={{ fontSize: 13, fontWeight: isDefault ? 600 : 400, color: isDefault ? '#E8450A' : '#333', fontFamily: 'monospace' }}>
                          {sc}
                        </span>
                        {isDefault && (
                          <span style={{
                            marginLeft: 8,
                            fontSize: 11, fontWeight: 600,
                            background: '#E8450A', color: '#fff',
                            borderRadius: 20, padding: '2px 8px',
                          }}>padrão</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Resumo + Salvar */}
          {selectedRoute && (
            <div style={{ ...cardStyle, background: '#FAFAFA', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>Configuração atual</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>
                  {selectedRoute.name}
                  <span style={{ color: '#888', fontWeight: 400, margin: '0 6px' }}>via</span>
                  <span style={{ fontFamily: 'monospace', color: '#E8450A' }}>{selectedShortcode}</span>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={mutation.isPending || !selectedShortcode}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 20px',
                  background: savedSuccess ? '#4CAF50' : mutation.isPending ? '#ccc' : 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)',
                  color: '#fff',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: mutation.isPending ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  flexShrink: 0,
                }}
              >
                {mutation.isPending
                  ? <><RefreshCw size={14} style={{ animation: 'spin 1s linear infinite' }} /> Salvando...</>
                  : savedSuccess
                    ? '✓ Salvo!'
                    : <><Save size={14} /> Salvar padrão</>
                }
              </button>
            </div>
          )}

          {mutation.isError && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#DC2626', marginTop: 8 }}>
              Erro ao salvar. Tente novamente.
            </div>
          )}
        </>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
