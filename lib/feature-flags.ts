import { createClient } from '@/lib/supabase/server';

// This function checks the database and returns a list of enabled feature keys.
export async function getEnabledFeaturesForCurrentUser() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return new Set<string>(); // Return no features if not logged in

  // First, get the user's barangay_id from their profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('barangay_id')
    .eq('id', user.id)
    .single();

  if (!profile?.barangay_id) return new Set<string>(); // No features if no barangay

  // Now, get all enabled features for that barangay
  const { data: features } = await supabase
    .from('barangay_features')
    .select('feature_key')
    .eq('barangay_id', profile.barangay_id)
    .eq('is_enabled', true);

  // Return the feature keys as a Set for fast lookups (e.g., enabledFeatures.has('permits'))
  return new Set(features?.map(f => f.feature_key) || []);
}