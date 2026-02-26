-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: families
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: family_members
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(family_id, user_id)
);

-- Table: expenses
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  category TEXT NOT NULL,
  amount INTEGER NOT NULL,
  note TEXT,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: categories (optional, for custom categories)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_family_members_user_id ON family_members(user_id);
CREATE INDEX idx_family_members_family_id ON family_members(family_id);
CREATE INDEX idx_expenses_family_id ON expenses(family_id);
CREATE INDEX idx_expenses_user_id ON expenses(user_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_families_invite_code ON families(invite_code);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- RLS Policies for families
CREATE POLICY "Anyone can view families by invite code"
ON families FOR SELECT
USING (true);

CREATE POLICY "Members can view their families"
ON families FOR SELECT
USING (
  id IN (
    SELECT family_id FROM family_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Users can create families"
ON families FOR INSERT
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their families"
ON families FOR UPDATE
USING (owner_id = auth.uid());

-- RLS Policies for family_members
CREATE POLICY "Members can view family members"
ON family_members FOR SELECT
USING (
  family_id IN (
    SELECT family_id FROM family_members fm
    WHERE fm.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join families"
ON family_members FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own membership"
ON family_members FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can leave families"
ON family_members FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for expenses
CREATE POLICY "Members can view family expenses"
ON expenses FOR SELECT
USING (
  family_id IN (
    SELECT family_id FROM family_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Members can insert expenses to their families"
ON expenses FOR INSERT
WITH CHECK (
  family_id IN (
    SELECT family_id FROM family_members
    WHERE user_id = auth.uid()
  )
  AND user_id = auth.uid()
);

CREATE POLICY "Users can update own expenses"
ON expenses FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own expenses"
ON expenses FOR DELETE
USING (user_id = auth.uid());

-- RLS Policies for categories
CREATE POLICY "Members can view family categories"
ON categories FOR SELECT
USING (
  family_id IN (
    SELECT family_id FROM family_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Members can insert family categories"
ON categories FOR INSERT
WITH CHECK (
  family_id IN (
    SELECT family_id FROM family_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Members can update family categories"
ON categories FOR UPDATE
USING (
  family_id IN (
    SELECT family_id FROM family_members
    WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Members can delete family categories"
ON categories FOR DELETE
USING (
  family_id IN (
    SELECT family_id FROM family_members
    WHERE user_id = auth.uid()
  )
);
