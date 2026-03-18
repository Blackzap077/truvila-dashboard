import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Integracoes from './pages/Integracoes';
import Disparos from './pages/Disparos';
import Placeholder from './pages/Placeholder';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/contatos" element={<PrivateRoute><Placeholder title="Contatos" /></PrivateRoute>} />
      <Route path="/campanhas" element={<PrivateRoute><Placeholder title="Campanhas" /></PrivateRoute>} />
      <Route path="/disparos" element={<PrivateRoute><Disparos /></PrivateRoute>} />
      <Route path="/automacoes" element={<PrivateRoute><Placeholder title="Automações" /></PrivateRoute>} />
      <Route path="/relatorios" element={<PrivateRoute><Placeholder title="Relatórios" /></PrivateRoute>} />
      <Route path="/integracoes" element={<PrivateRoute><Integracoes /></PrivateRoute>} />
      <Route path="/financeiro" element={<PrivateRoute><Placeholder title="Financeiro" /></PrivateRoute>} />
      <Route path="/suporte" element={<PrivateRoute><Placeholder title="Suporte" /></PrivateRoute>} />
      <Route path="/configuracoes" element={<PrivateRoute><Placeholder title="Configurações" /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
