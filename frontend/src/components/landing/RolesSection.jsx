import React from 'react';
import { Link } from 'react-router-dom';

function RolesSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6 py-10" id="roles">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Eater Card */}
                <div className="glass-panel rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow flex flex-col h-full min-h-[500px]">
                    <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCNVCDMliaUdGyF8cPtHt4lGPDyEo6CNQ8NwD0AmEHWUY7SDEHdlPF8qnuNf65J4IYZY0LfsHg_FCJFFjN5p04BjTw3yHOUwSYdLQtFnSf-wHDRI4ygBD2Zizj8QdtLoo-SESKqMSK3C44AHbJ8dYzT1LzwRzbeU06Fcaep_pY299lYel5DMTC68A6_SavJ3IyMkFJ98iPyRI4PnGQixYiVG5taIzQ1nZD-Q_00OLvx_8Z8rgsEYoNHUKQ_ctBa1SCglAM1gM6j')" }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">Student</span>
                            <h3 className="text-2xl font-bold">I want to Eat</h3>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow items-start">
                        <p className="text-secondary/70 mb-6 flex-grow text-lg">Browse nearby messes, subscribe to monthly plans, and never miss a home-cooked meal again.</p>
                        <Link to="/role-selection" className="flex items-center gap-2 text-primary font-bold hover:text-secondary transition-colors text-lg">
                            Join as Eater <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
                {/* Provider Card */}
                <div className="glass-panel rounded-2xl overflow-hidden group hover:shadow-xl transition-shadow flex flex-col h-full min-h-[500px]">
                    <div className="h-64 bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAg_9In9jykwB9Xpx1GALOSgxtX3ZWo8vn7Eop86MZjuImlwLgF4FbGNc4320yUBls5ze1zuvQqFo46YoZ3p7j0fASGbwHNUSi3vQHhdB94FwA8686TaZAwZOcHBom8lUhasCpb-OPr1xX-faojUuyT2HEAArefJaxuJlXJzGCR3qR9-lLs5GFZYuxuhUQXfMKtyzcEX_YO968hiDIc_7yq_z_wuJo0Qac_md7_q8wtFlf884nUWzX4yNbzQDa4gHpuqlAGRpJr')" }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-secondary/80 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                            <span className="bg-white text-secondary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 inline-block">Kitchen Partner</span>
                            <h3 className="text-2xl font-bold">I want to Serve</h3>
                        </div>
                    </div>
                    <div className="p-8 flex flex-col flex-grow items-start">
                        <p className="text-secondary/70 mb-6 flex-grow text-lg">Digitize your mess, manage subscriptions automatically, and get paid on time, every time.</p>
                        <Link to="/role-selection" className="flex items-center gap-2 text-secondary font-bold hover:text-primary transition-colors text-lg">
                            Partner with Us <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default RolesSection;
