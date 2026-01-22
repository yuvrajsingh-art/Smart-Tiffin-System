import React from 'react';

function TestimonialsSection() {
    return (
        <section className="max-w-7xl mx-auto w-full px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="glass-panel p-12 rounded-[3rem] flex flex-col gap-8 relative overflow-hidden">
                    <span className="material-symbols-outlined text-8xl absolute -top-4 -right-4 opacity-5 text-primary rotate-12">format_quote</span>
                    <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                    </div>
                    <p className="text-2xl text-[#2D241E] font-bold italic leading-relaxed relative z-10">
                        "This system revolutionized my university life. No more standing in long lines or worrying about manual entries. It's so fast!"
                    </p>
                    <div className="flex items-center gap-5 mt-auto">
                        <img alt="Student" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMgkmnlVyXwiGbwjntBdrDHFUlyHOll5mj7IZVHsb2tjiJD7NOWN97NvtocAAyguiSp8vntG2B46w-4ctia61Btezu3ty2hQ7W9907QxsOsMHDdMYAUiV1EVLPzQgYN6zc6vr8CohQvj5T8-Xt91J6aEEhKX3GZ3M0_SUl-kbHG6N6kB1GcR1SoB-jhUN-LAz9gnKqAhDBW0m6sNxzdZGx78cWIaf-t7rQG5CMQAJW6rA5ECVwI56ZzEpgHDS9KYmXiovDRojtBC8" />
                        <div>
                            <p className="font-black text-xl text-[#2D241E]">Rohan Das</p>
                            <p className="text-[#5C4D42] font-semibold">Senior Engineering Student</p>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-12 rounded-[3rem] flex flex-col gap-8 relative overflow-hidden">
                    <span className="material-symbols-outlined text-8xl absolute -top-4 -right-4 opacity-5 text-primary rotate-12">format_quote</span>
                    <div className="flex items-center gap-1 text-primary">
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                        <span className="material-symbols-outlined font-bold">star</span>
                    </div>
                    <p className="text-2xl text-[#2D241E] font-bold italic leading-relaxed relative z-10">
                        "I finally have peace of mind. I know exactly how much food to prepare every day, and my revenue tracking is now 100% accurate."
                    </p>
                    <div className="flex items-center gap-5 mt-auto">
                        <img alt="Owner" className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuyoZ1WxEmlxEqbX3jULs-nDGnqIjRYxJB2jDdET16unCHP54_zyF42kMDCbcosk9QInHP2LlVgxvt4h2Vk39k4EKEHxQCKczQkc4yjCfujSH2ZucDFDohHs8Xj8vOSDw6-VRfjrx1SHaQU0xbBQwCHbKWd7MOsxY9er54OGV-zN2EvKdMdF-BJBoPrSIRCIoz2lvNbYzrPIHn2DcIq82FVoV5NNcPup4tSTXUMXOuajUtzWtr3xLM2kZS8I_e0fSv80zDwZNrW6k" />
                        <div>
                            <p className="font-black text-xl text-[#2D241E]">Mrs. Iyer</p>
                            <p className="text-[#5C4D42] font-semibold">Tiffin Service Proprietor</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection;
