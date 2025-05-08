# 🎉 Event Management Platform (MVP)

Platform ini memungkinkan event organizer untuk membuat dan mempromosikan event, dan pengguna (customer) bisa melakukan pencarian, pendaftaran, serta transaksi pembelian tiket event secara mudah.

---

## 🚀 Fitur Utama

### 🎫 Event & Transaksi
- Landing page menampilkan event mendatang.
- Filter & pencarian event (dengan debounce).
- Detail event lengkap.
- Event berbayar & gratis.
- Transaksi tiket dengan upload bukti pembayaran.
- Countdown 2 jam untuk upload bukti.
- Otomatisasi status transaksi (expired, canceled, dll).
- Rollback seats, points, voucher jika transaksi dibatalkan.

### 🌟 Review & Penilaian
- Hanya pengguna yang hadir bisa memberikan review.
- Profil organizer menampilkan review & rating.

### 👥 Auth, Referral & Akun
- Registrasi dengan referral.
- Referral memberi reward poin & kupon.
- Role-based access (customer & organizer).
- Edit profil, ubah & reset password.

### 📊 Dashboard Organizer
- Manajemen event, transaksi, dan attendees.
- Statistik event (grafik harian, bulanan, tahunan).
- Email notifikasi jika transaksi diterima/ditolak.

---

## 🏗️ Struktur Folder
/backend # API Express + Prisma ORM
/frontend # Next.js App Router (client side)


---

## 🔧 Teknologi

- **Backend**: Express.js, Prisma, PostgreSQL
- **Frontend**: Next.js App Router, TailwindCSS
- **Upload File**: Supabase Storage
- **Authentication**: JWT & bcrypt
- **Testing**: Jest, Supertest, React Testing Library
- **CI/CD**: GitHub Actions
- **Deployment**: Railway (backend), Vercel (frontend)

---

## 📦 Setup Development

### 1. Clone Project
```bash
git clone https://github.com/your-username/event-platform.git
cd event-platform
