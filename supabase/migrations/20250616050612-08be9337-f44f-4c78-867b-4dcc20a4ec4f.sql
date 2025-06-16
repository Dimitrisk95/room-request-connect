
-- First, disable RLS temporarily to clear everything safely
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on users table to start fresh
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;

-- Drop the problematic function
DROP FUNCTION IF EXISTS public.get_auth_user_id();

-- Create a simple, non-recursive security definer function
CREATE OR REPLACE FUNCTION public.auth_user_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies
CREATE POLICY "users_can_view_own_profile" ON public.users
  FOR SELECT 
  USING (id = public.auth_user_id());

CREATE POLICY "users_can_insert_own_profile" ON public.users
  FOR INSERT 
  WITH CHECK (id = public.auth_user_id());

CREATE POLICY "users_can_update_own_profile" ON public.users
  FOR UPDATE 
  USING (id = public.auth_user_id());
