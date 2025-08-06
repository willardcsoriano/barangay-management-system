// C:\Users\Willard\barangay-management-system\app\superadmin-login\page.tsx
// NEW "START FROM SCRATCH" VERSION USING A SERVER ACTION

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server'; // Assuming you have this helper
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// The page component is now a Server Component. It reads the URL for any error messages.
export default function SuperAdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {

  // This is the Server Action. It will run on the server when the form is submitted.
  const logIn = async (formData: FormData) => {
    'use server';

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    // const cookieStore = cookies(); // This line is no longer needed

    // CORRECTED: Call createClient without arguments
    const supabase = await createClient();

    // 1. Attempt to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return redirect('/superadmin-login?error=Could not authenticate user. Please check your credentials.');
    }
    
    // Re-fetch user to confirm session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return redirect('/superadmin-login?error=Authentication failed. Please try again.');
    }

    // 2. Check for the user's profile and role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut(); // Important: Sign out if profile is missing/inaccessible
      return redirect('/superadmin-login?error=Authentication failed: Could not find user profile.');
    }

    // 3. Check if the role is 'superadmin'
    if (profile.role !== 'superadmin') {
      await supabase.auth.signOut(); // Important: Sign out if role is incorrect
      return redirect('/superadmin-login?error=Access Denied: You are not a super admin.');
    }

    // 4. Success! Redirect to the dashboard.
    return redirect('/superadmin');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-full max-w-md p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Super Admin Login</CardTitle>
          <CardDescription>Access your exclusive admin portal</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={logIn} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="admin@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {searchParams.error && (
              <p className="p-2 bg-red-100 text-red-700 text-sm rounded-md text-center">
                {searchParams.error}
              </p>
            )}
            <Button type="submit" className="w-full">
              Login as Super Admin
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}