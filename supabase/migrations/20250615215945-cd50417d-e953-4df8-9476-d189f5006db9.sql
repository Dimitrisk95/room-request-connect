
-- Drop the problematic policies that are causing infinite recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;

-- Recreate safe RLS policies using the existing security definer function
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT 
  USING (id = public.get_current_user_id());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE 
  USING (id = public.get_current_user_id());

-- Allow insert for new user registration (handled by auth triggers)
CREATE POLICY "Allow user registration" ON public.users
  FOR INSERT 
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
