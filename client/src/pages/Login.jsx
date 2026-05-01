import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { useLanguage } from "../context/LanguageContext"; // 1. Added Context Import

const Login = () => {
  const navigate = useNavigate();
  // 2. Pulled translation function, current language, and change function
  const { t, language, changeLanguage } = useLanguage();

  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // --- NEW SUPABASE NATIVE CONNECTION ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Supabase Native Login (Automatically sets the session for RLS!)
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.identifier,
        password: loginData.password,
      });

      if (authError) throw authError;

      // 2. Verification check against the profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authData.user.id)
        .single();

      // ... (inside handleLoginSubmit)
      if (profileError || !profile) {
        throw new Error("Profile check failed. Please ensure you have signed up correctly.");
      }

      console.log("Verified User:", profile.full_name);

      // 1. Save the name for your Home.jsx to find!
      localStorage.setItem('userName', profile.full_name);

      alert(`Welcome back, ${profile.full_name}! ✅`);

      // 2. CHANGE THE REDIRECT HERE
      navigate("/home");

    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };
  // ------------------------------------

  return (
    <div className="flex min-h-screen bg-white font-sans relative">

      {/* 3. THE LANGUAGE DROPDOWN */}
      <div className="absolute top-6 right-8 z-50">
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-[#E9F0EC] text-[#1A4D2E] font-bold py-2 px-4 rounded-xl shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#1A4D2E] border border-[#1A4D2E]/10"
        >
          <option value="en">English 🌐</option>
          <option value="hi">हिन्दी (Hindi) 🇮🇳</option>
          <option value="kn">ಕನ್ನಡ (Kannada) 🇮🇳</option>
          <option value="te">తెలుగు (Telugu) 🇮🇳</option>
          <option value="ta">தமிழ் (Tamil) 🇮🇳</option>
        </select>
      </div>

      {/* LEFT SIDE: Light Sage Background with Features Checklist */}
      <div className="hidden lg:flex w-1/2 bg-[#E9F0EC] flex-col justify-center p-20">
        <div className="max-w-md">
          <h1 className="text-[#1A4D2E] text-5xl font-bold mb-6">{t('welcomeBack')}</h1>
          <p className="text-[#59615F] text-xl mb-12 leading-relaxed">
            {t('loginSubtitle')}
          </p>

          <ul className="space-y-6">
            {[
              "Browse equipment by category",
              "Affordable rental with flexible duration",
              "Verified farmers & trusted service",
              "Easy booking and secure payments"
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-4 text-[#2D3432] font-semibold text-lg">
                <span className="text-[#1A4D2E] text-2xl font-bold">✓</span>
                <span>{t(item)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <header className="text-center mb-12">
            <h2 className="text-[#1A4D2E] text-4xl font-black mb-3">{t('loginBtn')} FarmEase</h2>
            <p className="text-[#59615F] font-medium">Enter your credentials to get started.</p>
          </header>

          <form className="space-y-8" onSubmit={handleLoginSubmit}>

            {/* Email Input */}
            <div>
              <label className="block text-sm font-bold text-[#2D3432] mb-3">{t('phoneOrEmail')}</label>
              <input
                type="email"
                name="identifier"
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="ramesh@gmail.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-[#2D3432] mb-3">{t('passwordField')}</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="********"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="accent-[#1A4D2E] w-4 h-4" />
                <span className="text-sm font-bold text-[#1A4D2E]">Remember Me</span>
              </label>
              <span className="text-sm font-bold text-[#1A4D2E] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1A4D2E] hover:bg-[#143B23] text-white font-black py-4 rounded-full shadow-lg shadow-[#1A4D2E]/20 transition-all active:scale-95 text-lg"
            >
              {t('loginBtn')}
            </button>

            {/* Switch to Signup */}
            <p className="text-center text-sm font-bold text-[#59615F] pt-4">
              {t('noAccount')} <span onClick={() => navigate('/signup')} className="text-[#1A4D2E] underline cursor-pointer hover:text-green-800">{t('signUpBtn')}</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;