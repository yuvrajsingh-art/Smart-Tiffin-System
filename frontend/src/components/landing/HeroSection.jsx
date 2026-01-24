import React from 'react';
import { Link } from 'react-router-dom';

function HeroSection() {
    return (
        <section className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20 min-h-[80vh] pt-10">
            <div className="flex-1 flex flex-col items-start gap-8 z-10 animate-[fadeIn_0.5s_ease-out]">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 rounded-full border border-white/60 shadow-sm backdrop-blur-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-secondary tracking-wide uppercase">Now Live in Kota & Indore</span>
                </div>
                <h1 className="text-5xl lg:text-7xl font-black text-secondary leading-[1.1] tracking-tight">
                    Ghar Jaisa Khana, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">Door Reh Kar Bhi.</span>
                </h1>
                <p className="text-lg lg:text-xl text-secondary/70 max-w-lg leading-relaxed font-medium">
                    Experience the warmth of home-cooked meals delivered with tech-enabled precision. No more lost coupons, just pure taste.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                    <Link to="/role-selection" className="bg-primary hover:bg-primary-dark text-white h-14 px-8 rounded-full text-base font-bold transition-all shadow-xl shadow-primary/30 flex items-center gap-2 hover:scale-105">
                        View Daily Menu
                        <span className="material-symbols-outlined">arrow_forward</span>
                    </Link>
                    <button className="h-14 px-8 rounded-full text-base font-bold text-secondary bg-white/50 border border-white/60 hover:bg-white transition-all flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary">play_circle</span>
                        Watch Video
                    </button>
                </div>
                <div className="flex items-center gap-4 mt-6">
                    <div className="flex -space-x-3">
                        <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLZFKAB8lqHNMT9qzGnIqNYmGdZTCTtXeKa19A7SyhI-cO7sbXUhMSQn0H_2YGEekyxAx0CbVJizJoq44pKUA3V6TfpCkLZtN3zoiE4ePDBvBlplDTewqYmaqcs9OzAW4NemwQylEacycsCtLyPrNF3jRp6YapPgwdl7SHRz4D6chRRYdybOC_YseiyWwZLVlUTrzuC3NxFzWOTZjUBin8pbhYZszSe6ldL38DVsobJDyXlsJjbNOuevNohd6IK4-wOU-IIDHz" />
                        <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuALIZQPCvJizi8YXMNQpoPjxU0X9SE0_gfn5ymWRW263sJcvvuxTi_pQXSCtL2IZ39bLQYgM62iDD5cJwazHaXZMPsWvcm89bw3nCmYzRY_UXMlUsTgHjIqaGgg6EW91hu3UuRbNhmZ2c7eHqQeGZVkX3u0LerjIOYFIVVe4c3R-Ws4Umyl1WQDHRwjfS9J9tjEgI51SNbrCfJKCcs5UjNTsDkPhUjuJsPAPTk-LtBBu9NR05uJyRA3NmG-qLIkLulNMpJC2nxn" />
                        <img alt="User Avatar" className="w-10 h-10 rounded-full border-2 border-white" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDW3-Uyi2mPbT4mnArNp5xI1a3YbDUaJ3Vd32CfZxh4-vvtYldowpWJTTmsQdEYVaJtAYwVT7C4f7ltD_B28c3nRetB2mTuTZzWLDGdBq4POCl4gN4Wn4K_6z-7a51FhG_lwzWsDXu0J1PPIrMoGjon_QmgfJSm8XEMk-cUqf-emKObp8u0tJteWk2-kdGATBGxNzvYK4UqGoCQUgdsG2E2gIG7lJFiil458UHP-HtYcHHW02yk94jbC9ceghLKX9GJu3reFpgA" />
                        <div className="w-10 h-10 rounded-full border-2 border-white bg-secondary text-white flex items-center justify-center text-xs font-bold">+2k</div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex text-yellow-500 text-sm">★★★★★</div>
                        <span className="text-xs font-semibold text-secondary/60">Happy Students</span>
                    </div>
                </div>
            </div>
            <div className="flex-1 relative w-full flex justify-center lg:justify-end animate-[fadeIn_0.5s_ease-out_0.2s]">
                {/* Decorative Glow Behind Image */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-400/20 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative w-full max-w-[500px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl shadow-orange-900/10 group">
                    <img alt="Delicious Indian Thali with various curries and roti" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDRbCML920fVXfkmdpm94lCGJjr6pcGRb7iv4-LWVwO-PjKSOOZAuAMNG90iidQeFGiCfC6aifg0NCN_OuTaCZpVorf2ps7Y840Cw9i2AxU2HYDln7e7af4BsSubsPQsOzn9bpb3IXLRLu1RVZd4zaDGPscmess5fpLM5wbtxq5iR4SUtmjhZVwpuZKggql7oN_kvmleO3qIx9uyUjcy-jPMPYSfERcjvYdSbP6p6iiDpwtLHmVoAT1m6svhLxn5tT-nqbw7Bhh" />
                    {/* Floating Badge */}
                    <div className="absolute bottom-8 left-8 glass-panel px-5 py-3 rounded-full flex items-center gap-3 pulsing-badge">
                        <div className="bg-green-100 text-green-700 p-1.5 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-sm">verified</span>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-secondary">#1 Tiffin Service</p>
                            <p className="text-[10px] font-semibold text-secondary/60">Voted by Students</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection;