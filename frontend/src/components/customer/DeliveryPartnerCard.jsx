import React from 'react';

const DeliveryPartnerCard = ({ deliveryPartner }) => {
    return (
        <div className="glass-panel p-6 rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-white/80 to-orange-50/50 shadow-lg relative overflow-hidden group animate-[fadeIn_0.5s_ease-out]">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-6xl">delivery_dining</span>
            </div>

            <div className="flex gap-4 items-center mb-6 relative z-10">
                <div className="size-16 rounded-full p-1 border-2 border-primary relative shadow-md overflow-hidden bg-white">
                    <img src={deliveryPartner.image} className="w-full h-full object-cover rounded-full" alt="Driver" />
                    {deliveryPartner.isOnline && <div className="absolute bottom-0 right-0 size-4 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>
                <div>
                    <h4 className="font-black text-[#2D241E] text-xl leading-none">{deliveryPartner.name}</h4>
                    <div className="flex items-center gap-1 mt-1.5">
                        <span className="bg-[#2D241E] text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">{deliveryPartner.rating} ★</span>
                        <span className="text-[10px] font-bold text-[#5C4D42] opacity-60 uppercase tracking-widest">• Delivery Partner</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <a href={`tel:${deliveryPartner.phone}`} className="py-3 rounded-xl bg-[#2D241E] text-white font-black text-xs uppercase tracking-widest shadow-lg hover:bg-black hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group/btn">
                    <span className="material-symbols-outlined text-lg group-hover/btn:animate-shake">call</span>
                    Call
                </a>
                <button className="py-3 rounded-xl bg-white text-[#2D241E] border border-gray-100 font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">chat</span>
                    Message
                </button>
            </div>
        </div>
    );
};

export default DeliveryPartnerCard;
