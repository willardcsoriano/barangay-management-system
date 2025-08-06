// C:\Users\Willard\barangay-management-system\app\superadmin\page.tsx
// UPDATED WITH LOGOUT BUTTON

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button'; // <-- Add the import for your button

export default async function SuperAdminPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/superadmin/login');
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

  // This is the Server Action for logging out
  const signOut = async () => {
    'use server';

    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect('/'); // Redirect to homepage after logout
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        {/* The logout button is inside a form that calls the signOut action */}
        <form action={signOut}>
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </div>
      <p>Welcome, Super Admin. From here, you can manage the entire system.</p>
      
      {/* SOON, YOU WILL ADD YOUR COMPONENTS HERE, FOR EXAMPLE:
        <PendingUsersTable />
        <AnnouncementsManager />
        <BlotterReportsList />
      */}
    </div>
  );
}