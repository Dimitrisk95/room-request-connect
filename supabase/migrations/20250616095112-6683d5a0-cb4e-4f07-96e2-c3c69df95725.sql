
-- Completely disable RLS on users table temporarily
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies to ensure clean slate
DROP POLICY IF EXISTS "users_can_view_own_profile" ON public.users;
DROP POLICY IF EXISTS "users_can_insert_own_profile" ON public.users;
DROP POLICY IF EXISTS "users_can_update_own_profile" ON public.users;

-- Drop all auth-related functions to avoid conflicts
DROP FUNCTION IF EXISTS public.auth_user_id();
DROP FUNCTION IF EXISTS public.get_auth_user_id();
