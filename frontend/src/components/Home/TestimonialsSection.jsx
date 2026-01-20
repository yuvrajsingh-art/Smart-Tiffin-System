import React from 'react';

function TestimonialsSection() {
    return (
        <section className="max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                    </div>
                    <p className="text-lg text-[#111716] italic">"The Smart Tiffin app saved me so much time. No more arguments about whether I ate or not, it's all in the app!"</p>
                    <div className="flex items-center gap-4 mt-auto">
                        <img alt="Student portrait" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMgkmnlVyXwiGbwjntBdrDHFUlyHOll5mj7IZVHsb2tjiJD7NOWN97NvtocAAyguiSp8vntG2B46w-4ctia61Btezu3ty2hQ7W9907QxsOsMHDdMYAUiV1EVLPzQgYN6zc6vr8CohQvj5T8-Xt91J6aEEhKX3GZ3M0_SUl-kbHG6N6kB1GcR1SoB-jhUN-LAz9gnKqAhDBW0m6sNxzdZGx78cWIaf-t7rQG5CMQAJW6rA5ECVwI56ZzEpgHDS9KYmXiovDRojtBC8" />
                        <div>
                            <p className="font-bold text-[#111716]">Rohan Das</p>
                            <p className="text-xs text-gray-500">Final Year Student</p>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-3xl flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-primary mb-2">
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                        <span className="material-symbols-outlined">star</span>
                    </div>
                    <p className="text-lg text-[#111716] italic">"Management has never been easier. I can predict food quantities accurately and track payments effortlessly."</p>
                    <div className="flex items-center gap-4 mt-auto">
                        <img alt="Owner portrait" className="w-12 h-12 rounded-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuyoZ1WxEmlxEqbX3jULs-nDGnqIjRYxJB2jDdET16unCHP54_zyF42kMDCbcosk9QInHP2LlVgxvt4h2Vk39k4EKEHxQCKczQkc4yjCfujSH2ZucDFDohHs8Xj8vOSDw6-VRfjrx1SHaQU0xbBQwCHbKWd7MOsxY9er54OGV-zN2EvKdMdF-BJBoPrSIRCIoz2lvNbYzrPIHn2DcIq82FVoV5NNcPup4tSTXUMXOuajUtzWtr3xLM2kZS8I_e0fSv80zDwZNrW6k" />
                        <div>
                            <p className="font-bold text-[#111716]">Mrs. Iyer</p>
                            <p className="text-xs text-gray-500">Mess Owner</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection
