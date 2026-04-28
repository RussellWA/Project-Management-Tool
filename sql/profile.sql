CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policy: Anyone logged in can read profiles (so you can see your teammates)
CREATE POLICY "Logged in users can view profiles"
ON profiles FOR SELECT
USING (auth.role() = 'authenticated');

-- Policy: Users can only update their OWN profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

-- 1. Define the automation function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, name)
  VALUES (
    new.id, 
    split_part(new.email, '@', 1), -- Magic: Extracts "russell" from the email
    split_part(new.email, '@', 1)  -- Sets their full name to "russell" as a default
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Attach the function to the Auth table
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();