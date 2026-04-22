import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase"; // Your Firebase Config
import { supabase } from "../supabaseClient"; // Import the Supabase client we created

const Signup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
    aadhaar: '', kisanId: '', state: '', district: '', village: '', pinCode: ''
  });

  const southStates = ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana", "Goa", "Gujarat", "Maharashtra", "Odisha", "Puducherry"];
  const karnatakaDistricts = ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Urban", "Bengaluru Rural", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Dakshina Kannada"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "aadhaar") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 12) setFormData({ ...formData, [name]: val });
      return;
    }
    if (name === "kisanId") {
      if (value.length <= 10) setFormData({ ...formData, [name]: value.toUpperCase() });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => alert("Location Access Granted!"),
        () => alert("Location Denied.")
      );
    }
  };

  // --- REFINED BACKEND CONNECTION LOGIC ---
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // 1. Create user in Firebase Auth
      const userCred = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCred.user;

      // 2. Sync profile data to Supabase
      // We use the user.uid from Firebase as the 'id' to link the two systems
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: user.uid, // This must be the Firebase UID 
            full_name: formData.fullName, // Matches File-01 [cite: 7]
            email: formData.email, // Matches File-01 [cite: 8]
            phone: formData.phone, // Matches File-01 [cite: 9]
            aadhaar_number: formData.aadhaar, // Matches File-01 [cite: 10]
            kisan_id: formData.kisanId, // Matches File-01 [cite: 11]
            state: formData.state, // Matches File-01 [cite: 12]
            district: formData.district, // Matches File-01 [cite: 13]
            is_verified: false // Matches File-01 [cite: 14]
          }
        ]);

      if (error) {
        // If Supabase fails, we might want to alert the user
        throw new Error(`Supabase Sync Error: ${error.message}`);
      }

      console.log("Profile created in Supabase successfully");
      alert("Account created and synced successfully ✅");
      navigate("/login");

    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* LEFT SIDE: Image + Text Overlay */}
      <div className="hidden lg:flex w-1/2 bg-[#006F1D] relative overflow-hidden">
        <img
          src="/signup-bg.png"
          alt="FarmEase Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop" }}
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 w-full h-full flex items-center justify-center p-20 text-center text-white">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight drop-shadow-xl">Empowering Digital <br/> Agriculture</h1>
            <p className="text-xl font-medium max-w-sm mx-auto opacity-90">Join thousands of farmers using smart technology to optimize yields.</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#2D3432] mb-2">Create Your FarmEase Account</h2>
            <p className="text-[#59615F]">Provide your details to get started with smart farming solutions.</p>
          </header>

          <form className="space-y-8" onSubmit={handleSignupSubmit}>
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#006F1D] font-bold">
                <span>👤</span><h3 className="text-[#2D3432]">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Full Name</label>
                  <input name="fullName" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="e.g. Ramesh Kumar" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Phone Number</label>
                  <input name="phone" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="+91 00000 00000" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Email Address</label>
                  <input name="email" type="email" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="ramesh@gmail.com" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Password</label>
                  <input type="password" name="password" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="********" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Confirm Password</label>
                  <input type="password" name="confirmPassword" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="********" required />
                </div>
              </div>
            </div>

            {/* Section 2: Identity Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#006F1D] font-bold">
                <span>🆔</span><h3 className="text-[#2D3432]">Identity Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Aadhaar (12 Digits)</label>
                  <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="0000 0000 0000" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Kisan ID</label>
                  <input name="kisanId" value={formData.kisanId} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="KID-123456" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Upload Aadhaar Card</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg,.png,.pdf" />
                  <div onClick={handleFileClick} className="border-2 border-dashed border-[#DDE4E1] rounded-2xl p-6 text-center bg-[#F1F4F2]/50 hover:bg-[#F1F4F2] cursor-pointer transition-all">
                    {fileName ? <p className="text-[#006F1D] font-bold">✅ {fileName}</p> : <><p className="text-sm text-[#59615F]">Drop files here or <span className="text-[#006F1D] font-bold underline">browse</span></p><p className="text-xs text-gray-400">JPG, PNG or PDF (Max 5MB)</p></>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Location Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#006F1D] font-bold"><span>📍</span><h3 className="text-[#2D3432]">Location Information</h3></div>
                <button type="button" onClick={handleLocation} className="text-[10px] font-bold text-[#006F1D] bg-[#006F1D]/10 px-3 py-1.5 rounded-full uppercase">Use Current Location</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select name="state" value={formData.state} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" required>
                  <option value="">Select State</option>
                  {southStates.map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <select name="district" value={formData.district} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" required>
                  <option value="">Select District</option>
                  {formData.state === "Karnataka" && karnatakaDistricts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
                <input name="village" onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" placeholder="Village / City" required />
                <input name="pinCode" onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" placeholder="PinCode" required />
              </div>
            </div>

            <div className="pt-4 space-y-4 text-center lg:text-left">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input type="checkbox" className="mt-1 accent-[#006F1D]" required />
                <span className="text-[11px] text-[#59615F]">I agree to the <span className="text-[#006F1D] font-bold underline">Terms & Conditions</span> and <span className="text-[#006F1D] font-bold underline">Privacy Policy</span> of FarmEase.</span>
              </label>

              <button type="submit" className="w-full bg-[#006F1D] hover:bg-green-800 text-white font-black py-4 rounded-full shadow-lg transition-all active:scale-95">
                Create Account
              </button>

              <p className="text-sm font-bold text-[#59615F]">
                Already have an account? <span onClick={() => navigate('/login')} className="text-[#006F1D] underline cursor-pointer font-bold">Login</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;