import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

export default async function TableViewPage({
  params,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    searchParams: _searchParams,
}: {
  params: { tableName: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { tableName } = params;

  // Security check
  const supabase = await createClient();
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

  // Fetch the dynamic table
  const adminSupabase = await createAdminClient();
  const { data, error } = await adminSupabase.from(tableName).select('*');

  if (error) {
    return (
      <p className="p-8 text-red-500">
        Error fetching data for table &apos;{tableName}&apos;: {error.message}
      </p>
    );
  }

  const headers = data && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="container mx-auto p-8">
      <Link
        href="/superadmin/database"
        className="text-sm text-blue-500 hover:underline mb-4 block"
      >
        &larr; Back to Tables
      </Link>
      <h1 className="text-3xl font-bold mb-1">
        Table:{' '}
        <span className="font-mono bg-muted p-1 rounded-md">{tableName}</span>
      </h1>
      <p className="text-muted-foreground mb-6">
        Displaying all rows. RLS is bypassed.
      </p>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>{header}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((row: Record<string, unknown>, rowIndex) => (
              <TableRow key={rowIndex}>
                {headers.map((header) => (
                  <TableCell
                    key={`${rowIndex}-${header}`}
                    className="font-mono text-xs"
                  >
                    {JSON.stringify(row[header])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
