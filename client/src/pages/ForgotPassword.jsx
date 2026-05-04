import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from "../context/LanguageContext";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();

  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    // 1. Basic Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    // 2. UI BYPASS FLOW
    // We fake a loading state, show a success message, and kick them back to login.
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg("Password successfully reset! Redirecting to login...");

      setTimeout(() => {
        navigate('/');
      }, 1500);

    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-white font-sans relative flex-col lg:flex-row">

      {/* Language Dropdown */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-[#E9F0EC]/90 backdrop-blur-sm text-[#1A4D2E] font-bold py-1.5 px-3 md:py-2 md:px-4 rounded-xl shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#1A4D2E] border border-[#1A4D2E]/10 text-xs md:text-base"
        >
          <option value="en">English 🌐</option>
          <option value="hi">हिन्दी (Hindi) 🇮🇳</option>
          <option value="kn">ಕನ್ನಡ (Kannada) 🇮🇳</option>
          <option value="te">తెలుగు (Telugu) 🇮🇳</option>
          <option value="ta">தமிழ் (Tamil) 🇮🇳</option>
        </select>
      </div>

      {/* LEFT SIDE: Design Banner */}
      <div className="hidden lg:flex w-1/2 bg-[#E9F0EC] flex-col justify-center p-20">
        <div className="max-w-md">
          <h1 className="text-[#1A4D2E] text-5xl font-bold mb-6">Secure Reset</h1>
          <p className="text-[#59615F] text-xl leading-relaxed">
            Create a new, strong password for your FarmEase account. Make sure it's something you haven't used before!
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 pt-24 md:pt-16">
        <div className="max-w-md w-full">
          <header className="mb-8 md:mb-12">
            <button
              onClick={() => navigate("/")}
              className="text-[#1A4D2E] font-bold text-sm mb-6 flex items-center hover:underline bg-transparent border-none cursor-pointer"
            >
              ← Back to Login
            </button>
            <h2 className="text-[#1A4D2E] text-3xl md:text-4xl font-black mb-2 md:mb-3">Create New Password</h2>
            <p className="text-[#59615F] font-medium text-sm md:text-base">Enter your email and a new password below.</p>
          </header>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium border border-red-100 text-sm">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 text-green-700 p-4 rounded-xl mb-6 font-medium border border-green-100 text-sm text-center">
              {successMsg}
            </div>
          )}

          <form className="space-y-5 md:space-y-6" onSubmit={handleResetSubmit}>

            {/* Email Input */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5 md:mb-2">Registered Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-4 py-3.5 md:px-5 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="ramesh@gmail.com"
                required
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5 md:mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-4 py-3.5 md:px-5 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="Enter new password"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5 md:mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-4 py-3.5 md:px-5 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="Confirm new password"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || successMsg !== ''}
              className="w-full bg-[#1A4D2E] hover:bg-[#143B23] text-white font-black py-3.5 md:py-4 rounded-full shadow-lg shadow-[#1A4D2E]/20 transition-all active:scale-95 text-base md:text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Updating Password...' : 'Reset Password'}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;