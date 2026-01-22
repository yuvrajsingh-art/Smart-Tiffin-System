import React, { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Register = () => {
    const [searchParams] = useSearchParams();
    const role = searchParams.get("role") || "customer";

    const [formData, setFormData] = useState({
        role: role,
        name: "",
        email: "",
        phone: "",
        password: "",
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
    const [location, setLocation] = useState({ lat: null, lng: null });
    const [loadingLocation, setLoadingLocation] = useState(false);

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

    // Form validation
    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.email.trim()) newErrors.email = "Email is required";
        if (!formData.phone.trim()) newErrors.phone = "Phone is required";
        if (!formData.password.trim()) newErrors.password = "Password is required";

        if (showManualAddress) {
            Object.entries(formData.address).forEach(([key, value]) => {
                if (!value.trim()) newErrors[key] = `${key} is required`;
            });
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submit
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        console.log("Registration Data:", formData);
        alert("Registration Successful!");
    };

    // Fetch location and auto-fill address
    const handleAllowLocation = async () => {
        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        setLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                setLocation({ lat: latitude, lng: longitude });

                try {
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                    );
                    const data = await res.json();

                    const osmAddress = data.address || {};

                    setFormData({
                        ...formData,
                        address: {
                            country: osmAddress.country || "",
                            state: osmAddress.state || "",
                            city: osmAddress.city || osmAddress.town || osmAddress.village || "",
                            street: osmAddress.road || "",
                            pincode: osmAddress.postcode || "",
                        },
                    });

                    setShowManualAddress(true);
                } catch (error) {
                    alert("Failed to fetch address");
                }

                setLoadingLocation(false);
            },
            () => {
                alert("Location permission denied");
                setLoadingLocation(false);
                setShowManualAddress(true);
            }
        );
    };

    const handleManualAddress = () => {
        setShowManualAddress(true);
    };

    return (
        <div className="font-display mesh-gradient text-[#111716] overflow-x-hidden min-h-screen relative flex flex-col selection:bg-primary/20 selection:text-primary">
            {/* Detailed Background from Login/Role theme */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="blob w-[800px] h-[800px] bg-orange-200/40 -top-40 -left-20"></div>
                <div className="blob w-[700px] h-[700px] bg-amber-100/40 top-1/4 right-0"></div>
                <div className="blob w-[900px] h-[900px] bg-orange-100/30 bottom-0 left-1/4"></div>
            </div>

            {/* Consistent Nav */}
            <nav className="fixed top-0 w-full z-50 glass-nav transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group cursor-pointer">
                        <div className="size-10 bg-gradient-to-br from-primary to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                            <span className="material-symbols-outlined text-[24px]">lunch_dining</span>
                        </div>
                        <span className="text-lg font-bold tracking-tight text-[#111716] group-hover:text-primary transition-colors font-display">Smart Tiffin</span>
                    </Link>
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
                                placeholder="+91 98765 43210"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                icon="call"
                                variant="glass"
                                className="!bg-transparent"
                            />

                            <Input
                                label="Password"
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                icon="lock"
                                variant="glass"
                                className="!bg-transparent"
                            />

                            <div className="pt-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Address Details</label>

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
                                        onClick={handleManualAddress}
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
                    </div>
                </div>
            </main>

            <footer className="relative z-10 w-full py-6 text-center">
                <p className="text-xs text-gray-500 font-medium">© 2024 Smart Tiffin. Designed with <span className="text-red-500">♥</span> for better food.</p>
            </footer>
        </div>
    );
};

export default Register;
