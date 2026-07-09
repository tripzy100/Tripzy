import { siteConfig } from "@/config/site";
import { faqItems } from "@/config/faq";

export function JsonLd() {
  // 1. Organization Schema
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.business.legalName,
    alternateName: [siteConfig.name, "Tripzy Car Rental", "Tripzy Tours", "Tripzy Tours and Travels"],
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    sameAs: [
      siteConfig.links.twitter,
      siteConfig.links.instagram,
      siteConfig.links.facebook,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.business.contactPoint.telephone,
      contactType: siteConfig.business.contactPoint.contactType,
      areaServed: siteConfig.business.contactPoint.areaServed,
      availableLanguage: siteConfig.business.contactPoint.availableLanguage,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.business.address.streetAddress,
      addressLocality: siteConfig.business.address.addressLocality,
      addressRegion: siteConfig.business.address.addressRegion,
      postalCode: siteConfig.business.address.postalCode,
      addressCountry: siteConfig.business.address.addressCountry,
    },
  };

  // 2. LocalBusiness / AutoRental Schema
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    "@id": `${siteConfig.url}/#auto-rental`,
    name: siteConfig.business.name,
    alternateName: "Tripzy Self Drive Car Rental Ranchi",
    description: siteConfig.description,
    telephone: siteConfig.business.contactPoint.telephone,
    url: siteConfig.url,
    priceRange: siteConfig.business.priceRange,
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, UPI, Credit Card, Debit Card",
    openingHours: siteConfig.business.openingHours,
    image: siteConfig.ogImage,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.business.address.streetAddress,
      addressLocality: siteConfig.business.address.addressLocality,
      addressRegion: siteConfig.business.address.addressRegion,
      postalCode: siteConfig.business.address.postalCode,
      addressCountry: siteConfig.business.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.business.geo.latitude,
      longitude: siteConfig.business.geo.longitude,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Ranchi",
      },
      {
        "@type": "State",
        name: "Jharkhand",
      },
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "500",
      bestRating: "5",
      worstRating: "1",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Self Drive Car Rental Fleet",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "SUV Rentals",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: "Mahindra Thar" },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: "Tata Safari" },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: "Mahindra Scorpio N" },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Sedan Rentals",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: "Hyundai Verna" },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: "Maruti Suzuki Swift Dzire" },
            },
          ],
        },
        {
          "@type": "OfferCatalog",
          name: "Hatchback Rentals",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: "Maruti Suzuki Swift" },
            },
            {
              "@type": "Offer",
              itemOffered: { "@type": "Product", name: "Hyundai i20" },
            },
          ],
        },
      ],
    },
  };

  // 3. FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  // 4. Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteConfig.url,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Self Drive Cars",
        item: `${siteConfig.url}/vehicles`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Car Rental Ranchi",
        item: `${siteConfig.url}/cities/ranchi`,
      },
    ],
  };

  // 5. WebSite Schema with SearchAction
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    alternateName: "Tripzy Self Drive Car Rental",
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/vehicles?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
