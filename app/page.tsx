import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import HeroSection from "@/features/landing/components/HeroSection";
import SearchWidget from "@/features/landing/components/SearchWidget";
import TrustStrip from "@/features/landing/components/TrustStrip";
import FeaturedVehicles from "@/features/landing/components/FeaturedVehicles";
import RentalCategories from "@/features/landing/components/RentalCategories";
import EditorialSection from "@/features/landing/components/EditorialSection";
import HowItWorks from "@/features/landing/components/HowItWorks";
import Faqs from "@/features/landing/components/Faqs";
import PopularCities from "@/features/landing/components/PopularCities";
import SeoContent from "@/features/landing/components/SeoContent";
import FinalCta from "@/features/landing/components/FinalCta";
import { constructMetadata } from "@/utils/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Tripzy | Self Drive Car Rental Company in Ranchi",
  description:
    "Self-drive cars in Ranchi, ready when you are. Rent verified cars — Swift, Thar 4x4, Verna, Safari & more — with paperless KYC, inclusive insurance, and transparent pricing in Ranchi, Jharkhand.",
  canonical: "/",
  keywords: [
    "self drive car rental company",
    "self drive car rental",
    "car rental near me",
    "car rental",
    "car rental ranchi",
    "ranchi",
    "car service",
    "tripzy tours",
    "tripzy",
    "tripzy car rental",
    "tripzy self drive car rental",
    "tripzy ranchi",
    "tripzy tours and travels",
    "cars",
    "rent a car ranchi",
    "self drive cars in ranchi",
    "car on rent in ranchi",
    "best car rental in ranchi",
    "car hire ranchi",
    "ranchi car rental service",
  ],
});

export default function Home() {
  return (
    <>
      {/* Structured data JSON-LD schemas */}
      <JsonLd />

      {/* 1. Header */}
      <Header />

      <main className="flex flex-col min-h-screen">
        {/* 2. Cinematic Hero — Primary H1 "Your drive. Your way." */}
        <HeroSection />

        {/* 3. Booking Search */}
        <SearchWidget />

        {/* 4. Trust Strip */}
        <TrustStrip />

        {/* 5. Featured Fleet — "Find your ride." */}
        <FeaturedVehicles />

        {/* 6. Rental Categories — "Choose by category." */}
        <RentalCategories />

        {/* 7. Editorial Travel Section — "Made for the road." */}
        <EditorialSection />

        {/* 8. How It Works — 3-Step Journey */}
        <HowItWorks />

        {/* 9. FAQ */}
        <Faqs />

        {/* 10. Pickup Locations & Google Maps */}
        <PopularCities />

        {/* Low-impact Collapsible SEO Content */}
        <SeoContent />

        {/* 11. Final Editorial CTA — "Where are you going next?" */}
        <FinalCta />
      </main>

      {/* 11. Footer */}
      <Footer />
    </>
  );
}
