import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  keywords?: string[];
  noIndex?: boolean;
  canonical?: string;
}

/**
 * Standard utility to generate SEO-rich OpenGraph, Twitter, and index configuration schemas.
 * Includes full OG meta tags, Twitter cards, canonical URLs, and keyword metadata.
 */
export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  keywords = siteConfig.keywords,
  noIndex = false,
  canonical = "/",
}: MetadataProps = {}): Metadata {
  const formattedTitle =
    title === siteConfig.name
      ? `${siteConfig.name} | Self Drive Car Rental Company in Ranchi`
      : `${title} | ${siteConfig.name} - Self Drive Car Rental Ranchi`;

  return {
    title: formattedTitle,
    description,
    keywords: keywords.join(", "),
    authors: [{ name: siteConfig.author, url: siteConfig.url }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    openGraph: {
      title: formattedTitle,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${siteConfig.name} - Self Drive Car Rental Company in Ranchi, Jharkhand`,
        },
      ],
      url: siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [image],
      creator: "@tripzy",
      site: "@tripzy",
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
    other: {
      "geo.region": "IN-JH",
      "geo.placename": "Ranchi",
      "geo.position": "23.3441;85.3096",
      ICBM: "23.3441, 85.3096",
    },
  };
}
