// ─── 野造 · 后台 Layout ───
import { AdminSidebar } from '@/components/layout/admin-sidebar'
import { AdminHeader } from '@/components/layout/admin-header'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex bg-clay-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:pl-64">
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
