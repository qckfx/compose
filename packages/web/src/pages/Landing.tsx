import Hero from "@/components/hero";
import Features from "@/components/features";
import Workflow from "@/components/workflow";
import Testimonials from "@/components/testimonials";
import Pricing from "@/components/pricing";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { EnableScrolling } from "@/components/EnableScrolling";
import { useFeatureFlagEnabled } from "posthog-js/react";

export default function Landing() {
  const showPricing = useFeatureFlagEnabled("show-pricing");

  return (
    <>
      <EnableScrolling />
      <main className="min-h-screen bg-neutral-50">
        <Navbar />
        <Hero />
        <Features />
        <Workflow />
        <Testimonials />
        {showPricing && <Pricing />}
        <Footer />
      </main>
    </>
  );
}
