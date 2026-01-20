import React from 'react';

function ProblemSection() {
    return (
        <section className="max-w-7xl mx-auto w-full">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#111716] tracking-tight mb-4">The Problem with Traditional Mess</h2>
                <p className="text-lg text-[#6A717B] max-w-2xl mx-auto">Managing a mess manually is chaotic. We fixed it.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-red-200 transition-colors">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined text-3xl">menu_book</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111716]">Manual Registers</h3>
                    <p className="text-gray-500">Endless paperwork and manual entries lead to lost data and frustration.</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-red-200 transition-colors">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined text-3xl">calculate</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111716]">Calculation Confusion</h3>
                    <p className="text-gray-500">Errors in monthly billing and daily counts cause financial losses.</p>
                </div>
                <div className="glass-panel p-8 rounded-2xl flex flex-col items-center text-center gap-4 hover:border-red-200 transition-colors">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined text-3xl">history_toggle_off</span>
                    </div>
                    <h3 className="text-xl font-bold text-[#111716]">No Tracking</h3>
                    <p className="text-gray-500">Students can't track their meal history or remaining balance easily.</p>
                </div>
            </div>
        </section>
    )
}

export default ProblemSection
