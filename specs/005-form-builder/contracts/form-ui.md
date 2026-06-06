# Contract: Form UI — ConsultationForm в подвале

**Feature**: 005-form-builder  
**Date**: 2026-06-06

## Component tree

```text
Footer (server)
├── ConsultationFormSection          # тёмный фон, container, h2 title
│   └── ConsultationForm (client)
│       ├── NameField                # pill input, placeholder localized
│       ├── ContactMethodPicker      # 6 icons, selected ring (brand border)
│       ├── ContactField             # switches by method
│       │   ├── PhoneContactInput    # phone | whatsapp | viber
│       │   ├── TelegramContactInput
│       │   ├── VkContactInput
│       │   └── MessengerContactInput
│       ├── SubmitButton             # bg brand #7E2226, pill, full width mobile
│       ├── FormPrivacyLink          # target=_blank rel=noopener noreferrer
│       └── FormStatusMessage        # success / error aria-live
└── [existing footer row: company + FooterNav]
```

## Визуальные токены (макет + 002)

| Элемент | Стиль |
|---------|--------|
| Секция формы | `bg` тёмный (`#414141` или token footer dark из макета), `text-white`, `py-10` |
| Заголовок | uppercase, bold, center, `text-lg`–`text-xl` responsive |
| Поля ввода | `bg-white`, `rounded-full`, `px-4 py-3`, `text-gpi-text` |
| Выбранный способ связи | border `brand` / ring 2px |
| Кнопка | `bg-gpi-brand`, `rounded-full`, white text, min-h 44px |

## PhoneContactInput (макет)

```text
┌─────────────────────────────────────────────┐
│ [🇬🇪 ▼]  +995  │  00-000-000               │
└─────────────────────────────────────────────┘
```

- Левая часть: button/select — flag + dial code
- Правая часть: `input type=tel` с маской по стране
- Default country: `GE` (+995)
- On country change: update dial code, revalidate number

## ContactMethodPicker

| value | Icon | aria-label key |
|-------|------|----------------|
| phone | Phone | `forms.methodPhone` |
| telegram | socialIconMap.telegram | `forms.methodTelegram` |
| whatsapp | socialIconMap.whatsapp | `forms.methodWhatsApp` |
| vk | socialIconMap.vk | `forms.methodVk` |
| viber | socialIconMap.viber | `forms.methodViber` |
| messenger | socialIconMap.messenger | `forms.methodMessenger` |

Touch target: min 44×44px per option.

## Поведение

- Смена `contactMethod` → reset `contactValue`, clear errors
- Submit: disable button + spinner; on success show `successMessage`, clear fields
- Double-submit: prevented while `isSubmitting`
- Privacy link: only if `privacyPage` resolved; `target="_blank"` `rel="noopener noreferrer"`

## SEO / a11y

- Заголовок секции: `<h2>` (не дублировать `h1` страницы)
- `aria-invalid` на полях с ошибками
- `role="radiogroup"` на picker способов связи
- Ошибки: `aria-describedby`

## Responsive

| Breakpoint | Поведение |
|------------|-----------|
| mobile 320–767 | Иконки в 2 ряда или horizontal scroll без clip; кнопка full width |
| tablet 768+ | Иконки в один ряд, centered |
| desktop 980+ | max-width формы ~640px centered в секции |
