# 💎 WealthOS — Personal Finance & Wealth Tracker

> *Your Financial Command Center* — Aplikasi fintech premium untuk melacak pemasukan, pengeluaran, aset, investasi, dan target kekayaan pribadi.

![WealthOS](https://img.shields.io/badge/WealthOS-v1.0.0-6C63FF?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwindcss)

---

## ✨ Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 📊 **Dashboard** | Net worth, income, expense, grafik 6 bulan, asset breakdown |
| 💸 **Transaksi** | CRUD lengkap, filter by date/category/type, search |
| 🎯 **Target Kekayaan** | Progress bar, countdown, simulasi pencapaian |
| 💎 **Aset** | Tabungan, kripto, saham, properti, kendaraan, P&L |
| 📈 **Investasi** | Modal, nilai kini, ROI, P&L, chart performa |
| 🤖 **AI Assistant** | Powered by Claude — analisis keuangan real-time |
| 🎵 **Musik Lo-fi** | Background music player dengan volume control |
| 🔐 **Auth** | Login, register, reset password via Supabase |

---

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS + custom glassmorphism
- **Animasi**: Framer Motion
- **Chart**: Recharts
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Anthropic Claude API
- **Deploy**: Vercel

---

## 🚀 Instalasi Lokal

### 1. Clone / Download Project

```bash
git clone https://github.com/yourname/wealthos.git
cd wealthos
```

Atau ekstrak folder `wealthtracker` yang sudah dibuat.

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### a. Buat Project Supabase
1. Pergi ke [supabase.com](https://supabase.com) → New Project
2. Isi nama project, database password, dan pilih region terdekat (Singapore)
3. Tunggu project selesai dibuat (~2 menit)

#### b. Jalankan Schema SQL
1. Di dashboard Supabase → klik **SQL Editor**
2. Klik **New Query**
3. Copy seluruh isi file `database/schema.sql`
4. Paste ke SQL Editor → klik **Run** (▶️)
5. Pastikan semua table berhasil dibuat

#### c. Ambil API Keys
1. Di Supabase → **Project Settings** → **API**
2. Copy:
   - `Project URL` → untuk `VITE_SUPABASE_URL`
   - `anon public` key → untuk `VITE_SUPABASE_ANON_KEY`

#### d. Setup Auth Email
1. Di Supabase → **Authentication** → **Settings**
2. Pastikan **Enable Email Signup** = ON
3. (Opsional) Untuk development, matikan **Email Confirmation** di bagian Email Auth

### 4. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 5. Jalankan Development Server

```bash
npm run dev
```

Buka `http://localhost:5173` di browser.

---

## 🤖 Setup AI Assistant

AI Assistant menggunakan Anthropic Claude API. Ada dua cara setup:

### Cara A: Direct API (untuk development)
> ⚠️ Tidak direkomendasikan untuk production karena API key terekspos

Tambahkan di `.env`:
```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

Lalu update `src/components/ai/AIAssistant.jsx`, tambahkan header:
```js
headers: {
  'Content-Type': 'application/json',
  'x-api-key': import.meta.env.VITE_ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
  'anthropic-dangerous-direct-browser-access': 'true',
},
```

### Cara B: Supabase Edge Function (RECOMMENDED untuk production)

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-id

# Create edge function
supabase functions new ai-chat
```

Isi `supabase/functions/ai-chat/index.ts`:
```typescript
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }})
  }

  const body = await req.json()
  
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()
  
  return new Response(JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
})
```

Deploy dan set secret:
```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase functions deploy ai-chat
```

Update `AIAssistant.jsx` — ganti URL fetch:
```js
const response = await fetch(
  `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
  { ... }
)
```

---

## 🌐 Deploy ke Vercel

### Cara Cepat (via Vercel CLI)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Ikuti prompt:
# - Link to existing project? No
# - Project name: wealthos
# - Directory: ./
# - Override settings? No
```

### Via Vercel Dashboard

1. Push project ke GitHub
2. Buka [vercel.com](https://vercel.com) → New Project
3. Import repository dari GitHub
4. **Framework Preset**: Vite
5. **Build Command**: `npm run build`
6. **Output Directory**: `dist`

### Set Environment Variables di Vercel

Di Vercel Dashboard → Project → **Settings** → **Environment Variables**:

```
VITE_SUPABASE_URL          = https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY     = eyJ...
```

7. Klik **Deploy** → Tunggu build selesai (~1-2 menit)

### Update CORS di Supabase

Setelah dapat URL Vercel (misal: `https://wealthos.vercel.app`):

1. Supabase → **Authentication** → **URL Configuration**
2. **Site URL**: `https://wealthos.vercel.app`
3. **Redirect URLs**: `https://wealthos.vercel.app/**`

---

## 📁 Struktur Project

```
wealthos/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ai/
│   │   │   └── AIAssistant.jsx      # AI chat dengan Claude
│   │   ├── assets/
│   │   │   └── AssetsPage.jsx       # Manajemen aset
│   │   ├── auth/
│   │   │   └── AuthPage.jsx         # Login / Register / Reset
│   │   ├── dashboard/
│   │   │   ├── Dashboard.jsx        # Main dashboard
│   │   │   └── StatCard.jsx         # Kartu statistik
│   │   ├── goals/
│   │   │   └── GoalsPage.jsx        # Target kekayaan
│   │   ├── investments/
│   │   │   └── InvestmentsPage.jsx  # Portfolio investasi
│   │   ├── layout/
│   │   │   ├── Header.jsx           # Top bar
│   │   │   ├── LoadingScreen.jsx    # Intro loading
│   │   │   ├── MobileNav.jsx        # Bottom nav mobile
│   │   │   ├── Sidebar.jsx          # Side navigation
│   │   │   └── Toast.jsx            # Notification
│   │   ├── music/
│   │   │   └── MusicPlayer.jsx      # Lo-fi player
│   │   └── transactions/
│   │       └── TransactionPage.jsx  # Daftar & form transaksi
│   ├── contexts/
│   │   ├── AppContext.jsx           # Global state + CRUD
│   │   └── AuthContext.jsx          # Auth state
│   ├── lib/
│   │   └── supabase.js              # Supabase client
│   ├── utils/
│   │   ├── formatters.js            # Currency, date utils
│   │   └── quotes.js                # Motivational quotes
│   ├── App.jsx                      # Root app + routing
│   ├── index.css                    # Global styles
│   └── main.jsx                     # React entry point
├── database/
│   └── schema.sql                   # Supabase SQL schema
├── .env.example                     # Env template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

---

## 🎨 Desain System

| Token | Value |
|-------|-------|
| Background | `#0A0B0F` |
| Surface | `#13151C` |
| Primary (Violet) | `#6C63FF` |
| Gold Accent | `#F5C518` |
| Growth (Teal) | `#00D4B4` |
| Expense (Red) | `#FF4D6D` |
| Display Font | Space Grotesk |
| Body Font | Inter |
| Mono Font | JetBrains Mono |

---

## 🔒 Keamanan

- Row Level Security (RLS) aktif untuk semua table
- Data user terisolasi per `user_id`
- Auth dihandle oleh Supabase (JWT)
- API key tidak pernah di-expose ke client (gunakan Edge Function)
- `.env` wajib masuk `.gitignore`

---

## 📝 Catatan Pengembangan

### Tambah kategori baru:
Edit `src/utils/formatters.js` → array `INCOME_CATEGORIES` atau `EXPENSE_CATEGORIES`

### Tambah stream musik baru:
Edit `src/components/music/MusicPlayer.jsx` → array `TRACKS`

### Ganti warna tema:
Edit `tailwind.config.js` → section `colors.brand`

---

## 💡 Tips Production

1. **Backup database**: Aktifkan Point-in-Time Recovery di Supabase
2. **Monitor usage**: Pantau Supabase dashboard untuk DB size dan API calls
3. **Rate limiting**: Tambahkan rate limit di Edge Function untuk AI
4. **Analytics**: Tambahkan Vercel Analytics untuk track user behavior
5. **Error tracking**: Integrasikan Sentry untuk monitoring error

---

## 📄 License

MIT License — Free to use and modify.

---

**WealthOS** — *Built with 💜 for financial freedom*
