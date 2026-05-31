# Contract: Slideshow UI

**Feature**: 003-slideshow-layout  
**Date**: 2026-05-31

## Component tree

```text
SlideshowHero (client)
├── SlideshowTimeline
│   └── Segment[N] (button, progress bar)
├── Embla viewport
│   └── SlideshowSlide × N
│       ├── Media (priority if index===0)
│       ├── title (h1 if page h1 delegated to hero)
│       ├── subtitle
│       └── CMSLink(buttonLabel)
└── NavButtons (prev / next)
```

## Visual (референс gpi-realty.ge)

| Элемент | Спецификация |
|---------|----------------|
| Таймлайн | Верх баннера, на всю ширину, N равных сегментов, gap 2–4px |
| Активный сегмент | Белый / непрозрачный; неактивные — полупрозрачные |
| Progress | Заполнение активного сегмента за 6 s при autoplay |
| Изображение | `object-cover`, min-height mobile ~50vh, desktop ~70vh |
| Заголовок | Полупрозрачная тёмная подложка, белый текст, fade in up |
| Подзаголовок | Отдельная подложка ниже заголовка, fade in up (stagger +100ms) |
| Кнопка | GPI CTA (как site-wide), не на весь баннер |
| Стрелки | Круглые 44×44px, bottom-right, белый фон, тёмная иконка |

## Interaction contract

| Action | Behavior |
|--------|----------|
| Next / Prev | Embla scroll + reset progress + retrigger text animation |
| Click segment `i` | `scrollTo(i)` |
| Autoplay | Every 6000ms `scrollNext()`, loop |
| Hover/focusin on root | Pause autoplay + progress |
| Hover/focusout | Resume if not reduced motion |
| Last → next | First slide (loop) |
| `prefers-reduced-motion` | No autoplay; instant slide change; no fade in up translate |

## Accessibility contract

| Requirement | Implementation |
|---------------|----------------|
| Keyboard | Tab: segments, arrows; Enter/Space activate |
| Focus visible | `:focus-visible` ring brand color |
| Screen reader | `aria-live="polite"` on slide title region optional; inactive slides `aria-hidden` |
| Touch | Swipe via Embla; targets ≥ 44px |

## CSS animation tokens

| Token | Value |
|-------|-------|
| `--slideshow-transition-ms` | 450 |
| `--slideshow-autoplay-ms` | 6000 |
| `--slideshow-fade-up-ms` | 400 |
| `--slideshow-fade-up-offset` | 12px |

Defined in `globals.css` under `@theme` or `.gpi-slideshow` scope.

## Props (`SlideshowHero`)

```typescript
type SlideshowHeroProps = {
  slides: NonNullable<Page['hero']['slides']>
  locale: Locale
}
```

## Page integration

`RenderHero` maps `type === 'slideshow'` → `SlideshowHero`.

`[locale]/[slug]/page.tsx`: без изменений структуры; при slideshow убрать лишний
`pt-16` overlap — hero full-bleed как HighImpact (`-mt` при необходимости в hero only).

## i18n UI strings (новые ключи в messages)

| Key | ru | en | ka |
|-----|----|----|-----|
| `slideshow.prev` | Предыдущий слайд | Previous slide | წინა სლაიდი |
| `slideshow.next` | Следующий слайд | Next slide | შემდეგი სლაიდი |
| `slideshow.slideN` | Слайд {n} | Slide {n} | სლაიდი {n} |
