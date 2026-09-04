# KP-PRODI — Sistem Informasi Kerja Praktik

Sistem Informasi Kerja Praktik (SIKP) untuk Program Studi, dibangun dengan Laravel, React, dan Inertia.js.

## Tech Stack

- **Backend**: Laravel 12 (PHP 8.2+)
- **Frontend**: React + TypeScript
- **Bridge**: Inertia.js
- **Styling**: Tailwind CSS
- **Build**: Vite

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
