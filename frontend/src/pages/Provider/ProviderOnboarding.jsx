import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Step1Identity from '../../components/provider/Onboarding/Step1Identity';
import Step2Legal from '../../components/provider/Onboarding/Step2Legal';
import Step3Operations from '../../components/provider/Onboarding/Step3Operations';
import Step4Banking from '../../components/provider/Onboarding/Step4Banking';

const ProviderOnboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        messName: '',
        ownerName: '',
        phone: '',
        logo: null,
        fssaiNumber: '',
        fssaiCertificate: null,
        address: '',
        deliveryRadius: 5,
        orderCutoffTime: '09:00',
        accountHolderName: '',
        accountNumber: '',
        ifscCode: ''
    });

    const nextStep = () => setCurrentStep(prev => prev + 1);
    const prevStep = () => setCurrentStep(prev => prev - 1);

    const handleStep1Submit = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/provider/onboarding/identity', {
                messName: formData.messName,
                ownerName: formData.ownerName,
                phone: formData.phone,
                logo: formData.logo
            });
            toast.success("Identity Saved");
            nextStep();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to save identity");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep2Submit = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/provider/onboarding/legal', {
                fssaiNumber: formData.fssaiNumber,
                fssaiCertificate: formData.fssaiCertificate
            });
            toast.success("Legal details saved");
            nextStep();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to save legal details");
        } finally {
            setIsLoading(false);
        }
    };

    const handleStep3Submit = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/provider/onboarding/operations', {
                address: formData.address,
                latitude: 28.6139, // Default for now
                longitude: 77.2090,
                deliveryRadius: formData.deliveryRadius,
                orderCutoffTime: formData.orderCutoffTime
            });
            toast.success("Operations setup saved");
            nextStep();
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to save operations");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinalSubmit = async () => {
        setIsLoading(true);
        try {
            await axios.post('/api/provider/onboarding/banking', {
                accountHolderName: formData.accountHolderName,
                accountNumber: formData.accountNumber,
                ifscCode: formData.ifscCode
            });
            toast.success("Onboarding Completed! 🎉");
            navigate('/provider/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to complete onboarding");
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="size-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    <p className="text-sm font-bold text-[#2D241E]/60 mt-4 uppercase tracking-widest">Saving Progress...</p>
                </div>
            );
        }

        switch (currentStep) {
            case 1:
                return <Step1Identity formData={formData} setFormData={setFormData} onNext={handleStep1Submit} />;
            case 2:
                return <Step2Legal formData={formData} setFormData={setFormData} onNext={handleStep2Submit} onPrev={prevStep} />;
            case 3:
                return <Step3Operations formData={formData} setFormData={setFormData} onNext={handleStep3Submit} onPrev={prevStep} />;
            case 4:
                return <Step4Banking formData={formData} setFormData={setFormData} onComplete={handleFinalSubmit} onPrev={prevStep} />;
            default:
                return <Step1Identity formData={formData} setFormData={setFormData} onNext={handleStep1Submit} />;
        }
    };

    return (
        <div className="relative flex flex-col items-center min-h-screen text-[#2D241E] bg-[#FFFBF5] overflow-x-hidden">

            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary bg-orange-400/20 blur-[120px] absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full"></div>
                <div className="blob blob-2 blob-secondary bg-red-400/10 blur-[100px] absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] rounded-full"></div>
            </div>

            {/* Header */}
            <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-orange-300 flex items-center justify-center text-white shadow-md">
                        <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2D241E] to-primary">Smart Tiffin</span>
                </div>
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-black text-[#5C4D42]/40 uppercase tracking-widest leading-none">Partnering as</span>
                        <span className="text-xs font-bold text-primary">Provider</span>
                    </div>
                    <button onClick={() => navigate('/login')} className="text-xs font-bold text-[#5C4D42]/60 hover:text-red-500 transition-colors">Exit</button>
                </div>
            </header>

            {/* Progress Bar Container */}
            <div className="w-full max-w-lg px-6 z-10 mt-4">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-black text-[#2D241E]/40 uppercase tracking-[0.2em]">Onboarding Progress</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{currentStep} of 4</span>
                </div>
                <div className="h-1.5 w-full bg-white/40 rounded-full overflow-hidden border border-white/20">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-orange-400 transition-all duration-500 ease-out"
                        style={{ width: `${(currentStep / 4) * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* Main Form Container */}
            <main className="w-full flex justify-center items-start pt-8 pb-12 px-4 z-10 flex-grow">
                <div className="glass-panel w-full max-w-lg rounded-[2.5rem] p-8 md:p-10 bg-white/60 backdrop-blur-xl border border-white/70 shadow-2xl shadow-primary/5 mx-auto min-h-[400px]">
                    {renderStep()}
                </div>
            </main>

            <footer className="py-6 text-center text-[#2D241E]/30 text-[10px] font-bold w-full relative z-10 uppercase tracking-widest">
                © 2026 Smart Tiffin System • Chef's Portal
            </footer>
        </div>
    );
};

export default ProviderOnboarding;
