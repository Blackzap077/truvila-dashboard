import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    if (form.password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const payload: any = { name: form.name, email: form.email, password: form.password };
      if (form.phone) payload.phone = form.phone;
      await authApi.register(payload);
      // After register, login automatically
      const loginRes = await authApi.login({ email: form.email, password: form.password });
      const { access_token, user } = loginRes.data;
      login(access_token, user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E8E8E8', borderRadius: 10,
    fontSize: 14, color: '#111', background: '#FAFAFA',
    transition: 'border-color 0.2s',
  };

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
            Criar sua conta
          </h1>
          <p style={{ fontSize: 14, color: '#888', marginBottom: 28 }}>
            Comece agora — é grátis para testar
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Nome completo
              </label>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="João Silva"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E8450A')}
                onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                E-mail
              </label>
              <input
                type="email"
                value={form.email}
                onChange={e => set('email', e.target.value)}
                placeholder="seu@email.com"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E8450A')}
                onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Telefone <span style={{ color: '#aaa', fontWeight: 400 }}>(opcional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+55 11 99999-9999"
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E8450A')}
                onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Senha
              </label>
              <input
                type="password"
                value={form.password}
                onChange={e => set('password', e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
                onFocus={e => (e.target.style.borderColor = '#E8450A')}
                onBlur={e => (e.target.style.borderColor = '#E8E8E8')}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#555', marginBottom: 6 }}>
                Confirmar senha
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={e => set('confirmPassword', e.target.value)}
                placeholder="••••••••"
                required
                style={inputStyle}
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
              }}
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
          Já tem conta?{' '}
          <Link to="/login" style={{ color: '#E8450A', fontWeight: 600 }}>
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
