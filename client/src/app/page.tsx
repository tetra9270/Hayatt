import HeroCarousel from '@/components/HeroCarousel';
import FeatureSection from '@/components/FeatureSection';
import CategorySection from '@/components/CategorySection';
import TrendingDrops from '@/components/TrendingDrops';
import DealOfTheDay from '@/components/DealOfTheDay';
import Newsletter from '@/components/Newsletter';
import BrandTicker from '@/components/BrandTicker';
import Testimonials from '@/components/Testimonials';
import LiveActivity from '@/components/LiveActivity';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="relative bg-transparent min-h-screen text-white overflow-hidden">
      {/* Abstract 3D Background - Handled Globally by Layout */}

      {/* Live Activity Feed (Fixed Popup) */}
      <LiveActivity />

      {/* Hero Section with Carousel */}
      <section className="relative z-10 pt-20">
        <HeroCarousel />
      </section>

      {/* Partner Brands */}
      <BrandTicker />

      {/* Categories */}
      <CategorySection />

      {/* Trending Drops */}
      <TrendingDrops />

      {/* Deal of the Day */}
      <DealOfTheDay />

      {/* Feature Section */}
      <FeatureSection />

      {/* Testimonials */}
      <Testimonials />

      {/* Newsletter */}
      <Newsletter />

      {/* Coming Soon Teaser */}
      <section className="py-24 relative z-10 border-t border-white/10">
        <div className="container mx-auto text-center px-6">
          <h3 className="text-4xl md:text-6xl font-bold mb-6">
            metaverse<span className="text-purple-500">.store</span>
          </h3>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            The first fully immersive VR shopping mall is opening soon.
            Be the first to secure your virtual real estate.
          </p>
          <Button variant="premium" className="text-lg px-10 py-6 rounded-full">
            Join Waitlist
          </Button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
