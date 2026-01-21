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
                <div className="blob w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-orange-200/20 -top-[10%] -left-[10%] mix-blend-multiply opacity-50 blur-[100px]"></div>
                <div className="blob w-[400px] h-[400px] md:w-[700px] md:h-[700px] bg-rose-200/20 top-1/4 right-0 mix-blend-multiply opacity-50 blur-[90px]"></div>
                <div className="blob w-[500px] h-[500px] md:w-[900px] md:h-[900px] bg-amber-100/30 bottom-0 left-1/4 mix-blend-multiply opacity-60 blur-[100px]"></div>
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
