# Famaney - Family Money Tracker

Mobile-friendly family money tracker dengan sistem Family/Group. Multi-user, data tersimpan di Supabase.

## Tech Stack

- **Frontend**: React + Vite (PWA)
- **UI**: Tailwind CSS
- **Backend + DB + Auth**: Supabase
- **Charts**: Recharts

## Features

- Login dengan Google
- Create/Join family groups
- Track expenses per family
- Dashboard dengan charts (pie chart per kategori, bar chart trend harian)
- Per-member breakdown
- PWA - bisa di-install di HP

## Setup

### 1. Supabase Setup

1. Buat akun di [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Authentication → Providers → Google** dan enable
4. Setup Google OAuth credentials (lihat [Supabase docs](https://supabase.com/docs/guides/auth/social-login/auth-google))
5. Go to **SQL Editor** dan run script dari `supabase/migrations/001_initial.sql`
6. Copy **Project URL** dan **anon key** dari **Settings → API**

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` dan isi dengan credentials dari Supabase:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Install & Run

```bash
npm install
npm run dev
```

### 4. Build for Production

```bash
npm run build
npm run preview
```

## Default Categories

- 🍔 Makan
- 🚗 Transport
- 🛒 Belanja
- 🎬 Hiburan
- 💊 Kesehatan
- 📱 Pulsa/Internet
- 🏠 Rumah
- 📦 Lainnya

## User Flow

1. Login dengan Google
2. Create family baru atau join dengan invite code
3. Set display name untuk family tersebut
4. Mulai track expenses!

## Project Structure

```
src/
├── components/
│   ├── auth/          # Login, ProtectedRoute
│   ├── family/        # CreateFamily, JoinFamily, FamilySelector
│   ├── expense/       # InputForm, ExpenseList, ExpenseItem
│   ├── dashboard/     # Dashboard, Charts, Summary
│   ├── settings/      # Settings, FamilySettings, Profile
│   └── ui/            # Button, Input, Navigation
├── context/           # AuthContext, FamilyContext
├── hooks/             # useAuth, useFamily, useExpenses
├── lib/               # supabase.js, utils.js
└── App.jsx
```
