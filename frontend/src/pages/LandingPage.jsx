import React, { useEffect } from 'react';
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import HeroSection from "../components/landing/HeroSection";
import StatsSection from "../components/landing/StatsSection";
import ProblemSection from "../components/landing/ProblemSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import RolesSection from "../components/landing/RolesSection";
import HowItWorksSection from "../components/landing/HowItWorksSection";
import PricingSection from "../components/landing/PricingSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import FAQSection from "../components/landing/FAQSection";
import CTASection from "../components/landing/CTASection";


import TechStackSection from "../components/landing/TechStackSection";

// ... imports remain the same, just remove unused ones if cleaning up, 
// strictly we will just use the available components in the new order

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
        <div className="font-display mesh-gradient text-[#2D241E] overflow-x-hidden min-h-screen relative selection:bg-primary/20 selection:text-primary">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[600px] h-[600px] bg-orange-200/40 -top-40 -left-20"></div>
                <div className="blob w-[500px] h-[500px] bg-amber-100/40 top-1/4 right-0"></div>
                <div className="blob w-[700px] h-[700px] bg-orange-100/30 bottom-0 left-1/4"></div>
            </div>
            <Header />
            <main className="relative z-10 pt-20 pb-16 px-4 md:px-8 max-w-[1280px] mx-auto flex flex-col gap-16">
                <div className="reveal-section"><HeroSection /></div>
                <div className="reveal-section"><ProblemSection /></div>
                <div className="reveal-section"><FeaturesSection /></div>
                <div className="reveal-section"><RolesSection /></div>
                <div className="reveal-section"><HowItWorksSection /></div>
                <div className="reveal-section"><TechStackSection /></div>
                <div className="reveal-section"><PricingSection /></div>
                <div className="reveal-section"><TestimonialsSection /></div>
                <div className="reveal-section"><CTASection /></div>
            </main>
            <Footer />
        </div>
    )
}

export default LandingPage
