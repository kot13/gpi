# Quickstart: 005-form-builder

## Prerequisites

- Ветка `005-form-builder`
- PostgreSQL, `.env` настроен
- Фичи `001-cms-foundation`, `002-gpi-site-design` (footer, tokens)

## Setup

```bash
git checkout 005-form-builder
npm install
# после реализации:
# npm install libphonenumber-js
npm run db:push
npm run generate:types
```

## Dev

```bash
npm run dev
# Admin: Collections → Forms → consultation (footer, published)
# Admin: Form Submissions — список заявок
# Public: http://localhost:3000/ru/ — форма в подвале над навигацией
```

## Seed (после реализации)

```bash
npm run seed
# создаёт форму consultation + привязку privacy page
```

## Tests

```bash
npm run test:unit -- tests/unit/lib/forms
npm run test:integration -- tests/integration/forms-collection.test.ts
npm run test:integration -- tests/integration/form-submissions.test.ts
npm run test:integration -- tests/integration/globals/footer.test.ts
npm run test:e2e -- tests/e2e/consultation-form.spec.ts
```

## Admin checklist

1. **Forms → Create** (или seed `consultation`)
2. Заполнить `title`, `submitButtonLabel`, `successMessage` для **ru, ka, en**
3. `placement: footer`, `formType: consultation`
4. Выбрать `privacyPage` → страница политики
5. **Publish**

## Verify checklist

- [ ] Форма видна в подвале на `/ru`, `/ka`, `/en` над навигацией
- [ ] Способ «Телефон» — country picker + маска в одном pill-поле
- [ ] Все 6 способов связи меняют поле контакта
- [ ] Отправка создаёт запись в Form Submissions
- [ ] Privacy link открывается в новой вкладке
- [ ] Мобильная вёрстка 320px без горизонтального скролла блока формы
- [ ] Двойной клик не создаёт дубликат

## Env (optional)

```env
# FORM_RATE_LIMIT=5  # submissions per IP per minute
```
