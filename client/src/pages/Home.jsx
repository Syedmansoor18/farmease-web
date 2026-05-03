import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, MapPin, PlusCircle, ShoppingBag, ArrowRight, Tractor, Star } from 'lucide-react';
import { useLanguage } from '../Context/LanguageContext';

const Home = () => {
  const [userName] = useState(() => {
    return localStorage.getItem('userName') || "Farmer";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { t, language, changeLanguage } = useLanguage();

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim() !== "") {
      navigate(`/marketplace?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLocationClick = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            const locationName = data.address.city || data.address.town || data.address.village || "Unknown Location";
            alert(`${t("locationUpdated")}: ${locationName}`);
            localStorage.setItem('userLocation', locationName);
          } catch (err) {
            console.error("Geocoding error:", err);
            alert(t("locationGrantedError"));
          }
        },
        () => alert(t("locationDenied"))
      );
    } else {
      alert(t("locationNotSupported"));
    }
  };

  return (
    <div className="flex bg-[#F4F7F5] min-h-screen w-full font-sans overflow-hidden">
      <Sidebar />

      {/* Main container with bottom padding for mobile nav bar */}
      <main className="flex-1 md:ml-20 h-screen overflow-y-auto p-5 md:p-10 pb-24 md:pb-10 space-y-8 md:space-y-10">

        {/* TOP HEADER */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">

          {/* Greeting */}
          <div className="mt-2 md:mt-0">
            <h1 className="text-3xl md:text-4xl font-black text-[#1A4D2E] tracking-tight">
              {t("greeting")}, {userName}! {t("greetingEmoji")}
            </h1>
            <p className="text-gray-500 font-semibold mt-1 text-sm md:text-lg">
              {t("farmQuestion")}
            </p>
          </div>

          {/* Controls: Exactly like before. Language -> Search -> Location */}
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">

            {/* LANGUAGE DROPDOWN: Hidden on mobile, visible on desktop */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="hidden md:block bg-white text-[#1A4D2E] font-bold py-4 px-4 rounded-2xl border border-gray-200 shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#006F1D] transition-all"
            >
              <option value="en">English 🌐</option>
              <option value="hi">हिन्दी (Hindi) 🇮🇳</option>
              <option value="kn">ಕನ್ನಡ (Kannada) 🇮🇳</option>
              <option value="te">తెలుగు (Telugu) 🇮🇳</option>
              <option value="ta">தமிழ் (Tamil) 🇮🇳</option>
            </select>

            {/* SEARCH BAR: Flex-1 makes it shrink to fit mobile screens */}
            <div className="relative group flex-1 md:w-80">
              <Search className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006F1D] transition-colors w-4 h-4 md:w-5 md:h-5" />
              <input
                type="text"
                placeholder={t("searchEquipment")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-white border border-gray-200 rounded-xl md:rounded-2xl py-3 md:py-4 pl-10 md:pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#006F1D] outline-none transition-all text-sm md:text-base"
              />
            </div>

            {/* LOCATION BUTTON: Kept at the absolute end */}
            <div
              onClick={handleLocationClick}
              className="bg-white p-3 md:p-4 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm text-[#006F1D] cursor-pointer hover:bg-green-50 transition-all active:scale-90 shrink-0"
            >
              <MapPin className="w-5 h-5 md:w-6 md:h-6" />
            </div>

          </div>
        </header>

        {/* THE "BIG DECISION" CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">

          {/* PATH A: RENT */}
          <div
            onClick={() => navigate('/marketplace')}
            className="relative overflow-hidden bg-[#1A4D2E] rounded-3xl md:rounded-[40px] p-6 md:p-10 text-white group cursor-pointer hover:shadow-2xl hover:shadow-green-900/30 transition-all duration-500"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="bg-white/20 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6">
                  <ShoppingBag size={24} className="md:w-[30px] md:h-[30px]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-2 md:mb-3">{t("wantToRent")}</h2>
                <p className="text-green-100/70 text-sm md:text-lg font-medium max-w-[280px]">{t("rentDesc")}</p>
              </div>
              <button className="mt-8 md:mt-10 flex items-center justify-center md:justify-start gap-2 font-bold text-sm md:text-lg bg-white text-[#1A4D2E] px-6 py-3 md:px-8 md:py-4 rounded-full w-full md:w-fit hover:gap-4 transition-all">
                {t("exploreMarketplace")} <ArrowRight size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
            <div className="absolute -right-5 -bottom-5 md:-right-10 md:-bottom-10 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700 w-32 h-32 md:w-52 md:h-52">
                <Tractor className="w-full h-full" />
            </div>
          </div>

          {/* PATH B: LIST */}
          <div
            onClick={() => navigate('/list-equipment')}
            className="relative overflow-hidden bg-white rounded-3xl md:rounded-[40px] p-6 md:p-10 border-2 border-dashed border-gray-200 group cursor-pointer hover:border-[#006F1D] hover:bg-green-50/30 transition-all duration-500"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="bg-green-100 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#006F1D]">
                  <PlusCircle size={24} className="md:w-[30px] md:h-[30px]" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-[#1A4D2E] mb-2 md:mb-3">{t("listMyEquipment")}</h2>
                <p className="text-gray-500 text-sm md:text-lg font-medium max-w-[280px]">{t("listDesc")}</p>
              </div>
              <button className="mt-8 md:mt-10 flex items-center justify-center md:justify-start gap-2 font-bold text-sm md:text-lg bg-[#006F1D] text-white px-6 py-3 md:px-8 md:py-4 rounded-full w-full md:w-fit shadow-lg shadow-green-900/20">
                {t("startEarning")} <ArrowRight size={18} className="md:w-5 md:h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* FARMERS CHOICE SECTION */}
        <section className="bg-white rounded-3xl md:rounded-[40px] p-6 md:p-8 border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 md:gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
            <div className="h-16 w-16 md:h-20 md:w-20 bg-yellow-50 rounded-2xl md:rounded-3xl flex items-center justify-center text-yellow-600 shrink-0">
              <Star size={30} className="md:w-10 md:h-10" fill="currentColor" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black text-[#2D3432]">{t("farmersChoice")}</h3>
              <p className="text-gray-500 text-sm md:text-base font-medium mt-1 sm:mt-0">{t("farmersChoiceDesc")}</p>
            </div>
          </div>
          <div className="flex -space-x-3 md:-space-x-4 shrink-0 justify-center">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white bg-[#006F1D] flex items-center justify-center text-white font-bold text-[10px] md:text-xs shadow-sm">
              +99
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;