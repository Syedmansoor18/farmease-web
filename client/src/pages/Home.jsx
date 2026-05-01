import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, MapPin, PlusCircle, ShoppingBag, ArrowRight, Tractor, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext'; // adjust path as needed

const Home = () => {
  const [userName] = useState(() => {
    return localStorage.getItem('userName') || "Farmer";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  // FIXED: Added 'language' and 'changeLanguage' here
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

      <main className="flex-1 ml-20 h-screen overflow-y-auto p-6 md:p-10 space-y-10">

        {/* TOP HEADER: GREETING & SEARCH */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-[#1A4D2E] tracking-tight">
              {t("greeting")}, {userName}! {t("greetingEmoji")}
            </h1>
            <p className="text-gray-500 font-semibold mt-1 text-lg">
              {t("farmQuestion")}
            </p>
          </div>

          <div className="flex items-center gap-4">

            {/* 🌐 THE LANGUAGE DROPDOWN ADDED HERE */}
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-white text-[#1A4D2E] font-bold py-4 px-4 rounded-2xl border border-gray-200 shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#006F1D] transition-all hidden md:block"
            >
              <option value="en">English 🌐</option>
              <option value="hi">हिन्दी (Hindi) 🇮🇳</option>
              <option value="kn">ಕನ್ನಡ (Kannada) 🇮🇳</option>
              <option value="te">తెలుగు (Telugu) 🇮🇳</option>
              <option value="ta">தமிழ் (Tamil) 🇮🇳</option>
            </select>

            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#006F1D] transition-colors" size={20} />
              <input
                type="text"
                placeholder={t("searchEquipment")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className="w-64 md:w-80 bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 shadow-sm focus:ring-2 focus:ring-[#006F1D] outline-none transition-all"
              />
            </div>
            <div
              onClick={handleLocationClick}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm text-[#006F1D] cursor-pointer hover:bg-green-50 transition-all active:scale-90"
            >
              <MapPin size={24} />
            </div>
          </div>
        </header>

        {/* THE "BIG DECISION" CARDS */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* PATH A: RENT */}
          <div
            onClick={() => navigate('/marketplace')}
            className="relative overflow-hidden bg-[#1A4D2E] rounded-[40px] p-10 text-white group cursor-pointer hover:shadow-2xl hover:shadow-green-900/30 transition-all duration-500"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="bg-white/20 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">
                  <ShoppingBag size={30} />
                </div>
                <h2 className="text-4xl font-black mb-3">{t("wantToRent")}</h2>
                <p className="text-green-100/70 text-lg font-medium max-w-[280px]">{t("rentDesc")}</p>
              </div>
              <button className="mt-10 flex items-center gap-2 font-bold text-lg bg-white text-[#1A4D2E] px-8 py-4 rounded-full w-fit hover:gap-4 transition-all">
                {t("exploreMarketplace")} <ArrowRight size={20} />
              </button>
            </div>
            <Tractor size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>

          {/* PATH B: LIST */}
          <div
            onClick={() => navigate('/list-equipment')}
            className="relative overflow-hidden bg-white rounded-[40px] p-10 border-2 border-dashed border-gray-200 group cursor-pointer hover:border-[#006F1D] hover:bg-green-50/30 transition-all duration-500"
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <div className="bg-green-100 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-[#006F1D]">
                  <PlusCircle size={30} />
                </div>
                <h2 className="text-4xl font-black text-[#1A4D2E] mb-3">{t("listMyEquipment")}</h2>
                <p className="text-gray-500 text-lg font-medium max-w-[280px]">{t("listDesc")}</p>
              </div>
              <button className="mt-10 flex items-center gap-2 font-bold text-lg bg-[#006F1D] text-white px-8 py-4 rounded-full w-fit shadow-lg shadow-green-900/20">
                {t("startEarning")} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* FARMERS CHOICE SECTION */}
        <section className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-yellow-50 rounded-3xl flex items-center justify-center text-yellow-600">
              <Star size={40} fill="currentColor" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#2D3432]">{t("farmersChoice")}</h3>
              <p className="text-gray-500 font-medium">{t("farmersChoiceDesc")}</p>
            </div>
          </div>
          <div className="flex -space-x-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-14 h-14 rounded-full border-4 border-white bg-gray-200 overflow-hidden shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${i}`} alt="user" />
              </div>
            ))}
            <div className="w-14 h-14 rounded-full border-4 border-white bg-[#006F1D] flex items-center justify-center text-white font-bold text-xs shadow-sm">
              +99
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Home;