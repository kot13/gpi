# Research: Layout «Слайдшоу»

**Feature**: 003-slideshow-layout  
**Date**: 2026-05-31

## 1. Размещение в CMS: hero type vs block

**Decision**: Новый тип в существующей группе `hero` (`type: slideshow`), массив `slides`.

**Rationale**: Spec и codebase уже используют `hero.type` + `RenderHero`; главный баннер
gpi-realty.ge — верхняя зона страницы, не блок в `layout`. Минимальное расхождение с
`[slug]/page.tsx` (`RenderHero` → `RenderBlocks`).

**Alternatives considered**:
- Block `Slideshow` в `layout` — дублирование с hero, сложнее для главной.
- Отдельная коллекция `slides` — избыточно для 5 полей и привязки к странице.

---

## 2. Библиотека карусели

**Decision**: `embla-carousel-react` + `embla-carousel` (официальный React binding).

**Rationale**: Поддержка `loop`, API для `scrollPrev/scrollNext`, keyboard, touch,
небольшой размер, активное сопровождение. В репозитории нет Swiper/Embla — одна
зависимость на фичу.

**Alternatives considered**:
- **Swiper** — тяжелее, больше CSS/JS.
- **Чистый CSS scroll-snap** — сложный бесшовный loop и progress timeline.
- **Самописный transform** — выше риск багов a11y и touch.

---

## 3. Анимации: перелистывание и fade in up

**Decision**:
- Перелистывание: transform Embla (`translateX`) + CSS `transition` на контейнере (~400–500 ms).
- Fade in up: CSS `@keyframes` или utility-классы в `globals.css` (opacity + `translateY`),
  перезапуск по `key={activeIndex}` на текстовом блоке при смене слайда.
- `prefers-reduced-motion: reduce`: `useReducedMotion` → `duration: 0`, без translateY,
  мгновенная смена слайда (FR-007b/c).

**Rationale**: Не добавлять Framer Motion; `tw-animate-css` уже в devDependencies —
при необходимости вынести токены длительности в design tokens.

**Alternatives considered**:
- Framer Motion — лишний bundle для двух эффектов.

---

## 4. Таймлайн и автопрокрутка

**Decision**:
- Сегменты: `flex` row, `flex: 1` на каждый из N слайдов.
- Progress: pseudo-element или inner div с `scaleX` / `width%`, анимация через
  `requestAnimationFrame` или CSS `animation` на 6000 ms, сброс при смене слайда.
- Autoplay: `setInterval(6000)` + Embla `scrollNext()`; pause on `mouseenter`, `focusin`,
  manual nav; clear on unmount.
- Loop: `loop: true` в Embla при `slides.length >= 2`.

**Rationale**: Соответствует FR-007, FR-007a, FR-008 и clarifications session 2026-05-31.

---

## 5. Ссылка и кнопка слайда

**Decision**: Одно поле `link` (group) через `link({ disableLabel: false })` +
отдельное поле `buttonLabel` (text, localized) — label в CMS link не используется
для CTA-текста слайда (spec: «Текст кнопки»).

**Rationale**: Переиспользование `resolveLinkHref` / `CMSLink`; единообразие с остальным сайтом.

**Alternatives considered**:
- `linkGroup` — избыточно (одна кнопка на слайд).

---

## 6. SEO и доступность

**Decision**:
- Разметка: `section[aria-roledescription="carousel"]`, `aria-label` из i18n.
- Только активный слайд: заголовок как `h1` (или `h2` если страница уже имеет h1 —
  **зафиксировать в implement**: на главной hero title = page `h1`, скрытые слайды
  `aria-hidden="true"`).
- Timeline segments: `role="tab"` / `aria-selected` или кнопки с `aria-label="Слайд N"`.
- Стрелки: `aria-label` локализованные.

**Rationale**: Конституция V, FR-013, User Story 3.

---

## 7. Валидация публикации

**Decision**: Расширить или дополнить проверку `validateLocalizedPublish` для
`hero.type === 'slideshow'`: каждый слайд в локали должен иметь image, title,
subtitle, link, buttonLabel.

**Rationale**: FR-004, существующий хук на Pages.

---

## 8. Зависимость от фичи 002

**Decision**: Стили баннера — GPI tokens (`--color-gpi-*`, Circe/Unbounded), CTA как
`CMSLink` appearance `default`; без левого split-promo блока.

**Rationale**: Spec Out of Scope для промо-карточки; full-bleed carousel.
