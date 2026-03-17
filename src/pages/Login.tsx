import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { access_token, user } = res.data;
      login(access_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Credenciais inválidas');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8f8f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, justifyContent: 'center' }}>
          <div style={{
            width: 36, height: 36,
            background: '#E8450A',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: 16,
          }}>T</div>
          <span style={{ fontWeight: 700, fontSize: 18, color: '#111', letterSpacing: -0.3 }}>TRUVILA</span>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: '36px 32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111', marginBottom: 6, letterSpacing: -0.4 }}>
            Bem-vindo de volta
          </h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
            Entre na sua conta para continuar
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, letterSpacing: 0.1 }}>
                E-mail
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #E8E8E8', borderRadius: 10,
                  fontSize: 14, color: '#111', background: '#FAFAFA',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = '#E8450A')}
                onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6, letterSpacing: 0.1 }}>
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '10px 14px',
                  border: '1.5px solid #E8E8E8', borderRadius: 10,
                  fontSize: 14, color: '#111', background: '#FAFAFA',
                  transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = '#E8450A')}
                onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
              />
            </div>

            {error && (
              <div style={{
                background: '#FEF2F2', border: '1px solid #FECACA',
                borderRadius: 8, padding: '10px 14px',
                fontSize: 13, color: '#DC2626',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 4,
                padding: '12px',
                background: loading ? '#ccc' : 'linear-gradient(135deg, #E8450A 0%, #FF6B35 100%)',
                color: '#fff',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: 0.2,
                transition: 'opacity 0.2s',
              }}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
          Não tem conta?{' '}
          <Link to="/register" style={{ color: '#E8450A', fontWeight: 600 }}>
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
