// This is a passthrough layout. The login page (/admin/login) uses this directly
// with no shell. Authenticated admin routes live under app/admin/(shell)/ which
// has its own layout.tsx that enforces auth and renders the sidebar.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
