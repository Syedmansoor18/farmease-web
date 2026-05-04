import { INDIA_DATA, STATE_NAMES } from '../data/indianStates';
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";
import { useLanguage } from "../Context/LanguageContext";

const Signup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const { t, language, changeLanguage } = useLanguage();

  const [step, setStep] = useState(1);
  const [isNotFarmer, setIsNotFarmer] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
    aadhaar: '', kisanId: '', state: '', district: '', village: '', pinCode: '',
    landSize: '', farmerType: 'small', crops: ''
  });

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
    if (name === "state") {
      setFormData({ ...formData, state: value, district: "" });
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

  const handleNext = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    setStep(2);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            aadhaar_number: formData.aadhaar,
            kisan_id: formData.kisanId,
            state: formData.state,
            district: formData.district,
            is_verified: false
          }
        ]);

      if (profileError) throw new Error(`Profile Creation Error: ${profileError.message}`);

      const cropArray = isNotFarmer
        ? []
        : formData.crops.split(',').map(crop => crop.trim()).filter(crop => crop !== "");

      const { error: farmerError } = await supabase
        .from('farmers')
        .insert([{
          profile_id: authData.user.id,
          land_size: isNotFarmer ? 0 : (parseFloat(formData.landSize) || 0),
          farmer_type: isNotFarmer ? 'marginal' : formData.farmerType,
          primary_crops: cropArray
        }]);

      if (farmerError) throw new Error(`Farmer Creation Error: ${farmerError.message}`);

      console.log("Holy Trinity Complete: User, Profile, and Farmer created.");
      alert("Account created and synced successfully ✅");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans relative flex-col lg:flex-row">

      {/* 🌐 THE LANGUAGE DROPDOWN - FIXED FOR MOBILE */}
      <div className="absolute top-4 right-4 md:top-6 md:right-8 z-50">
        <select
          value={language}
          onChange={(e) => changeLanguage(e.target.value)}
          className="bg-white/90 backdrop-blur-sm text-[#006F1D] font-bold py-1.5 px-3 md:py-2 md:px-4 rounded-xl shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#006F1D] border border-[#006F1D]/20 text-xs md:text-base"
        >
          <option value="en">English 🌐</option>
          <option value="hi">हिन्दी 🇮🇳</option>
          <option value="kn">ಕನ್ನಡ 🇮🇳</option>
          <option value="te">తెలుగు 🇮🇳</option>
          <option value="ta">தமிழ் 🇮🇳</option>
        </select>
      </div>

      {/* LEFT SIDE - HIDDEN ON MOBILE (Hidden completely using lg:flex) */}
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
            <h1 className="text-5xl md:text-6xl font-black leading-tight drop-shadow-xl">{t('introducing')}</h1>
            <p className="text-xl font-medium max-w-sm mx-auto opacity-90">{t('heroDesc')}</p>
          </div>
        </div>
      </div>

      {/* MOBILE HERO HEADER (Visible only on mobile) */}
      <div className="lg:hidden w-full bg-[#006F1D] relative h-48 md:h-64 flex items-center justify-center overflow-hidden">
         <img
          src="/signup-bg.png"
          alt="FarmEase Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop" }}
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="relative z-20 px-6 text-center text-white mt-8">
           <h1 className="text-3xl font-black leading-tight drop-shadow-xl mb-2">{t('introducing')}</h1>
        </div>
      </div>

      {/* RIGHT SIDE / FORM AREA */}
      <div className="w-full lg:w-1/2 p-6 md:p-12 lg:p-16 overflow-y-auto bg-white rounded-t-3xl lg:rounded-none -mt-6 lg:mt-0 relative z-30 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] lg:shadow-none">
        <div className="max-w-xl mx-auto">
          <header className="mb-8 md:mb-10 text-center lg:text-left mt-2 lg:mt-0">
            <h2 className="text-2xl md:text-3xl font-black text-[#2D3432] mb-2">
              {step === 1 ? t('createAccount') : t('completeProfile') || "Complete Your Profile"}
            </h2>
            <p className="text-sm md:text-base text-[#59615F]">
              {step === 1
                ? t('provideDetails')
                : t('finalDetails') || "Just a few final details about your location and farm."}
            </p>
          </header>

          <form className="space-y-6 md:space-y-8" onSubmit={step === 1 ? handleNext : handleSignupSubmit}>

            {/* ══════════════ STEP 1: Basic & Identity ══════════════ */}
            {step === 1 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#006F1D] font-bold">
                    <span>👤</span><h3 className="text-[#2D3432] text-sm md:text-base">{t('Basic Info')}</h3>
                  </div>

                  {/* Changed to flex-col on mobile, grid on md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Full Name')}</label>
                      <input name="fullname" value={formData.fullName} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="e.g. Ramesh Kumar" required />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Phone Number')}</label>
                      <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="+91 00000 00000" required />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Email Address')}</label>
                      <input name="email" type="email" value={formData.email} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="ramesh@gmail.com" required />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Password Field')}</label>
                      <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="********" required />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Confirm Password')}</label>
                      <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="********" required />
                    </div>
                  </div>
                </div>

                {/* Section 2: Identity Details */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 text-[#006F1D] font-bold">
                    <span>🆔</span><h3 className="text-[#2D3432] text-sm md:text-base">{t('Identity Details')}</h3>
                  </div>

                  {/* Changed to flex-col on mobile, grid on md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Aadhaar / Pan')}</label>
                      <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="[Aadhaar Redacted]" required />
                    </div>
                    <div>
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('KisanId')}</label>
                      <input name="kisanId" value={formData.kisanId} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="KID-123456" />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Upload Aadhaar')}</label>
                      <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg,.png,.pdf" />
                      <div onClick={handleFileClick} className="border-2 border-dashed border-[#DDE4E1] rounded-2xl p-5 md:p-6 text-center bg-[#F1F4F2]/50 hover:bg-[#F1F4F2] cursor-pointer transition-all">
                        {fileName ? <p className="text-[#006F1D] font-bold text-sm md:text-base truncate px-2">✅ {fileName}</p> : <><p className="text-xs md:text-sm text-[#59615F]">Drop files here or <span className="text-[#006F1D] font-bold underline">browse</span></p><p className="text-[10px] md:text-xs text-gray-400 mt-1">JPG, PNG or PDF (Max 5MB)</p></>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 md:pt-4 text-center lg:text-left">
                  <button type="submit" className="w-full bg-[#006F1D] hover:bg-green-800 text-white font-black py-3.5 md:py-4 rounded-full shadow-lg transition-all active:scale-95 text-sm md:text-base">
                    {t('Next Step') || "Next Step →"}
                  </button>
                  <p className="text-xs md:text-sm font-bold text-[#59615F] mt-5 md:mt-4">
                    {t('Already Have Account')} <span onClick={() => navigate('/login')} className="text-[#006F1D] underline cursor-pointer font-bold ml-1">{t('loginBtn')}</span>
                  </p>
                </div>
              </div>
            )}

            {/* ══════════════ STEP 2: Location & Farm ══════════════ */}
            {step === 2 && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                {/* Section 3: Location Information */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2 text-[#006F1D] font-bold"><span>📍</span><h3 className="text-[#2D3432] text-sm md:text-base">{t('Location Info')}</h3></div>
                    <button type="button" onClick={handleLocation} className="text-[10px] md:text-[11px] font-bold text-[#006F1D] bg-[#006F1D]/10 px-3 py-1.5 md:py-2 rounded-full uppercase transition-colors hover:bg-[#006F1D]/20 self-start sm:self-auto">{t('useCurrentLoc')}</button>
                  </div>

                  {/* Changed to flex-col on mobile, grid on md+ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select name="state" value={formData.state} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" required>
                      <option value="">{t('selectState')}</option>
                      {STATE_NAMES.map(state => <option key={state} value={state}>{state}</option>)}
                    </select>
                    <select name="district" value={formData.district} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" required disabled={!formData.state}>
                    <option value="">{t('Select District')}</option>
                    {formData.state && INDIA_DATA[formData.state].map(dist => (
                      <option key={dist} value={dist}>{dist}</option>
                      ))}
                    </select>
                    <input name="village" value={formData.village} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder={t('Village Name')} required />
                    <input name="pinCode" value={formData.pinCode} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder={t('Pincode')} required />
                  </div>
                </div>

                {/* Section 4: Farm Profile */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                    <div className="flex items-center space-x-2 text-[#006F1D] font-bold">
                      <span>🌾</span><h3 className="text-[#2D3432] text-sm md:text-base">{t('Farm Profile') || "Farm Profile"}</h3>
                    </div>
                    <label className="flex items-center space-x-2 text-[11px] md:text-xs font-bold text-[#59615F] cursor-pointer hover:text-[#006F1D] self-start sm:self-auto">
                      <input
                        type="checkbox"
                        checked={isNotFarmer}
                        onChange={(e) => setIsNotFarmer(e.target.checked)}
                        className="rounded border-gray-300 text-[#006F1D] focus:ring-[#006F1D] accent-[#006F1D] w-4 md:w-4.5 h-4 md:h-4.5"
                      />
                      <span>{t('Not A Farmer') || "I am not a farmer"}</span>
                    </label>
                  </div>

                  {!isNotFarmer && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-300">
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('landSize') || "Land Size (Acres)"}</label>
                        <input name="landSize" type="number" step="0.1" value={formData.landSize} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="e.g. 5.5" required={!isNotFarmer} />
                      </div>
                      <div>
                        <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Farmer Type') || "Farmer Type"}</label>
                        <select name="farmerType" value={formData.farmerType} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" required={!isNotFarmer}>
                          <option value="marginal">Marginal (&lt; 2.5)</option>
                          <option value="small">Small (2.5 - 5)</option>
                          <option value="semi_medium">Semi-Medium (5 - 10)</option>
                          <option value="medium">Medium (10 - 25)</option>
                          <option value="large">Large (&gt; 25)</option>
                        </select>
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs md:text-sm font-bold text-[#2D3432] mb-1.5">{t('Primary Crops') || "Primary Crops"}</label>
                        <input name="crops" type="text" value={formData.crops} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 md:py-3.5 text-sm md:text-base focus:ring-2 focus:ring-[#006F1D]" placeholder="e.g. Wheat, Paddy, Sugarcane" />
                        <p className="text-[10px] md:text-xs text-gray-400 mt-1.5">Separate multiple crops with commas</p>
                      </div>
                    </div>
                  )}

                  {isNotFarmer && (
                    <div className="bg-[#006F1D]/10 text-[#006F1D] p-3 md:p-4 rounded-xl border border-[#006F1D]/20 text-xs md:text-sm">
                      <p className="font-bold">Welcome to the Marketplace!</p>
                      <p className="text-[10px] md:text-xs mt-1 text-[#006F1D]/80">You're all set to browse, rent, or sell equipment without needing a farm profile.</p>
                    </div>
                  )}
                </div>

                {/* Submission & Terms */}
                <div className="pt-2 md:pt-4 space-y-4 md:space-y-6 text-center lg:text-left">
                  <label className="flex items-start space-x-2 md:space-x-3 cursor-pointer text-left">
                    <input type="checkbox" className="mt-1 md:mt-0.5 accent-[#006F1D] flex-shrink-0" required />
                    <span className="text-[10px] md:text-[11px] leading-tight text-[#59615F]">{t('agreeTo')} <span className="text-[#006F1D] font-bold underline">{t('termsOfService')}</span> {t('and')} <span className="text-[#006F1D] font-bold underline">{t('privacyPolicy')}</span> {t('andPrivacy')}</span>
                  </label>

                  <div className="flex flex-row gap-3 md:gap-4">
                    <button type="button" onClick={() => setStep(1)} className="w-1/3 bg-[#F1F4F2] hover:bg-[#DDE4E1] text-[#2D3432] font-black py-3.5 md:py-4 rounded-full shadow-sm transition-all active:scale-95 text-sm md:text-base">
                      {t('Back Btn') || "Back"}
                    </button>
                    <button type="submit" disabled={isLoading} className={`w-2/3 ${isLoading ? 'bg-green-400' : 'bg-[#006F1D] hover:bg-green-800'} text-white font-black py-3.5 md:py-4 rounded-full shadow-lg transition-all active:scale-95 text-sm md:text-base`}>
                      {isLoading ? "Creating..." : t('Create Account')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;