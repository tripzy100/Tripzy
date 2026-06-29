export const siteConfig = {
  name: "Tripzy",
  shortName: "Tripzy",
  description:
    "Premium self-drive car rentals on-demand. Experience a seamless rental workflow modeled for modern users.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://tripzy.com",
  ogImage: "https://tripzy.com/og.jpg",
  author: "Tripzy Inc.",
  links: {
    twitter: "https://twitter.com/tripzy",
    github: "https://github.com/tripzy100",
  },
  themeColor: {
    light: "#ffffff",
    dark: "#030712",
  },
  business: {
    name: "Tripzy Self Drive Car Rentals",
    address: {
      streetAddress: "123 Tesla Boulevard",
      addressLocality: "San Francisco",
      addressRegion: "CA",
      postalCode: "94107",
      addressCountry: "US",
    },
    contactPoint: {
      telephone: "+1-800-555-0199",
      contactType: "customer support",
      areaServed: "US",
      availableLanguage: ["en", "es"],
    },
  },
};

export type SiteConfig = typeof siteConfig;
