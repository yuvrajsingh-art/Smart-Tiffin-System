import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})


// import React, { useState } from "react";
// import { FaLocationCrosshairs } from "react-icons/fa6";
// import { FaPencilAlt } from "react-icons/fa";

// const Register = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     password: "",
//     address: {
//       country: "",
//       state: "",
//       city: "",
//       street: "",
//       pincode: "",
//     },
//   });
// const [errors, setErrors] = useState({});
// const [showManualAddress, setShowManualAddress] = useState(false);
//   const [location, setLocation] = useState({
//     lat: null,
//     lng: null,
//   });
//   const [loadingLocation, setLoadingLocation] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//   e.preventDefault();

//   if (!validateForm()) return;

//   console.log("Registration Data:", formData);
//   alert("Registration Successful!");
// };
  
//   const handleAllowLocation = async () => {
//     if (!navigator.geolocation) {
//       alert("Geolocation not supported");
//       return;
//     }

//     setLoadingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const { latitude, longitude } = position.coords;

//         setLocation({ lat: latitude, lng: longitude });

//         try {
//           const res = await fetch(
//             `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
//           );

//           const data = await res.json();

//           setFormData({
//             ...formData,
//             address: data.display_name, // 👈 REAL ADDRESS
//           });

//           setShowManualAddress(true);
//         } catch (error) {
//           alert("Failed to fetch address");
//         }

//         setLoadingLocation(false);
//       },
//       () => {
//         alert("Location permission denied");
//         setLoadingLocation(false);
//       }
//     );
//   };

//   const handleManualAddress = () => {
//     setShowManualAddress(true);
//   };
// const handleAddressChange = (e) => {
//   setFormData({
//     ...formData,
//     address: {
//       ...formData.address,
//       [e.target.name]: e.target.value,
//     },
//   });
// };

// const validateForm = () => {
//   let newErrors = {};

//   // Name
//   if (!formData.name.trim()) {
//     newErrors.name = "Name is required";
//   } else if (!/^[A-Za-z ]{3,}$/.test(formData.name)) {
//     newErrors.name = "Name must be at least 3 letters";
//   }

//   // Email
//   if (!formData.email.trim()) {
//     newErrors.email = "Email is required";
//   } else if (
//     !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
//   ) {
//     newErrors.email = "Invalid email address";
//   }

//   // Phone
//   if (!formData.phone.trim()) {
//     newErrors.phone = "Phone number is required";
//   } else if (!/^[0-9]{10}$/.test(formData.phone)) {
//     newErrors.phone = "Phone must be 10 digits";
//   }

//   // Password
//   if (!formData.password.trim()) {
//     newErrors.password = "Password is required";
//   } else if (formData.password.length < 6) {
//     newErrors.password = "Password must be at least 6 characters";
//   }

//   // Manual Address Validation
//   if (showManualAddress) {
//     const { country, state, city, street, pincode } = formData.address;

//     if (!country) newErrors.country = "Country is required";
//     if (!state) newErrors.state = "State is required";
//     if (!city) newErrors.city = "City is required";
//     if (!street) newErrors.street = "Street is required";

//     if (!pincode) {
//       newErrors.pincode = "Pincode is required";
//     } else if (!/^[0-9]{5,6}$/.test(pincode)) {
//       newErrors.pincode = "Invalid pincode";
//     }
//   }

//   setErrors(newErrors);
//   return Object.keys(newErrors).length === 0;
// };

//   return (
//     <>
//       <div className="register-container bg-[#fffaf6] w-[25rem] m-auto items-center my-[6rem] p-[1.3rem] shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[8px]">
//         <h2 className="font-bold text-2xl flex justify-center items-center">
//           Create Your Account
//         </h2>
//         <p className="text-xs text-center font-light text-gray-800/70 mb-[2rem]">
//           Step into the future of mess management
//         </p>

//         <form onSubmit={handleSubmit} className="register-form space-y-2">

//           <label className="text-sm font-medium">Full Name</label>
//           <input
//             className="rounded-xl border border-[#ccc] p-[10px] w-full"
//             type="text"
//             name="name"
//             placeholder="Enter your full name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />{errors.name && (
//   <p className="text-red-500 text-xs">{errors.name}</p>
// )}

//           <label className="text-sm font-medium">Email Address</label>
//           <input
//             className="rounded-xl border border-[#ccc] p-[10px] w-full"
//             type="email"
//             name="email"
//             placeholder="Enter your email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
 
// {errors.email && (
//   <p className="text-red-500 text-xs">{errors.email}</p>
// )}

//           <label className="text-sm font-medium">Phone Number</label>
//           <input
//             className="rounded-xl border border-[#ccc] p-[10px] w-full"
//             type="text"
//             name="phone"
//             placeholder="Enter your phone number"
//             value={formData.phone}
//             onChange={handleChange}
//             required
//           />
 
// {errors.phone && (
//   <p className="text-red-500 text-xs">{errors.phone}</p>
// )}

//           <label className="text-sm font-medium">Password</label>
//           <input
//             className="rounded-xl border border-[#ccc] p-[10px] w-full"
//             type="password"
//             name="password"
//             placeholder="Create a password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
           
// {errors.password && (
//   <p className="text-red-500 text-xs">{errors.password}</p>
// )}

//           <label className="text-sm font-medium mt-2 block">Address</label>

//           <div className="addressBtn flex gap-2 justify-center">
//             <button type="button" onClick={handleAllowLocation} className="flex items-center gap-2 bg-[#ff6b00] text-white px-4 py-2 rounded-[10px] text-sm hover:bg-[#e65f00] transition"
//             >
//               <FaLocationCrosshairs /> Allow Location
//             </button>

//             <button type="button" onClick={handleManualAddress} className="flex items-center gap-2 bg-[#ff6b00] text-white px-4 py-2 rounded-[10px] text-sm hover:bg-[#e65f00] transition"
//             >
//               <FaPencilAlt /> Enter Manually
//             </button>
//           </div> 
//           {showManualAddress && (
//   <div className="space-y-2 mt-2">

//     <input
//       type="text"
//       name="country"
//       placeholder="Country"
//       className="rounded-xl border border-[#ccc] p-[10px] w-full"
//       value={formData.address.country}
//       onChange={handleAddressChange}
//       required
//     />

//     <input
//       type="text"
//       name="state"
//       placeholder="State"
//       className="rounded-xl border border-[#ccc] p-[10px] w-full"
//       value={formData.address.state}
//       onChange={handleAddressChange}
//       required
//     />

//     <input
//       type="text"
//       name="city"
//       placeholder="City"
//       className="rounded-xl border border-[#ccc] p-[10px] w-full"
//       value={formData.address.city}
//       onChange={handleAddressChange}
//       required
//     />

//     <input
//       type="text"
//       name="street"
//       placeholder="Street / Area / Landmark"
//       className="rounded-xl border border-[#ccc] p-[10px] w-full"
//       value={formData.address.street}
//       onChange={handleAddressChange}
//       required
//     />

//     <input
//       type="text"
//       name="pincode"
//       placeholder="Pincode"
//       className="rounded-xl border border-[#ccc] p-[10px] w-full"
//       value={formData.address.pincode}
//       onChange={handleAddressChange}
//       required
//     />

//   </div>
// )}

//           {location.lat && (
//             <iframe
//               width="100%"
//               height="200"
//               className="rounded-lg mt-2"
//               src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}
//               loading="lazy"
//             ></iframe>
//           )}
//           <button
//             type="submit"
//             className="bg-[#28a745] hover:bg-[#218838] p-[10px] cursor-pointer rounded-[5px] text-white border-none w-full mt-3"
//           >
//             Register
//           </button>
//         </form>
//       </div>
//     </>
//   );
// };

// export default Register;
