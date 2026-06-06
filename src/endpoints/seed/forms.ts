import type { Payload, PayloadRequest } from 'payload'

const consultationCopy = {
  ru: {
    title: 'ОСТАВЬТЕ ЗАЯВКУ И ПОЛУЧИТЕ КОНСУЛЬТАЦИЮ ПО НЕДВИЖИМОСТИ ОТ GPI',
    submitButtonLabel: 'Связаться с нами',
    successMessage: 'Спасибо! Мы свяжемся с вами в ближайшее время.',
    privacyLinkLabel: 'Политика конфиденциальности',
  },
  ka: {
    title: 'დატოვეთ განაცხადი და მიიღეთ კონსულტაცია უძრავი ქონების შესახებ GPI-დან',
    submitButtonLabel: 'დაგვიკავშირდით',
    successMessage: 'გმადლობთ! ჩვენ მალე დაგიკავშირდებით.',
    privacyLinkLabel: 'კონფიდენციალურობის პოლიტიკა',
  },
  en: {
    title: 'LEAVE A REQUEST AND GET A REAL ESTATE CONSULTATION FROM GPI',
    submitButtonLabel: 'Contact us',
    successMessage: 'Thank you! We will contact you shortly.',
    privacyLinkLabel: 'Privacy Policy',
  },
} as const

export async function seedConsultationForm(
  payload: Payload,
  req: PayloadRequest,
  privacyPageId?: number,
): Promise<void> {
  const existing = await payload.find({
    collection: 'forms',
    limit: 1,
    where: { slug: { equals: 'consultation' } },
  })

  if (existing.docs.length > 0) {
    return
  }

  const doc = await payload.create({
    collection: 'forms',
    locale: 'ru',
    overrideAccess: true,
    context: { disableRevalidate: true },
    data: {
      slug: 'consultation',
      formType: 'consultation',
      placement: 'footer',
      title: consultationCopy.ru.title,
      submitButtonLabel: consultationCopy.ru.submitButtonLabel,
      successMessage: consultationCopy.ru.successMessage,
      privacyLinkLabel: consultationCopy.ru.privacyLinkLabel,
      ...(privacyPageId ? { privacyPage: privacyPageId } : {}),
      _status: 'published',
    },
    req,
  })

  for (const locale of ['ka', 'en'] as const) {
    await payload.update({
      collection: 'forms',
      id: doc.id,
      locale,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: consultationCopy[locale],
      req,
    })
  }
}
