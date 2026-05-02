import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { useLanguage } from "../Context/LanguageContext";

const Login = () => {
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();

  const [loginData, setLoginData] = useState({
    identifier: '',
    password: ''
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: loginData.identifier,
        password: loginData.password,
      });

      if (authError) throw authError;

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error("Profile check failed. Please ensure you have signed up correctly.");
      }

      console.log("Verified User:", profile.full_name);

      localStorage.setItem('userName', profile.full_name);

      alert(`Welcome back, ${profile.full_name}! ✅`);

      navigate("/home");

    } catch (error) {
      console.error("Login Error:", error);
      alert(error.message);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans relative flex-col lg:flex-row">

      {/* THE LANGUAGE DROPDOWN - FIXED FOR MOBILE */}
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

      {/* LEFT SIDE: Light Sage Background with Features Checklist (Hidden on Mobile) */}
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-16 pt-24 md:pt-16">
        <div className="max-w-md w-full">
          <header className="text-center mb-8 md:mb-12">
            <h2 className="text-[#1A4D2E] text-3xl md:text-4xl font-black mb-2 md:mb-3">{t('loginBtn')} FarmEase</h2>
            <p className="text-[#59615F] font-medium text-sm md:text-base">Enter your credentials to get started.</p>
          </header>

          <form className="space-y-6 md:space-y-8" onSubmit={handleLoginSubmit}>

            {/* Email Input */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-2 md:mb-3">{t('phoneOrEmail')}</label>
              <input
                type="email"
                name="identifier"
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-4 py-3.5 md:px-5 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="ramesh@gmail.com"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-2 md:mb-3">{t('passwordField')}</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-4 py-3.5 md:px-5 md:py-4 text-sm md:text-base focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="********"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="accent-[#1A4D2E] w-3.5 h-3.5 md:w-4 md:h-4" />
                <span className="text-xs md:text-sm font-bold text-[#1A4D2E]">Remember Me</span>
              </label>
              <span className="text-xs md:text-sm font-bold text-[#1A4D2E] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1A4D2E] hover:bg-[#143B23] text-white font-black py-3.5 md:py-4 rounded-full shadow-lg shadow-[#1A4D2E]/20 transition-all active:scale-95 text-base md:text-lg mt-2"
            >
              {t('loginBtn')}
            </button>

            {/* Switch to Signup */}
            <p className="text-center text-xs md:text-sm font-bold text-[#59615F] pt-2 md:pt-4">
              {t('noAccount')} <span onClick={() => navigate('/signup')} className="text-[#1A4D2E] underline cursor-pointer hover:text-green-800 ml-1">{t('signUpBtn')}</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;