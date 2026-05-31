# Data Model: Layout «Слайдшоу»

**Feature**: 003-slideshow-layout  
**Date**: 2026-05-31

## Обзор

Расширение сущности **Page** — группа `hero` получает новое значение `type: slideshow`
и вложенный массив `slides`. Отдельных коллекций не создаётся.

## Сущности

### Page (существующая)

| Поле | Изменение |
|------|-----------|
| `hero.type` | + опция `slideshow` |
| `hero.slides` | NEW: array, видимо при `type === 'slideshow'` |
| `hero.richText` | скрыто при `slideshow` |
| `hero.links` | скрыто при `slideshow` |
| `hero.media` | скрыто при `slideshow` |

### Slide (элемент `hero.slides[]`)

| Поле | Тип | Localized | Required (publish) | Описание |
|------|-----|-----------|-------------------|----------|
| `image` | upload → `media` | нет* | да | Фон слайда |
| `title` | text | да | да | Заголовок (overlay, SEO h1 активного слайда) |
| `subtitle` | text | да | да | Подзаголовок |
| `link` | group (`link` field) | да** | да | reference \| custom URL |
| `buttonLabel` | text | да | да | Текст кнопки CTA |

\* Изображение общее для всех локалей (как `hero.media` в highImpact) — упрощает медиатеку;
тексты локализованы. *Если потребуется локализованное изображение — отдельная задача post-MVP.*

\** Group `link` localized целиком (reference + label paths per locale).

### Slide link (вложенная группа `link`)

Соответствует существующему `src/fields/link.ts`:

| Поле | Описание |
|------|----------|
| `type` | `reference` \| `custom` |
| `reference` | relationship → `pages` \| `posts` |
| `url` | custom URL |
| `newTab` | checkbox |
| `label` | не используется для CTA (используется `buttonLabel`) |

## Ограничения

| Правило | Значение |
|---------|----------|
| `slides.minRows` | 1 |
| `slides.maxRows` | 10 |
| Навигация (timeline, arrows, autoplay) | только если `slides.length >= 2` на фронте |
| Loop | только при `slides.length >= 2` |

## Состояния (runtime, frontend)

```text
[idle] → autoplay tick / user nav → [transitioning] → [idle]
         reduced motion: нет autoplay, transition instant
```

| Состояние | UI |
|-----------|-----|
| `activeIndex` | 0 … N-1 |
| `isPaused` | hover/focus/manual nav |
| `progress` | 0–100% на сегменте таймлайна за 6 s |

## Связи

```text
Page 1──1 hero (group)
hero 1──* slides (array)
slide *──1 media (upload)
slide.link *──? page | post (reference)
```

## Seed / пример данных

Главная (`slug: home`): `hero.type = slideshow`, 2–3 слайда с изображениями из
`endpoints/seed`, тексты ru/ka/en по шаблону референса (скидки, пресейлы).

## Миграция

- Dev: `npm run db:push` после изменения `heros/config.ts`
- Prod: зафиксировать миграцию Payload/ Drizzle по процессу проекта
- `npm run generate:types` — обновить `payload-types.ts`

## Revalidation

Существующий `revalidatePage` на Pages — без изменений; пути `/{locale}`, `/{locale}/home`.
