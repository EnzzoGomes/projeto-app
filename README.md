# Mission Market - Professional Edition

A professional marketplace platform for local tasks and services.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Payments:** Stripe (coming soon)
- **Deployment:** Vercel

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.local.example` to `.env.local`
3. Add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Run Database Migrations

```sql
-- Run these in your Supabase SQL editor

-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  cpf TEXT UNIQUE,
  phone TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 5.0,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Missions table
CREATE TABLE public.missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID REFERENCES public.profiles NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  duration TEXT,
  min_level INTEGER DEFAULT 1,
  payment_method TEXT CHECK (payment_method IN ('pix', 'cash', 'card')),
  status TEXT CHECK (status IN ('available', 'accepted', 'completed')) DEFAULT 'available',
  acceptor_id UUID REFERENCES public.profiles,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Missions are viewable by everyone" 
  ON public.missions FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create missions" 
  ON public.missions FOR INSERT WITH CHECK (auth.uid() = creator_id);
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Production Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables (Production)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
```

## Features

- ✅ Real-time mission marketplace
- ✅ Secure authentication (Supabase Auth)
- ✅ Document verification
- ✅ User leveling system
- ✅ Direct payments (PIX/Cash/Card)
- ✅ 15% platform fee
- ✅ PWA support

## License

MIT
