# Quickstart: 003-slideshow-layout

## Prerequisites

- Ветка `003-slideshow-layout`
- PostgreSQL, `.env` настроен
- Завершена или влита фича `002-gpi-site-design` (design tokens)

## Setup

```bash
git checkout 003-slideshow-layout
npm install
# после реализации — добавится embla-carousel embla-carousel-react
npm run db:push
npm run generate:types
```

## Dev

```bash
npm run dev
# Admin: Pages → Home → Hero → Type: Slideshow → добавить слайды
# Public: http://localhost:3000/ru
```

## Seed (после реализации)

```bash
npm run seed
# главная с demo slideshow
```

## Tests

```bash
npm run test:unit -- tests/unit/heros
npm run test:unit -- tests/unit/components/SlideshowHero.test.tsx
npm run test:e2e -- tests/e2e/slideshow.spec.ts
```

## Admin

1. Открыть **Pages → Home → Hero**
2. **Тип hero**: «Слайдшоу»
3. Добавить 1–10 слайдов: изображение, заголовок, подзаголовок, ссылка, текст кнопки
4. Заполнить поля для каждой локали (ru, ka, en) перед публикацией
5. При неполных полях публикация локали блокируется с сообщением об ошибке

## Verify checklist

- [ ] Таймлайн: N сегментов = N слайдов
- [ ] Loop: после последнего → первый
- [ ] Fade in up заголовка/подзаголовка
- [ ] Reduced motion: без autoplay и без slide animation
- [ ] `/ru`, `/ka`, `/en` — тексты слайдов локализованы
- [ ] PageSpeed на `/ru` ≥ 90 (Lighthouse mobile)

## Key files (после implement)

| Area | Path |
|------|------|
| CMS schema | `src/heros/config.ts` |
| Renderer | `src/heros/Slideshow/index.tsx` |
| Register | `src/heros/RenderHero.tsx` |
| Seed | `src/endpoints/seed/home.ts` |
| E2E | `tests/e2e/slideshow.spec.ts` |

## Next command

```text
/speckit-tasks
```
