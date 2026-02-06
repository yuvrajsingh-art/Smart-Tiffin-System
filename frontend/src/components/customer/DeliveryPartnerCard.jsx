import React from 'react';

const DeliveryPartnerCard = ({ deliveryPartner }) => {
    return (
        <div className="p-6 rounded-[2rem] border border-gray-100 bg-gray-50/50 relative overflow-hidden group animate-[fadeIn_0.5s_ease-out]">
            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex gap-4 items-center">
                    <div className="size-14 rounded-2xl p-0.5 border-2 border-white relative shadow-md overflow-hidden bg-white shrink-0">
                        <img src={deliveryPartner.image} className="w-full h-full object-cover rounded-[0.9rem]" alt="Partner" />
                        {deliveryPartner.isOnline && (
                            <div className="absolute bottom-1 right-1 size-2.5 bg-primary border-2 border-white rounded-full shadow-[0_0_8px_rgba(244,114,22,0.4)]"></div>
                        )}
                    </div>
                    <div>
                        <h4 className="font-black text-[#2D241E] text-md tracking-tight leading-none mb-1">{deliveryPartner.name}</h4>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-0.5 text-primary text-[10px] font-black uppercase tracking-wider">
                                <span className="material-symbols-outlined text-[12px] fill-current">star</span>
                                {deliveryPartner.rating}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none">Fleet Member</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
                <a href={`tel:${deliveryPartner.phone}`} className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#111716] text-white font-black text-[9px] uppercase tracking-[0.2em] hover:bg-black transition-all">
                    <span className="material-symbols-outlined text-base">call</span>
                    Call
                </a>
                <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#2D241E] border border-gray-200 font-black text-[9px] uppercase tracking-[0.2em] hover:bg-gray-50 transition-all">
                    <span className="material-symbols-outlined text-base">chat_bubble</span>
                    Message
                </button>
            </div>
        </div>
    );
};

export default DeliveryPartnerCard;
