import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/Home/HeroSection";
import ProblemSection from "../components/Home/ProblemSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import RolesSection from "../components/Home/RolesSection";
import HowItWorksSection from "../components/Home/HowItWorksSection";
import TechStackSection from "../components/Home/TechStackSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import CTASection from "../components/Home/CTASection";

function LandingPage() {
    return (
        <div className="font-display bg-[#FFF8F0] text-[#23282F] overflow-x-hidden min-h-screen relative selection:bg-primary/20 selection:text-primary">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[700px] h-[700px] bg-orange-600/30 -top-40 -left-20"></div>
                <div className="blob w-[600px] h-[600px] bg-amber-400/30 top-1/4 right-0 translate-x-1/4"></div>
                <div className="blob w-[800px] h-[800px] bg-orange-300/30 bottom-0 left-1/4"></div>
                <div className="blob w-[500px] h-[500px] bg-yellow-400/20 bottom-20 right-20"></div>
            </div>
            <Header />
            <main className="space-y-24 pb-20">
                <HeroSection />
                <ProblemSection />
                <FeaturesSection />
                <RolesSection />
                <HowItWorksSection />
                <TechStackSection />
                <TestimonialsSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    )
}

export default LandingPage
