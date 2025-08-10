import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function DatabaseTablesPage() {
  const supabase = await createClient();

  // Security check: Ensure user is a logged-in superadmin
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect('/superadmin-login');
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  if (profile?.role !== 'superadmin') {
    redirect('/protected');
  }
  // --- End of security check ---

  // Call the new SQL function to get the table list
  const { data: tables, error } = await supabase.rpc('get_public_tables');

  if (error) {
    return (
      <p className="p-8 text-red-500">
        Error fetching tables: {error.message}
      </p>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <Link
        href="/superadmin"
        className="text-sm text-blue-500 hover:underline mb-4 block"
      >
        &larr; Back to Dashboard
      </Link>
      <h1 className="text-3xl font-bold mb-6">Database Tables</h1>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Table Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables?.map((table) => (
              <TableRow key={table.table_name}>
                <TableCell>
                  <Link
                    href={`/superadmin/database/${table.table_name}`}
                    className="font-mono text-blue-600 hover:underline"
                  >
                    {table.table_name}
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}