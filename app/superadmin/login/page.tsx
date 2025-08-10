// C:\Users\Willard\barangay-management-system\app\superadmin\login\page.tsx

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Now searchParams is a Promise of the query object
type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function SuperAdminLoginPage({ searchParams }: Props) {
  // Wait for the actual search params object
  const params = await searchParams;
  const rawError = params.error;
  const errorMessage = Array.isArray(rawError) ? rawError[0] : rawError;

  const logIn = async (formData: FormData) => {
    'use server';
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const supabase = await createClient();

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return redirect(
        '/superadmin-login?error=Could not authenticate user. Please check your credentials.'
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return redirect(
        '/superadmin-login?error=Authentication failed. Please try again.'
      );
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      return redirect(
        '/superadmin-login?error=Authentication failed: Could not find user profile.'
      );
    }

    if (profile.role !== 'superadmin') {
      await supabase.auth.signOut();
      return redirect(
        '/superadmin-login?error=Access Denied: You are not a super admin.'
      );
    }

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
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@example.com"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {errorMessage && (
              <p className="p-2 bg-red-100 text-red-700 text-sm rounded-md text-center">
                {errorMessage}
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
