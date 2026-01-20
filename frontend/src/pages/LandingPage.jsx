import React, { useEffect } from 'react';
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/Home/HeroSection";
import StatsSection from "../components/Home/StatsSection";
import ProblemSection from "../components/Home/ProblemSection";
import FeaturesSection from "../components/Home/FeaturesSection";
import RolesSection from "../components/Home/RolesSection";
import HowItWorksSection from "../components/Home/HowItWorksSection";
import PricingSection from "../components/Home/PricingSection";
import TestimonialsSection from "../components/Home/TestimonialsSection";
import FAQSection from "../components/Home/FAQSection";
import CTASection from "../components/Home/CTASection";

function LandingPage() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                }
            });
        }, { threshold: 0.1 });

        const sections = document.querySelectorAll('.reveal-section');
        sections.forEach(section => observer.observe(section));

        return () => sections.forEach(section => observer.unobserve(section));
    }, []);

    return (
        <div className="font-display bg-[#FAFAFA] text-[#111716] overflow-x-hidden min-h-screen relative selection:bg-primary/10 selection:text-primary tracking-tight antialiased">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[300px] h-[300px] md:w-[700px] md:h-[700px] bg-orange-500/5 md:bg-orange-500/10 -top-20 -left-20 mix-blend-multiply"></div>
                <div className="blob w-[200px] h-[200px] md:w-[600px] md:h-[600px] bg-amber-400/5 md:bg-amber-400/10 top-1/4 right-0 translate-x-1/4 mix-blend-multiply"></div>
                <div className="blob w-[300px] h-[300px] md:w-[800px] md:h-[800px] bg-orange-300/5 md:bg-orange-300/10 bottom-0 left-1/4 mix-blend-multiply"></div>
            </div>
            <Header />
            <main className="space-y-12 md:space-y-24 pb-12 md:pb-20">
                <div className="reveal-section"><HeroSection /></div>
                <div className="reveal-section"><StatsSection /></div>
                <div className="reveal-section"><ProblemSection /></div>
                <div className="reveal-section"><FeaturesSection /></div>
                <div className="reveal-section"><RolesSection /></div>
                <div className="reveal-section"><HowItWorksSection /></div>
                <div className="reveal-section"><PricingSection /></div>
                <div className="reveal-section"><TestimonialsSection /></div>
                <div className="reveal-section"><FAQSection /></div>
                <div className="reveal-section"><CTASection /></div>
            </main>
            <Footer />
        </div>
    )
}

export default LandingPage
