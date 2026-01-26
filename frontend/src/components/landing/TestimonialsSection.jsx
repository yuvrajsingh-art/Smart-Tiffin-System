import React from 'react';

function TestimonialsSection() {
    return (
        <section className="py-10" id="reviews">
            <h2 className="text-3xl font-black text-secondary text-center mb-10">Stories from the Table</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-panel p-8 rounded-2xl relative">
                    <span className="material-symbols-outlined absolute top-6 right-6 text-4xl text-primary/20">format_quote</span>
                    <p className="text-lg font-medium text-secondary/80 italic mb-6">"Finally, I don't have to worry about carrying cash or losing those paper cards. The food tracking is a lifesaver during exams."</p>
                    <div className="flex items-center gap-4">
                        <img alt="Student Reviewer" className="w-12 h-12 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJBUDU7d8RpZHw4DRjglzpDUlKxe-pLReeHVViDUpqb3nx5HK8zv_G5xSwDKDmYDGZmKphRayTcWirWs2hfZhUn2otxWzKB6hPGtjjWuLGp4qMdQ4RoUmKKhRaJm_k3DpjsVFHDiUlfLI-4BIGDI4mroaoDf_5FApqIc3fngMBmLZAHsPl1i4DfnDj42Wbuspx7dgQ4ZnF5CeZzNJjrfV9EfKUSmGpf8a4nkgR4ZRHZTaeZBxdDBf9XpM7SDRkzDMvxrovgm2F" />
                        <div>
                            <h4 className="font-bold text-secondary">Rohan Sharma</h4>
                            <p className="text-xs text-secondary/60">Engineering Student, Kota</p>
                        </div>
                    </div>
                </div>
                <div className="glass-panel p-8 rounded-2xl relative">
                    <span className="material-symbols-outlined absolute top-6 right-6 text-4xl text-primary/20">format_quote</span>
                    <p className="text-lg font-medium text-secondary/80 italic mb-6">"Smart Tiffin helped me scale my mess business by 3x. The automated billing saved me hours of manual calculation every night."</p>
                    <div className="flex items-center gap-4">
                        <img alt="Mess Owner Reviewer" className="w-12 h-12 rounded-full" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5AZGYsXWYp1r-KOoVDW0IFl9WDtpDDYMXI0RRzeMJcupE1NE-L1R5RGjz80X5NZFFvu1834ZcWwPeM__1-3-hs_sli6x9bpXc52QGEMhBF900_TPcSy5nLV_pnYBi3JmduySANwGwGZqZ3eSogT0SvRcnFlfOE9YsCZlvL4yhqRJrYTuQ85x-NiTSKV3HqAsYjgiF23fksK2LI71Yi_dGoLOs4MLYNq45UhwdNA9M73UNN-Y36YQzMps_fVJMjN_KGjsLj2-5" />
                        <div>
                            <h4 className="font-bold text-secondary">Anjali Gupta</h4>
                            <p className="text-xs text-secondary/60">Owner, Annapurna Mess</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TestimonialsSection;
