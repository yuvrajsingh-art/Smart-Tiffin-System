import React from 'react';

const BankDetailsCard = ({ bank }) => {
    if (!bank) return null;

    return (
        <div className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-xl relative overflow-hidden group animate-[scaleIn_0.3s_ease-out]">
            <div className="absolute -top-10 -right-10 opacity-5 rotate-12 transition-transform group-hover:rotate-0">
                <span className="material-symbols-outlined text-[10rem]">account_balance</span>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Linked Bank Account</p>
                        <h3 className="text-xl font-black text-[#2D241E] uppercase">{bank.name}</h3>
                    </div>
                    <div className="px-3 py-1 bg-green-50 rounded-full border border-green-100">
                        <p className="text-[9px] font-black text-green-600 uppercase tracking-tighter">Verified</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Available Balance</p>
                        <h4 className="text-2xl font-black text-[#2D241E]">₹{bank.balance?.toLocaleString()}</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
                            <p className="text-sm font-black text-[#2D241E]">{bank.accountNumber}</p>
                        </div>
                        <div>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">UPI ID</p>
                            <p className="text-sm font-black text-[#2D241E]">{bank.vpa}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 text-sm">info</span>
                    <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">This is a simulated bank account for testing payments.</p>
                </div>
            </div>
        </div>
    );
};

export default BankDetailsCard;
