import React from 'react';

function ProblemSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-4 md:px-8">
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600 tracking-tight mb-3">The Problem with Traditional Mess</h2>
                <p className="text-base text-[#6A717B] max-w-2xl mx-auto">Managing a mess manually is chaotic. We fixed it.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-red-200 transition-colors">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined text-2xl">menu_book</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111716]">Manual Registers</h3>
                    <p className="text-sm text-gray-500">Endless paperwork and manual entries lead to lost data and frustration.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-red-200 transition-colors">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined text-2xl">calculate</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111716]">Calculation Confusion</h3>
                    <p className="text-sm text-gray-500">Errors in monthly billing and daily counts cause financial losses.</p>
                </div>
                <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center gap-3 hover:border-red-200 transition-colors">
                    <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center text-red-600">
                        <span className="material-symbols-outlined text-2xl">history_toggle_off</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#111716]">No Tracking</h3>
                    <p className="text-sm text-gray-500">Students can't track their meal history or remaining balance easily.</p>
                </div>
            </div>
        </section>
    )
}

export default ProblemSection
