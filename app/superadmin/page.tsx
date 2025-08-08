import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import Link from 'next/link'; // <-- Add this new import

export default async function SuperAdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/superadmin-login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error.message);
    redirect('/'); 
  }
  
  if (profile?.role !== 'superadmin') {
    redirect('/protected');
  }

  const signOut = async () => {
    'use server';
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/');
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <form action={signOut}>
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </div>
      <p className="text-muted-foreground">
        Welcome, Super Admin. From here, you can manage the entire system.
      </p>

      {/* --- NEW SECTION ADDED BELOW --- */}

      <div className="mt-8 p-6 border bg-card text-card-foreground rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-2">System Management</h2>
        <p className="text-muted-foreground mb-4">
          Access raw data tables for advanced administrative tasks. Use with caution.
        </p>
        <Button asChild>
          <Link href="/superadmin/database">Browse Database Tables</Link>
        </Button>
      </div>
      
    </div>
  );
}