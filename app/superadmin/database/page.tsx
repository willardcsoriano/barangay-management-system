import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DatabaseAdminPage() {
  // First, ensure only a superadmin can access this page
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { redirect('/superadmin-login'); }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'superadmin') { redirect('/protected'); }

  // Now, use the powerful admin client to fetch schema info
  const adminSupabase = await createAdminClient();

  const { data: tables, error } = await adminSupabase
    .from('pg_tables')
    .select('tablename')
    .eq('schemaname', 'public')
    .order('tablename');

  if (error) {
    return <p className="text-red-500">Error fetching tables: {error.message}</p>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Database Table Browser</h1>
      <p className="text-muted-foreground mb-6">Select a table to view its raw data. This tool bypasses all Row-Level Security.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tables.map((table) => (
          <Link
            href={`/superadmin/database/${table.tablename}`}
            key={table.tablename}
            className="block p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <h2 className="font-semibold">{table.tablename}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}