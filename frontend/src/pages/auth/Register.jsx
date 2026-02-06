import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import useGeolocation from "../../hooks/useGeolocation";

const Register = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role") || "customer";

    const [formData, setFormData] = useState({
        role: role,
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        address: {
            country: "",
            state: "",
            city: "",
            street: "",
            pincode: "",
        },
    });

    const [errors, setErrors] = useState({});
    const [showManualAddress, setShowManualAddress] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    useEffect(() => {
        const pass = formData.password;
        let score = 0;
        if (!pass) {
            setPasswordStrength(0);
            return;
        }
        if (pass.length > 5) score += 1;
        if (pass.length > 8) score += 1;
        if (/[0-9]/.test(pass)) score += 1;
        if (/[^A-Za-z0-9]/.test(pass)) score += 1;
        setPasswordStrength(score);
    }, [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };

    const handleAddressChange = (e) => {
        setFormData({
            ...formData,
            address: { ...formData.address, [e.target.name]: e.target.value },
        });
        if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = "Full Name is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) newErrors.email = "Email is required";
        else if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email format";

        const phoneRegex = /^\d{10}$/;
        if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
        else if (!phoneRegex.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";

        if (!formData.password) newErrors.password = "Password is required";
        else if (formData.password.length < 6) newErrors.password = "Min 6 characters required";

        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";

        if (!showManualAddress) {
            if (!formData.address.city) {
                newErrors.general = "Please provide location";
                setShowManualAddress(true);
            }
        } else {
            if (!formData.address.city.trim()) newErrors.city = "City is required";
            if (!formData.address.street.trim()) newErrors.street = "Street is required";
            if (!formData.address.pincode.trim()) newErrors.pincode = "Pincode is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error("Please fill all required fields correctly.");
            return;
        }

        setLoadingLocation(true); // Re-using this for general loading state
        try {
            const endpoint = role === 'provider' ? '/api/auth/registerProvider/provider' : '/api/auth/registerCustomer/customer';

            const payload = {
                fullName: formData.name,
                email: formData.email,
                password: formData.password,
                mobile: formData.phone,
                address: `${formData.address.street}, ${formData.address.city} - ${formData.address.pincode}`,
                latitude: 28.6139, // Default for now if location fails
                longitude: 77.2090
            };

            const { data } = await axios.post(endpoint, payload);

            if (data.token) {
                localStorage.setItem('token', data.token);
                // Note: UserContext will pick up the token and fetch profile

                toast.success(`Welcome ${data.user.fullName}!`);

                // Redirection based on role
                if (data.user.role === 'provider') {
                    navigate('/provider/onboarding');
                } else {
                    navigate('/customer/dashboard');
                }

                // Force reload to update context state if necessary
                window.location.reload();
            }
        } catch (error) {
            console.error("Registration Error:", error);
            toast.error(error.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setLoadingLocation(false);
        }
    };

    const { getLocation, reverseGeocode, loading: locationLoading } = useGeolocation();

    const handleAllowLocation = async () => {
        setLoadingLocation(true);
        try {
            const coords = await getLocation();
            const addr = await reverseGeocode(coords.latitude, coords.longitude);

            setFormData(prev => ({
                ...prev,
                address: {
                    country: addr.country,
                    state: addr.state,
                    city: addr.city,
                    street: addr.street,
                    pincode: addr.pincode,
                }
            }));

            setShowManualAddress(true);
            toast.success("Location detected accurately!");
        } catch (err) {
            toast.error(err || "Could not fetch address. Enter manually.");
            setShowManualAddress(true);
        } finally {
            setLoadingLocation(false);
        }
    };

    const getStrengthStyles = () => {
        switch (passwordStrength) {
            case 0: return { width: '0%', color: 'bg-gray-200' };
            case 1: return { width: '25%', color: 'bg-red-500' };
            case 2: return { width: '50%', color: 'bg-orange-500' };
            case 3: return { width: '75%', color: 'bg-yellow-500' };
            case 4: return { width: '100%', color: 'bg-green-500' };
            default: return { width: '0%', color: 'bg-gray-200' };
        }
    };
    const strength = getStrengthStyles();

    return (
        <div className="relative flex flex-col items-center min-h-screen text-[#2D241E] bg-[#FFFBF5] overflow-x-hidden">

            {/* Background Blobs (Unified) */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="blob blob-1 blob-primary"></div>
                <div className="blob blob-2 blob-secondary"></div>
            </div>

            {/* Header (Synced with Role Page) */}
            <header className="w-full max-w-7xl px-6 py-6 flex justify-between items-center z-50">
                <div className="flex items-center gap-2">
                    <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-orange-300 flex items-center justify-center text-white shadow-md">
                        <span className="material-symbols-outlined text-[18px]">lunch_dining</span>
                    </div>
                    <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#2D241E] to-primary">Smart Tiffin</span>
                </div>
                <div className="hidden sm:block">
                    <span className="text-xs text-[#5C4D42]/80 font-medium">Already have an account?</span>
                    <Link to="/login" className="ml-2 text-xs font-bold text-primary hover:text-[#e04112] transition-colors">Log in</Link>
                </div>
            </header>

            {/* Main Form Container (Responsive) */}
            <main className="w-full flex justify-center items-start pt-4 pb-12 px-4 z-10 flex-grow">
                <div className="glass-panel w-full max-w-lg rounded-[2rem] p-6 md:p-8 bg-white/60 backdrop-blur-xl border border-white/70 shadow-2xl shadow-primary/5 mx-auto">

                    <div className="mb-6 text-center">
                        <h1 className="text-2xl font-black text-[#2D241E] mb-1">Create Account</h1>
                        <p className="text-xs text-[#2D241E]/60 font-bold uppercase tracking-wider">Join as {role === 'provider' ? 'Partner' : 'Customer'}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* Name & Email */}
                        <div className="grid grid-cols-1 gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">person</span>
                                <input
                                    className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                                    placeholder="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                                {errors.name && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.name}</p>}
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">alternate_email</span>
                                <input
                                    className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                                    placeholder="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                                {errors.email && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.email}</p>}
                            </div>
                        </div>

                        {/* Phone & Password */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">call</span>
                                <input
                                    className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                                    placeholder="Phone"
                                    name="phone"
                                    maxLength={10}
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                                {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.phone}</p>}
                            </div>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">lock</span>
                                <input
                                    className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                                    placeholder="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                {/* Strength Bar */}
                                {formData.password && (
                                    <div className="absolute bottom-1 left-10 right-4 h-0.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div className={`h-full transition-all ${strength.color}`} style={{ width: strength.width }}></div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <input
                                className="w-full bg-white/50 border border-white/60 rounded-xl px-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white placeholder:text-gray-400/80 transition-all"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.confirmPassword}</p>}
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-200/50 my-2"></div>

                        {/* Location */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[10px] font-black text-[#2D241E]/50 uppercase tracking-widest">Delivery Address</label>
                                {errors.general && <span className="text-[10px] text-red-500 font-bold">{errors.general}</span>}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={handleAllowLocation}
                                    disabled={loadingLocation}
                                    className="h-10 flex items-center justify-center gap-1.5 bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-xl text-xs font-bold text-primary transition-all"
                                >
                                    {loadingLocation ? <span className="animate-spin material-symbols-outlined text-[16px]">sync</span> : <span className="material-symbols-outlined text-[16px]">my_location</span>}
                                    Auto-Detect
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setShowManualAddress(true)}
                                    className={`h-10 flex items-center justify-center gap-1.5 rounded-xl text-xs font-bold transition-all border ${showManualAddress ? 'bg-primary text-white border-primary' : 'bg-white/50 text-gray-600 border-gray-200 hover:bg-white'}`}
                                >
                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                    Manual Entry
                                </button>
                            </div>

                            {showManualAddress && (
                                <div className="space-y-3 pt-1 animate-[fadeIn_0.3s_ease-out]">
                                    <div className="relative">
                                        <span className="material-symbols-outlined absolute left-4 top-3 text-[#2D241E]/40 text-[18px]">home</span>
                                        <input
                                            className="w-full bg-white/50 border border-white/60 rounded-xl pl-10 pr-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                                            placeholder="House / Flat / Street"
                                            name="street"
                                            value={formData.address.street}
                                            onChange={handleAddressChange}
                                        />
                                        {errors.street && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.street}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <input
                                            className="w-full bg-white/50 border border-white/60 rounded-xl px-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                                            placeholder="City"
                                            name="city"
                                            value={formData.address.city}
                                            onChange={handleAddressChange}
                                        />
                                        <input
                                            className="w-full bg-white/50 border border-white/60 rounded-xl px-4 h-11 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white"
                                            placeholder="Pincode"
                                            name="pincode"
                                            value={formData.address.pincode}
                                            onChange={handleAddressChange}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {errors.city && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.city}</p>}
                                        {errors.pincode && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.pincode}</p>}
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#111716] hover:bg-black text-white font-bold h-12 rounded-xl shadow-lg shadow-black/10 transition-all hover:scale-[1.01] active:scale-[0.98] mt-2 text-sm flex items-center justify-center gap-2"
                        >
                            Create Account <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </form>

                    {/* Social Footer */}
                    <div className="mt-8 pt-6 border-t border-gray-200/50">
                        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-4">Or sign up with</p>
                        <div className="flex justify-center gap-4">
                            <button className="size-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuAsnS2Q9jote0zTwDBTaQW3-Hp5bXCKiqORGLI3HeWG8NeLc_Bk7tzlpIGqszu3aof4jHImylcUjk7M-auzE2VsRbeCdbzdrs36_aEbCWMRjFREwfHFwbokCBt5UjzdeGrZnVyLe4ghM54i7uerahR4tepsHNH-4SXUvqm0hveFxnfvDF4JzxUjFasRYHHtn10Wgqb3paugB76O__RPwerL9bgxXfZgn83KSyzxkrgGg_o1Wn1e4ZFaacjEtuRAm_J2uSIXCSMa" alt="G" className="w-5 h-5" />
                            </button>
                            <button className="size-10 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                                <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC_GuhkVOHy_E4cGw5zY6R-ALLVj0OOOOPafEdFrLH-7UakSdUPJ6kqbm0k9NWvEXX7muPBNXxY4awL6DcSwiZTfZDRe_uE1RwHl6n1C2iFHimWjexrmFMHvgi5pERv7nJGKJJVIt9BcacNvNT1GrgThYdWFVlR4mn6rgGXJTbicYN7PGTCOFJNH4BwJ0bWuQqBdjHw7s4NTMQv8-GZ8IThDvzsezlaAIn8T3-izlPHWw3qPeqcVDERXrlxWQKY5Y6L3C2B4w1" alt="A" className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                </div>
            </main>

            <footer className="py-6 text-center text-[#2D241E]/30 text-[10px] font-bold w-full relative z-10 uppercase tracking-widest">
                © 2024 Smart Tiffin System
            </footer>
        </div>
    );
};

export default Register;
