import Layout from '../components/Layout';

export default function Placeholder({ title }: { title: string }) {
  return (
    <Layout>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100%', flexDirection: 'column', gap: 12,
      }}>
        <div style={{ fontSize: 40 }}>🚧</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>{title}</div>
        <div style={{ fontSize: 14, color: '#999' }}>Em breve disponível</div>
      </div>
    </Layout>
  );
}
