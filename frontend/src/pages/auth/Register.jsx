import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Logo from "../../components/ui/Logo";

const Register = () => {
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
    const [passwordStrength, setPasswordStrength] = useState(0); // 0-4 scale

    // Updated strength calculation
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

    // General input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    // Manual address input change
    const handleAddressChange = (e) => {
        setFormData({
            ...formData,
            address: {
                ...formData.address,
                [e.target.name]: e.target.value,
            },
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    // Full Form validation
    const validateForm = () => {
        const newErrors = {};

        // Name
        if (!formData.name.trim()) newErrors.name = "Full Name is required";

        // Email (Strict Regex)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }

        // Phone (Strict 10 Digits)
        const phoneRegex = /^\d{10}$/;
        if (!formData.phone.trim()) {
            newErrors.phone = "Phone number is required";
        } else if (!phoneRegex.test(formData.phone)) {
            newErrors.phone = (
                <span>
                    Phone number must be <strong>exactly 10 digits</strong>
                </span>
            );
        }

        // Password & Confirm Password
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Address Validation
        if (!showManualAddress) {
            // If location wasn't auto-detected AND they haven't opened manual form, we might need to prompt them
            // Ideally handled by UI state, but here we enforce at least one address method
            // For simplicity, we assume if they hit Submit, we validate manual fields if they are visible, OR check if we have data
            // If address is empty and manual is hidden, force manual show or error
            const isAddressEmpty = !formData.address.city;
            if (isAddressEmpty) {
                newErrors.general = "Please provide your address location";
                setShowManualAddress(true); // Auto open to prompt user
            }
        }

        if (showManualAddress) {
            if (!formData.address.country.trim()) newErrors.country = "Country is required";
            if (!formData.address.state.trim()) newErrors.state = "State is required";
            if (!formData.address.city.trim()) newErrors.city = "City is required";
            if (!formData.address.street.trim()) newErrors.street = "Street address is required";
            if (!formData.address.pincode.trim()) newErrors.pincode = "Pincode is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        // Simulate API Call
        console.log("Registration Payload:", formData);
        alert(`Success! Welcome ${formData.name}`);
        // Navigate('/login') or similar
    };

    // Auto-detect Location Logic
    const handleAllowLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLoadingLocation(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                // setLocation({ lat: latitude, lng: longitude }); // Optional: store coords if needed

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();
                    const osm = data.address || {};

                    setFormData(prev => ({
                        ...prev,
                        address: {
                            country: osm.country || "India",
                            state: osm.state || osm.region || "",
                            city: osm.city || osm.town || osm.village || osm.suburb || "",
                            street: osm.road || osm.residential || "",
                            pincode: osm.postcode || "",
                        }
                    }));
                    setShowManualAddress(true); // Show filled form for review
                } catch (error) {
                    console.error("Geocoding error:", error);
                    alert("Could not fetch address details. Please enter manually.");
                    setShowManualAddress(true);
                }
                setLoadingLocation(false);
            },
            (error) => {
                console.error("Geolocation error:", error);
                alert("Location access denied. Please enter address manually.");
                setLoadingLocation(false);
                setShowManualAddress(true);
            }
        );
    };

    // Helper to get color/label for strength bar
    const getStrengthStyles = () => {
        switch (passwordStrength) {
            case 0: return { width: '0%', color: 'bg-gray-200', label: '' };
            case 1: return { width: '25%', color: 'bg-red-500', label: 'Weak' };
            case 2: return { width: '50%', color: 'bg-orange-500', label: 'Fair' };
            case 3: return { width: '75%', color: 'bg-yellow-500', label: 'Good' };
            case 4: return { width: '100%', color: 'bg-green-500', label: 'Strong' };
            default: return { width: '0%', color: 'bg-gray-200', label: '' };
        }
    };

    const strength = getStrengthStyles();

    return (
        <div className="font-display mesh-gradient text-[#111716] overflow-x-hidden min-h-screen relative flex flex-col selection:bg-primary/20 selection:text-primary">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[800px] h-[800px] bg-orange-200/40 -top-40 -left-20"></div>
                <div className="blob w-[700px] h-[700px] bg-amber-100/40 top-1/4 right-0"></div>
                <div className="blob w-[900px] h-[900px] bg-orange-100/30 bottom-0 left-1/4"></div>
            </div>

            {/* Nav */}
            <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                   <Logo />
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:block text-sm text-[#6A717B] font-medium">Already have an account?</span>
                        <Link to="/login" className="text-sm font-bold text-primary hover:text-orange-700 transition-colors">Login</Link>
                    </div>
                </div>
            </nav>

            <main className="relative z-10 flex-grow flex items-center justify-center px-4 py-32">
                <div className="w-full max-w-[500px] perspective-1000">
                    <div className="glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden transition-all duration-500 hover:shadow-glass-hover animate-[fadeIn_0.5s_ease-out]">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-[#111716] mb-2">
                                Create {role === 'provider' ? 'Provider' : 'Customer'} Account
                            </h2>
                            <p className="text-sm text-[#6A717B]">
                                Join Smart Tiffin today
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal Details */}
                            <Input
                                label="Full Name"
                                name="name"
                                placeholder="e.g. Rahul Sharma"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                icon="person"
                                variant="glass"
                                className="!bg-transparent"
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                icon="mail"
                                variant="glass"
                                className="!bg-transparent"
                            />

                            <Input
                                label="Phone Number"
                                name="phone"
                                placeholder="9876543210 (10 Digits)"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                icon="call"
                                variant="glass"
                                className="!bg-transparent"
                                maxLength={10}
                            />

                            {/* Password Section */}
                            <div className="space-y-1">
                                <Input
                                    label="Password"
                                    type="password"
                                    name="password"
                                    placeholder="Min 6 chars"
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={errors.password}
                                    icon="lock"
                                    variant="glass"
                                    className="!bg-transparent"
                                />
                                {/* Strength Indicator */}
                                {formData.password && (
                                    <div className="flex items-center gap-2 mt-1 px-1">
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${strength.color}`}
                                                style={{ width: strength.width }}
                                            />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase">{strength.label}</span>
                                    </div>
                                )}
                            </div>

                            <Input
                                label="Confirm Password"
                                type="password"
                                name="confirmPassword"
                                placeholder="Re-enter password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                icon="verified_user"
                                variant="glass"
                                className="!bg-transparent"
                            />

                            {/* Address Section */}
                            <div className="pt-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Address Details</label>
                                {errors.general && <p className="text-xs text-red-500 font-bold mb-2">{errors.general}</p>}

                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <button
                                        type="button"
                                        onClick={handleAllowLocation}
                                        disabled={loadingLocation}
                                        className="flex items-center justify-center gap-2 bg-orange-50 text-primary border border-orange-100 px-4 py-3 rounded-xl text-sm font-bold hover:bg-orange-100 transition-colors disabled:opacity-50"
                                    >
                                        {loadingLocation ? (
                                            <span className="animate-spin material-symbols-outlined text-[18px]">progress_activity</span>
                                        ) : (
                                            <span className="material-symbols-outlined text-[18px]">my_location</span>
                                        )}
                                        Auto-Detect
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setShowManualAddress(true)}
                                        className="flex items-center justify-center gap-2 bg-white/60 text-gray-700 border border-white/60 px-4 py-3 rounded-xl text-sm font-bold hover:bg-white transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                        Enter Manually
                                    </button>
                                </div>

                                {showManualAddress && (
                                    <div className="space-y-3 animate-[fadeIn_0.3s_ease-out]">
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                placeholder="Country"
                                                name="country"
                                                value={formData.address.country}
                                                onChange={handleAddressChange}
                                                error={errors.country}
                                                className="mb-0"
                                                variant="glass"
                                            />
                                            <Input
                                                placeholder="State"
                                                name="state"
                                                value={formData.address.state}
                                                onChange={handleAddressChange}
                                                error={errors.state}
                                                variant="glass"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Input
                                                placeholder="City"
                                                name="city"
                                                value={formData.address.city}
                                                onChange={handleAddressChange}
                                                error={errors.city}
                                                variant="glass"
                                            />
                                            <Input
                                                placeholder="Pincode"
                                                name="pincode"
                                                value={formData.address.pincode}
                                                onChange={handleAddressChange}
                                                error={errors.pincode}
                                                variant="glass"
                                            />
                                        </div>
                                        <Input
                                            placeholder="Street / Area / Landmark"
                                            name="street"
                                            value={formData.address.street}
                                            onChange={handleAddressChange}
                                            error={errors.street}
                                            icon="home_pin"
                                            variant="glass"
                                        />
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="mt-6 w-full bg-gradient-to-r from-primary to-orange-600 text-white text-base font-bold py-4 rounded-xl shadow-glow hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 border-none">
                                Create Account
                            </Button>

                            <p className="text-center text-sm text-gray-500 mt-6">
                                Already have an account?{" "}
                                <Link to="/login" className="text-primary font-bold hover:underline">
                                    Login here
                                </Link>
                            </p>
                        </form>

                        {/* Social Login Divider */}
                        <div className="relative py-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300/50"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-transparent text-gray-500 text-xs uppercase tracking-wide backdrop-blur-sm rounded">Or continue with</span>
                            </div>
                        </div>

                        {/* Social Buttons */}
                        <div className="grid grid-cols-2 gap-4">
                            <button type="button" className="flex items-center justify-center gap-2 bg-white/60 hover:bg-white/90 border border-white/60 hover:border-white shadow-sm hover:shadow-md py-3 rounded-xl transition-all duration-300 group">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                                </svg>
                                <span className="text-sm font-semibold text-[#111716] group-hover:text-black">Google</span>
                            </button>
                            <button type="button" className="flex items-center justify-center gap-2 bg-white/60 hover:bg-white/90 border border-white/60 hover:border-white shadow-sm hover:shadow-md py-3 rounded-xl transition-all duration-300 group">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.36-.16-.7-.28-1.02-.28-.31 0-.64.12-1.01.29-1.04.47-2.11.53-3.11-.42-1.63-1.57-2.82-4.39-1.18-7.07.82-1.34 2.18-2.15 3.59-2.15.29 0 .61.04.97.13.56.16 1.04.53 1.45.53.46 0 .98-.44 1.64-.62.33-.08.6-.12.82-.12 1.54 0 2.8.76 3.52 1.84-.06.04-.58.33-.58.33-1.4 1.06-1.17 3.39.26 4.39.04.03.09.06.13.08-.29.88-.63 1.74-1.13 2.25-.33.36-.66.69-1.02 1.05l-.25-.23zM12.03 7.25c-.14-2.22 1.69-4.14 3.86-4.25.13 2.37-1.95 4.34-3.86 4.25z"></path>
                                </svg>
                                <span className="text-sm font-semibold text-[#111716] group-hover:text-black">Apple</span>
                            </button>
                        </div>

                        <p className="mt-8 text-center text-[11px] text-gray-500 leading-tight">
                            By creating an account, you agree to our <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 w-full py-6 text-center">
                <p className="text-xs text-gray-500 font-medium">© 2024 Smart Tiffin. Designed with <span className="text-red-500">♥</span> for better food.</p>
            </footer>
        </div>
    );
};

export default Register;
