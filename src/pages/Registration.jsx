import React, { useState } from "react";
import { FaLocationCrosshairs } from "react-icons/fa6";
import { FaPencilAlt } from "react-icons/fa";

const Register = () => {
  const [formData, setFormData] = useState({
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

          setShowManualAddress(true); // Show the fields so user can edit if needed
        } catch (error) {
          alert("Failed to fetch address");
        }

        setLoadingLocation(false);
      },
      () => {
        alert("Location permission denied");
        setLoadingLocation(false);
        setShowManualAddress(true); // Allow manual entry if location fails
      }
    );
  };

  const handleManualAddress = () => {
    setShowManualAddress(true);
  };

  return (
    <div className="register-container bg-[#fffaf6] w-[25rem] m-auto items-center my-[6rem] p-[1.3rem] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[8px]">
      <h2 className="font-bold text-2xl flex justify-center items-center">
        Create Your Account
      </h2>
      <p className="text-xs text-center font-light text-gray-800/70 mb-[2rem]">
        Step into the future of mess management
      </p>

      <form onSubmit={handleSubmit} className="register-form space-y-2">

        <label className="text-sm font-medium">Full Name</label>
        <input
          className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0"
          type="text"
          name="name"
          placeholder="Enter your full name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}

        <label className="text-sm font-medium">Email Address</label>
        <input
          className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

        <label className="text-sm font-medium">Phone Number</label>
        <input
          className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" type="text"
          name="phone"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={handleChange}
        />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}

        <label className="text-sm font-medium">Password</label>
        <input
          className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" type="password"
          name="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
        />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

        <label className="text-sm font-medium mt-2 block">Address</label>

        <div className="addressBtn flex gap-2 justify-center">
          <button
            type="button"
            onClick={handleAllowLocation}
            className="flex items-center gap-2 bg-[#fff] px-4 py-2 rounded-[10px] text-sm hover:bg-[#e65f00] transition"
          >
            <FaLocationCrosshairs /> Allow Location
          </button>

          <button
            type="button"
            onClick={handleManualAddress}
            className="flex items-center gap-2 bg-[#fff] px-4 py-2 rounded-[10px] text-sm hover:bg-[#e65f00] transition"
          >
            <FaPencilAlt /> Enter Manually
          </button>
        </div>

        {showManualAddress && (
          <div className="space-y-2 mt-2">
            <input
              type="text"
              name="country"
              placeholder="Country"
              className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" value={formData.address.country}
              onChange={handleAddressChange}
            />
            {errors.country && <p className="text-red-500 text-xs">{errors.country}</p>}

            <input
              type="text"
              name="state"
              placeholder="State"
              className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" value={formData.address.state}
              onChange={handleAddressChange}
            />
            {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}

            <input
              type="text"
              name="city"
              placeholder="City"
              className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" value={formData.address.city}
              onChange={handleAddressChange}
            />
            {errors.city && <p className="text-red-500 text-xs">{errors.city}</p>}

            <input
              type="text"
              name="street"
              placeholder="Street / Area / Landmark"
              className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" value={formData.address.street}
              onChange={handleAddressChange}
            />
            {errors.street && <p className="text-red-500 text-xs">{errors.street}</p>}

            <input
              type="text"
              name="pincode"
              placeholder="Pincode"
              className="  border  p-[10px] w-full rounded-2xl    border-gray-300  bg-[#f8fafc] focus:border-gray-400 focus:ring-0" value={formData.address.pincode}
              onChange={handleAddressChange}
            />
            {errors.pincode && <p className="text-red-500 text-xs">{errors.pincode}</p>}
          </div>
        )}

        {location.lat && (
          <iframe
            width="100%"
            height="200"
            className="rounded-lg mt-2"
            src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
            loading="lazy"
          ></iframe>
        )}

        <button
          type="submit"
          className="bg-[#ff6b00] hover:bg-[#e65f00] p-[10px] cursor-pointer rounded-[5px] text-white border-none w-full mt-3"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
