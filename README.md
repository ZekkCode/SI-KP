# KP-PRODI — Sistem Informasi Kerja Praktik

Sistem Informasi Kerja Praktik (SIKP) untuk Program Studi, dibangun dengan Laravel, React, dan Inertia.js.

## Dokumentasi & Panduan Utama

- 📘 **[PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md)**: Master Context Window, arsitektur sistem, database, audit kode, dan log session memory.
- 🎨 **[SIVITAS_DESIGN_GUIDELINES.md](./SIVITAS_DESIGN_GUIDELINES.md)**: Standar resmi desain antarmuka Sivitas Sakera UTM (Anti AI-Slop).

## Tech Stack

- **Backend**: Laravel 13.23 (PHP 8.5 / 8.4+)
- **Frontend**: React 19 + TypeScript + Inertia.js 2.0
- **Styling**: Tailwind CSS v4
- **Build Tool**: Vite 6

## Setup

```bash
composer install
npm install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run dev
php artisan serve
```

## License

MIT
