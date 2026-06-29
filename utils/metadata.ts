import { Metadata } from "next";
import { siteConfig } from "@/config/site";

interface MetadataProps {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

/**
 * Standard utility to generate SEO-rich OpenGraph, Twitter, and index configuration schemas.
 */
export function constructMetadata({
  title = siteConfig.name,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
}: MetadataProps = {}): Metadata {
  const formattedTitle = title === siteConfig.name ? title : `${title} | ${siteConfig.name}`;

  return {
    title: formattedTitle,
    description,
    openGraph: {
      title: formattedTitle,
      description,
      images: [{ url: image }],
      url: siteConfig.url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: formattedTitle,
      description,
      images: [image],
      creator: "@tripzy",
    },
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: "/",
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
  };
}
