// app/page.tsx
import { createClient } from '@/lib/supabase/server';
import HomeUI from '@/components/homepage/HomeUI';

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('barangays')
    .select('id, name')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching barangays:', error);
    // you could also render a fallback UI here
  }

  // coerce null -> empty array
  const barangaysList = data ?? [];

  return <HomeUI barangays={barangaysList} />;
}
