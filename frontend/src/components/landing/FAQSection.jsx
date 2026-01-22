import React, { useState } from 'react';

function FAQSection() {
    const faqs = [
        {
            question: "Is the Smart Tiffin app free for students?",
            answer: "Yes! Students can register, browse menus, and track their monthly subscriptions completely free of charge. You only pay for the meal plans you purchase from the mess."
        },
        {
            question: "Can I cancel a meal if I'm not eating?",
            answer: "Absolutely. We have a flexible 'Cancel Meal' feature that allows you to mark yourself absent for a specific meal (Lunch/Dinner) before a set cutoff time. This helps you save credits or money."
        },
        {
            question: "How do I pay for my subscription?",
            answer: "We support secure online payments via UPI, Credit/Debit Cards, and Net Banking. You can also pay directly to the mess owner if they support cash/offline payments, which will be manually updated in the app."
        },
        {
            question: "I am a Mess Owner. How can I register?",
            answer: "It's simple. Click on 'Get Started' and choose 'Mess Owner' during signup. You'll need to provide some basic details about your business. Once verified, you can start listing your menus instantly."
        },
        {
            question: "Is my data secure?",
            answer: "Security is our top priority. All your personal data and payment information are encrypted and stored securely. We do not share your data with third parties."
        }
    ];

    const [openIndex, setOpenIndex] = useState(0);

    return (
        <section className="max-w-4xl mx-auto w-full px-4 md:px-8" id="faq">
            <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 tracking-tight mb-2">Frequently Asked Questions</h2>
                <p className="text-sm text-gray-500">Got questions? We've got answers.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className={`glass-panel rounded-2xl overflow-hidden transition-all duration-300 ${openIndex === index ? 'ring-2 ring-primary/20' : ''}`}
                    >
                        <button
                            className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                            onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                        >
                            <span className="font-bold text-[#111716] text-base">{faq.question}</span>
                            <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-primary' : ''}`}>
                                expand_more
                            </span>
                        </button>
                        <div
                            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {faq.answer}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default FAQSection;
