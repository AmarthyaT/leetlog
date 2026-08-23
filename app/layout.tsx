import Sidebar from '@/components/Sidebar'

export const dynamic = 'force-dynamic'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: 32, overflowY: 'auto', marginLeft: 220 }}>
        {children}
      </main>
    </div>
  )
}