import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import HeroSection from "@/features/landing/components/HeroSection";
import WhyChooseUs from "@/features/landing/components/WhyChooseUs";
import FeaturedVehicles from "@/features/landing/components/FeaturedVehicles";
import PopularCities from "@/features/landing/components/PopularCities";
import RentalCategories from "@/features/landing/components/RentalCategories";
import Testimonials from "@/features/landing/components/Testimonials";
import Statistics from "@/features/landing/components/Statistics";
import Faqs from "@/features/landing/components/Faqs";
import BlogPreview from "@/features/landing/components/BlogPreview";
import SeoContent from "@/features/landing/components/SeoContent";
import { constructMetadata } from "@/utils/metadata";

export const metadata: Metadata = constructMetadata({
  title: "Tripzy",
  description:
    "Tripzy is Ranchi's #1 self drive car rental company. Rent verified cars — Swift, Thar, Verna, Safari & more — with paperless KYC, inclusive insurance, and transparent pricing. Best car rental near you in Ranchi, Jharkhand. Book self drive car rental today!",
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

      {/* Sticky header navbar */}
      <Header />

      <main className="flex flex-col">
        {/* Hero Landing — Contains the primary H1 */}
        <HeroSection />

        {/* Section Divider Line */}
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="border-t border-border/60" />
        </div>

        {/* Why Choose Tripzy */}
        <WhyChooseUs />

        {/* Car Rental Categories */}
        <RentalCategories />

        {/* Featured Self Drive Cars */}
        <FeaturedVehicles />

        {/* Operational Statistics counters */}
        <Statistics />

        {/* Car Rental in Ranchi — Popular Locations */}
        <PopularCities />

        {/* Section Divider Line */}
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="border-t border-border/60" />
        </div>

        {/* Customer Reviews & Testimonials */}
        <Testimonials />

        {/* Section Divider Line */}
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="border-t border-border/60" />
        </div>

        {/* SEO Content — 600 word about section */}
        <SeoContent />

        {/* Section Divider Line */}
        <div className="mx-auto w-full max-w-7xl px-6">
          <div className="border-t border-border/60" />
        </div>

        {/* Frequently Asked Questions */}
        <Faqs />

        {/* Blog & Travel Guides */}
        <BlogPreview />
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}
