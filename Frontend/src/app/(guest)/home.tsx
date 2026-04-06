import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Recommended from "@/components/Recommended";
import RecentAds from "@/components/RecentAds";
import FeaturedAds from "@/components/FeaturedAds";
import HotDeals from "@/components/HotDeals";
import PromoBanner from "@/components/PromoBanner";
import TrendingAds from "@/components/TrendingAds";
import MarketplaceHero from "@/components/MarketplaceHero";
import PollGame from "@/components/PollGame";
import FeaturedListing from "@/components/FeaturedListing";
import WhyChooseUs from "@/components/WhyChooseUs";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";

import LocationFilterBar from "@/components/LocationFilterBar";
import { LocationFilterProvider } from "@/context/LocationFilterContext";

export default function HomePage() {
  return (
    <LocationFilterProvider>
      <div className="bg-white">
        <Navbar />
        <Hero />
        <LocationFilterBar />
        <RecentAds />
        <Recommended />
        <FeaturedAds />
        <PromoBanner />
        <HotDeals />
        <TrendingAds />
        <MarketplaceHero />
        <PollGame />
        <FeaturedListing />
        <WhyChooseUs />
        <NewsletterCTA />
        <Footer />
      </div>
    </LocationFilterProvider>
  );
}
