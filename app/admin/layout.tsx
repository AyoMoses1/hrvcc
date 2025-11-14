import { Header } from '@/components/layout/header';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-muted/40">
          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold">Admin Panel</h2>
            <nav className="space-y-2">
              <a
                href="/admin"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Dashboard
              </a>
              <a
                href="/admin/categories"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Categories
              </a>
              <a
                href="/admin/businesses"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Businesses
              </a>
              <a
                href="/admin/users"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Users
              </a>
              <a
                href="/admin/jobs"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Jobs
              </a>
              <a
                href="/admin/reports"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Reports
              </a>
              <a
                href="/admin/settings"
                className="block rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                Settings
              </a>
            </nav>
          </div>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </>
  );
}
