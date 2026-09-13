import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-academy flex gap-10">
      <AdminSidebar />
      <div className="flex-1 py-10 min-w-0">{children}</div>
    </div>
  );
}
