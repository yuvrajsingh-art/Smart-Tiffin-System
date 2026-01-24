import React from 'react';
import { Link } from 'react-router-dom';

const RoleSelection = () => {
    return (
        <div className="min-h-screen md:h-screen w-full relative flex flex-col md:overflow-hidden bg-[#FFFBF5]">
            {/* Background Blobs (Unified) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary"></div>
                <div className="blob blob-2 blob-secondary"></div>
            </div>

            {/* Header */}
            <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-orange-300 flex items-center justify-center text-white shadow-md">
                        <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2D241E] to-primary">Smart Tiffin</span>
                </div>
                <Link to="/" className="text-xs font-bold text-[#5C4D42] hover:text-primary flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span> Back
                </Link>
            </header>

            {/* Main Content */}
            <main className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 w-full max-w-5xl mx-auto h-full min-h-0">
                <div className="text-center mb-6 flex-shrink-0 animate-[fadeIn_0.5s_ease-out]">
                    <h1 className="text-2xl md:text-3xl font-black text-[#2D241E] mb-1">Select Role</h1>
                    <p className="text-sm text-[#5C4D42]/80 font-medium">Join as a Student or Provider</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl h-auto items-center justify-center">

                    {/* Customer Card - Compact Vertical (320px) */}
                    <div className="glass-panel group rounded-3xl overflow-hidden flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/60 border border-white/50 h-80 w-full max-w-sm mx-auto">
                        <div className="h-32 bg-gray-100 relative overflow-hidden flex-shrink-0">
                            <img alt="Student" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNVCDMliaUdGyF8cPtHt4lGPDyEo6CNQ8NwD0AmEHWUY7SDEHdlPF8qnuNf65J4IYZY0LfsHg_FCJFFjN5p04BjTw3yHOUwSYdLQtFnSf-wHDRI4ygBD2Zizj8QdtLoo-SESKqMSK3C44AHbJ8dYzT1LzwRzbeU06Fcaep_pY299lYel5DMTC68A6_SavJ3IyMkFJ98iPyRI4PnGQixYiVG5taIzQ1nZD-Q_00OLvx_8Z8rgsEYoNHUKQ_ctBa1SCglAM1gM6j" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-3 left-5 text-white">
                                <span className="inline-block px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-wider mb-1">Student</span>
                                <h2 className="text-xl font-bold leading-none">I want to Eat</h2>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1 justify-between">
                            <div className="space-y-2">
                                {[
                                    { icon: 'search', title: 'Browse Messes' },
                                    { icon: 'calendar_month', title: 'Manage Plans' },
                                    { icon: 'monitoring', title: 'Track Diet' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-orange-50 text-primary flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#2D241E]">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/register?role=customer" className="w-full bg-primary hover:bg-[#e04112] text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 hover:shadow-lg">
                                Join as Eater <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                    {/* Provider Card - Compact Vertical (320px) */}
                    <div className="glass-panel group rounded-3xl overflow-hidden flex flex-col shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white/60 border border-white/50 h-80 w-full max-w-sm mx-auto">
                        <div className="h-32 bg-gray-100 relative overflow-hidden flex-shrink-0">
                            <img alt="Chef" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAg_9In9jykwB9Xpx1GALOSgxtX3ZWo8vn7Eop86MZjuImlwLgF4FbGNc4320yUBls5ze1zuvQqFo46YoZ3p7j0fASGbwHNUSi3vQHhdB94FwA8686TaZAwZOcHBom8lUhasCpb-OPr1xX-faojUuyT2HEAArefJaxuJlXJzGCR3qR9-lLs5GFZYuxuhUQXfMKtyzcEX_YO968hiDIc_7yq_z_wuJo0Qac_md7_q8wtFlf884nUWzX4yNbzQDa4gHpuqlAGRpJr" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"></div>
                            <div className="absolute bottom-3 left-5 text-white">
                                <span className="inline-block px-1.5 py-0.5 rounded bg-white/20 backdrop-blur-md border border-white/20 text-[9px] font-bold uppercase tracking-wider mb-1">Partner</span>
                                <h2 className="text-xl font-bold leading-none">I want to Serve</h2>
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1 justify-between">
                            <div className="space-y-2">
                                {[
                                    { icon: 'devices', title: 'Go Digital' },
                                    { icon: 'receipt_long', title: 'Auto Billing' },
                                    { icon: 'trending_up', title: 'Grow Sales' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-orange-50 text-primary flex items-center justify-center flex-shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
                                        </div>
                                        <span className="text-sm font-bold text-[#2D241E]">{item.title}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to="/register?role=provider" className="w-full bg-[#111716] hover:bg-black text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 mt-2 hover:shadow-lg">
                                Partner with Us <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                            </Link>
                        </div>
                    </div>

                </div>

                <div className="mt-6 text-center flex-shrink-0">
                    <p className="text-xs text-[#5C4D42]/60">
                        Already have an account? <Link className="text-primary font-bold hover:underline" to="/login">Log in here</Link>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full py-3 text-center border-t border-orange-100/30 flex-shrink-0 bg-white/40">
                <p className="text-[10px] text-[#5C4D42]/40">© 2024 Smart Tiffin • Privacy</p>
            </footer>
        </div>
    );
};

export default RoleSelection;
