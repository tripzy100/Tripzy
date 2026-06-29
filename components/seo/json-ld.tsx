import { siteConfig } from "@/config/site";
import { faqItems } from "@/config/faq";

export function JsonLd() {
  // 1. Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.name,
    "url": siteConfig.url,
    "logo": `${siteConfig.url}/logo.png`,
    "sameAs": [siteConfig.links.twitter, siteConfig.links.github],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": siteConfig.business.contactPoint.telephone,
      "contactType": siteConfig.business.contactPoint.contactType,
      "areaServed": siteConfig.business.contactPoint.areaServed,
      "availableLanguage": siteConfig.business.contactPoint.availableLanguage,
    },
  };

  // 2. LocalBusiness Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "name": siteConfig.business.name,
    "telephone": siteConfig.business.contactPoint.telephone,
    "url": siteConfig.url,
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": siteConfig.business.address.streetAddress,
      "addressLocality": siteConfig.business.address.addressLocality,
      "addressRegion": siteConfig.business.address.addressRegion,
      "postalCode": siteConfig.business.address.postalCode,
      "addressCountry": siteConfig.business.address.addressCountry,
    },
  };

  // 3. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqItems.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
      },
    })),
  };

  // 4. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": siteConfig.url,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Vehicles",
        "item": `${siteConfig.url}/vehicles`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
