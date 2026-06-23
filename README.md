# Usenly

Премиальный минималистичный landing для проекта Usenly — превращение Telegram username в коллекционного персонажа.

## Stack

- Next.js 15
- TypeScript
- Tailwind CSS v4
- Framer Motion
- shadcn/ui

## Запуск

```bash
npm install
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

## Структура

- `src/components/bear/Bear.tsx` — процедурный collectible-медведь (SVG)
- `src/lib/bear-generator.ts` — генерация редкости и палитры по seed
- `src/components/landing/` — Navbar, Hero, ClaimCard, BearGallery

## Редкости

| Редкость   | Палитра                          |
| ---------- | -------------------------------- |
| Common     | Хаотичные, яркие цвета           |
| Rare       | Гармоничные оттенки              |
| Epic       | Ограниченная палитра             |
| Legendary  | Монохром + акцент                |
| Mythic     | Золото / серебро, премиум-материал |
