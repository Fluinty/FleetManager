import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { ForWhomSection } from "@/components/landing/ForWhomSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
    return (
        <>
            <HeroSection />
            <HowItWorksSection />
            <ForWhomSection />
            <PricingSection />
            <FAQSection />
            <Footer />
        </>
    );
}
