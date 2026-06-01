import type { Metadata } from 'next'
import Link from 'next/link'

import { PropertyContactLinks } from '@/components/properties/PropertyContactLinks'
import { PropertyFeatures } from '@/components/properties/PropertyFeatures'
import { PropertyGallery } from '@/components/properties/PropertyGallery'
import { PropertyMap } from '@/components/properties/PropertyMap'
import { PropertySpecs } from '@/components/properties/PropertySpecs'
import type { Locale } from '@/lib/i18n/config'
import { isValidLocale } from '@/lib/i18n/config'
import { getMessages } from '@/lib/i18n/getMessages'
import { getPropertyByCode, getPropertyStaticParams } from '@/lib/payload/queries/properties'
import { productOfferJsonLd } from '@/lib/seo/propertyJsonLd'
import { safeStaticParams } from '@/lib/payload/safeStaticParams'
import { generatePropertyDetailMeta } from '@/utilities/generatePropertyMeta'
import { formatPriceGel, formatPriceUsd } from '@/lib/properties/formatPrice'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'
export const revalidate = 600

export async function generateStaticParams() {
  return safeStaticParams(async () => getPropertyStaticParams())
}

type Args = {
  params: Promise<{ locale: string; objectCode: string }>
}

export default async function PropertyDetailPage({ params: paramsPromise }: Args) {
  const { locale: localeParam, objectCode } = await paramsPromise
  if (!isValidLocale(localeParam)) notFound()
  const locale = localeParam as Locale
  const code = decodeURIComponent(objectCode)

  const property = await getPropertyByCode(code, locale)
  if (!property) notFound()

  const t = getMessages(locale)
  const p = t.properties
  const jsonLd = productOfferJsonLd(property, locale)

  return (
    <article className="container py-8 pb-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link
        href={`/${locale}/properties`}
        className="text-sm text-gpi-brand hover:underline mb-6 inline-block min-h-11 leading-[44px]"
      >
        ← {p?.detailBack}
      </Link>

      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gpi-text font-gpi-heading mb-3">
          {property.title}
        </h1>
        <p className="text-xl font-semibold text-gpi-text">
          {formatPriceUsd(property.priceUsd, locale)}{' '}
          <span className="text-base font-normal text-gpi-muted">
            / {formatPriceGel(property.priceGel, locale)}
          </span>
        </p>
        {property.listingDate && (
          <p className="text-sm text-gpi-muted mt-2">
            {p?.updatedAt}:{' '}
            {new Date(property.listingDate).toLocaleDateString(
              locale === 'ka' ? 'ka-GE' : locale === 'en' ? 'en-GB' : 'ru-RU',
            )}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
        <PropertyGallery photos={property.photos} title={property.title} locale={locale} />
        <div className="space-y-6">
          <PropertySpecs property={property} locale={locale} />
          <PropertyFeatures features={property.features} locale={locale} />
          <PropertyContactLinks property={property} locale={locale} />
        </div>
      </div>

      {property.description && (
        <section className="prose prose-neutral max-w-none mb-10">
          <h2 className="text-xl font-semibold font-gpi-heading text-gpi-text mb-3">
            {p?.detailDescription}
          </h2>
          <p className="text-gpi-text whitespace-pre-wrap leading-relaxed">{property.description}</p>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold font-gpi-heading text-gpi-text mb-3">{p?.detailMap}</h2>
        <PropertyMap
          lat={property.lat}
          lng={property.lng}
          locale={locale}
          label={property.title}
        />
      </section>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale: localeParam, objectCode } = await paramsPromise
  if (!isValidLocale(localeParam)) return {}
  const property = await getPropertyByCode(decodeURIComponent(objectCode), localeParam)
  return generatePropertyDetailMeta(property, localeParam)
}
