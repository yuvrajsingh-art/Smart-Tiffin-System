import React from 'react';

const LiveTrackingMap = ({ eta, distance, deliveryPartner }) => {
    return (
        <div className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white group animate-[fadeIn_0.5s_ease-out]">
            <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1000&auto=format&fit=crop"
                alt="Map View"
                className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-[2s] contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D241E]/90 via-transparent to-black/10"></div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="size-[250px] border border-primary/20 rounded-full animate-[ping_3s_linear_infinite]"></div>
                <div className="size-[150px] border border-primary/30 rounded-full animate-[ping_3s_linear_infinite_0.5s] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            </div>

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative group/marker cursor-pointer">
                    <div className="size-14 bg-primary/30 rounded-full animate-ping absolute inset-0"></div>
                    <div className="size-14 bg-white rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white transition-transform group-hover/marker:scale-110">
                        <span className="material-symbols-outlined text-2xl text-primary">two_wheeler</span>
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#2D241E] text-white text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover/marker:opacity-100 transition-all whitespace-nowrap pointer-events-none uppercase tracking-widest">
                        {deliveryPartner.name} is on the way!
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#2D241E]"></div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex justify-between items-end bg-gradient-to-t from-black/50 to-transparent">
                <div className="animate-[slideRight_0.5s_ease-out]">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                        <p className="text-[10px] font-black opacity-80 uppercase tracking-widest">Estimated Arrival</p>
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter">{eta}<span className="text-xl ml-1 align-baseline opacity-80">mins</span></h3>
                </div>
                <div className="text-right animate-[slideLeft_0.5s_ease-out]">
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">Distance</p>
                    <h3 className="text-2xl font-black">{distance}</h3>
                </div>
            </div>
        </div>
    );
};

export default LiveTrackingMap;
