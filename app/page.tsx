import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { JsonLd } from "@/components/seo/json-ld";
import HeroSection from "@/features/landing/components/HeroSection";
import SearchWidget from "@/features/landing/components/SearchWidget";
import WhyChooseUs from "@/features/landing/components/WhyChooseUs";
import FeaturedVehicles from "@/features/landing/components/FeaturedVehicles";
import PopularCities from "@/features/landing/components/PopularCities";
import RentalCategories from "@/features/landing/components/RentalCategories";
import Testimonials from "@/features/landing/components/Testimonials";
import Statistics from "@/features/landing/components/Statistics";
import Faqs from "@/features/landing/components/Faqs";
import BlogPreview from "@/features/landing/components/BlogPreview";
import Newsletter from "@/features/landing/components/Newsletter";

export default function Home() {
  return (
    <>
      {/* Search schema JSON-LD data mappings */}
      <JsonLd />

      {/* Sticky header navbar */}
      <Header />

      <main className="flex flex-col">
        {/* Hero Landing */}
        <HeroSection />

        {/* Filter Widget */}
        <SearchWidget />

        {/* Selling Pitch points */}
        <WhyChooseUs />

        {/* Categories of cars */}
        <RentalCategories />

        {/* Top Fleet grid */}
        <FeaturedVehicles />

        {/* Operational Statistics counters */}
        <Statistics />

        {/* Hot locations routes */}
        <PopularCities />

        {/* Client feedback cards */}
        <Testimonials />

        {/* FAQ Accordions */}
        <Faqs />

        {/* Blog guides list */}
        <BlogPreview />

        {/* Email list join */}
        <Newsletter />
      </main>

      {/* Corporate directories Footer */}
      <Footer />
    </>
  );
}
