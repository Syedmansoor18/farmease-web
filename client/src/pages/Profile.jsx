import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient"

import T1 from "/T1.jpeg";
import Sdrill from "/Sdrill.jpg";
import Sdrill2 from "/Sdrill2.jpg";
import Sdrill3 from "/Sdrill3.jpg";
import Sdrill4 from "/Sdrill4.jpg";
import Sdrill5 from "/Sdrill5.jpg";
import Sdrill8 from "/Sdrill8.jpg";
import Tr2 from "/Tr2.jpg";
import Tr4 from "/Tr4.jpg";

// ─── DATA ────────────────────────────────────────────────────────────────────

const initialSavedEquipment = [
  { id: 1, name: "Combine Harvester", sub: "2 reviews", img: T1 },
  { id: 2, name: "Seed Drill", sub: "3 reviews", img: Sdrill },
  { id: 3, name: "Seed Drill", sub: "1 review", img: Sdrill2 },
  { id: 4, name: "Seed Drill", sub: "4 reviews", img: Sdrill3 },
  { id: 5, name: "Seed Drill", sub: "2 reviews", img: Sdrill4 },
];

const initialMyPostings = [
  { id: 1, name: "Seed Drill", sub: "4 reviews", img: Sdrill5 },
  { id: 2, name: "Combine Harvester", sub: "2 reviews", img: T1 },
  { id: 3, name: "Rotavator", sub: "1 review", img: Tr4 },
  { id: 4, name: "Rotavator", sub: "3 reviews", img: Tr2 },
  { id: 5, name: "Seed Drill", sub: "2 reviews", img: Sdrill8 },
];

// ─── STATS BAR ───────────────────────────────────────────────────────────────

const StatsBar = ({ t }) => (
  <div className="flex items-center justify-around border-b border-gray-100 py-4 bg-white">
    <div className="flex flex-col items-center gap-0.5">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-green-600">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
      <span className="text-sm font-semibold text-gray-700">Aadhaar</span>
      <span className="text-xs font-medium text-green-600">{t("verified")}</span>
    </div>

    <div className="flex flex-col items-center gap-0.5">
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-yellow-500">
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm4-4h8v2h-8z"/>
      </svg>
      <span className="text-sm font-semibold text-gray-700">Kisan ID</span>
      <span className="text-xs font-medium text-yellow-500">{t("pending")}</span>
    </div>

    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-800">12</span>
      <span className="text-sm text-gray-500">{t("listings")}</span>
    </div>

    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-800">5</span>
      <span className="text-sm text-gray-500">{t("rating")}</span>
    </div>

    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-800">8</span>
      <span className="text-sm text-gray-500">{t("saved")}</span>
    </div>
  </div>
);

// ─── HORIZONTAL SCROLL SECTION ───────────────────────────────────────────────

const ScrollSection = ({ title, children, onClick }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      <svg
        onClick={onClick}
        viewBox="0 0 24 24"
        className="w-7 h-7 fill-current text-gray-300 hover:text-green-600 transition-colors duration-200 cursor-pointer"
      >
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </div>
    <div className="flex gap-3 pb-1 overflow-x-auto">
      {children}
    </div>
  </div>
);

// ─── CARDS ───────────────────────────────────────────────────────────────────

const BookingCard = ({ item, onClick }) => (
  // 🚨 NEW: Added onClick here to make cards clickable
  <div onClick={onClick} className="flex-1 min-w-[160px] max-w-[220px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
    <div className="w-full h-28">
      <img src={item.imageUrl || item.img} alt={item.equipmentName || item.name} className="w-full h-full object-cover"/>
    </div>
    <div className="p-2">
      <div className="flex items-start justify-between gap-1">
        <p className="text-sm font-semibold text-gray-800 truncate capitalize">{item.equipmentName || item.name}</p>
        <span className={`flex-shrink-0 text-[10px] font-bold text-white px-2 py-0.5 rounded ${item.status === 'rented' ? 'bg-orange-600' : 'bg-green-500'}`}>
          {item.status ? item.status.toUpperCase() : "ACTIVE"}
        </span>
      </div>
      <p className="text-sm text-green-700 font-medium mt-0.5">₹{item.totalAmount || item.price}</p>
    </div>
  </div>
);

const SavedCard = ({ item, onRemove }) => (
  <div className="flex-1 min-w-[160px] max-w-[220px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
    <div className="w-full h-28 relative">
      <img src={item.img} alt={item.name} className="w-full h-full object-cover"/>
      <button
        onClick={e => { e.stopPropagation(); onRemove(item.id); }}
        className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow cursor-pointer border-none"
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-red-400">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </button>
    </div>
    <div className="p-2">
      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
      <p className="text-sm text-gray-400">{item.sub}</p>
    </div>
  </div>
);

const PostingCard = ({ item }) => (
  <div className="flex-1 min-w-[160px] max-w-[220px] bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
    <div className="w-full h-28">
      <img src={item.img} alt={item.name} className="w-full h-full object-cover"/>
    </div>
    <div className="p-2">
      <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
      <p className="text-sm text-gray-400">{item.sub}</p>
    </div>
  </div>
);

// ─── SETTINGS LIST ────────────────────────────────────────────────────────────

const SettingsGroup = ({ title, items }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">
      {title}
    </p>
    {items.map((item, idx) => (
      <button
        key={item.id}
        onClick={item.onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
          idx < items.length - 1 ? "border-b border-gray-50" : ""
        }`}
      >
        {item.icon}
        <span className="text-xs text-gray-700">{item.label}</span>
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-gray-300 ml-auto">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    ))}
  </div>
);

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // 🚨 NEW: Real states for dynamic fetching
  const [myBookings, setMyBookings] = useState([]);
  const [savedEquipment, setSavedEquipment] = useState(initialSavedEquipment);
  const [myPostings, setMyPostings] = useState(initialMyPostings);

  // 🚨 NEW: Fetch latest profile bookings from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const response = await fetch(`http://localhost:5000/api/bookings?user_id=${user.id}`);
        const data = await response.json();
        // Limit to latest 5 for the profile preview slider
        setMyBookings(data.slice(0, 5)); 
      } catch (error) {
        console.error("Error fetching profile bookings:", error);
      }
    };
    fetchProfileData();
  }, []);

  const handleRemoveSaved = (id) => {
    setSavedEquipment(prev => prev.filter(item => item.id !== id));
  };

  const accountSettings = [
    {
      id: 1,
      label: t("changePassword"),
      onClick: () => {},
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500">
          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
        </svg>
      ),
    },
    {
      id: 2,
      label: t("languageSettings"),
      onClick: () => navigate("/language"),
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500">
          <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/>
        </svg>
      ),
    },
    {
      id: 3,
      label: t("notifications"),
      onClick: () => {},
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500">
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
        </svg>
      ),
    },
  ];

  const helpSupport = [
    {
      id: 1,
      label: t("helpCenter"),
      onClick: () => {},
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/>
        </svg>
      ),
    },
    {
      id: 2,
      label: t("contactSupport"),
      onClick: () => {},
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex w-full" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar />
      <div className="flex-1 py-6 px-8 ml-0 md:ml-12 overflow-x-hidden">

        {/* HEADER */}
        <div className="bg-white border-b border-gray-100 rounded-t-xl overflow-hidden">
          <div className="flex flex-col items-center pt-6 pb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-400 mb-2">
              <img
                src="https://ui-avatars.com/api/?name=Ramesh&background=d1fae5&color=065f46&bold=true"
                alt="Ramesh"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-sm font-bold text-gray-900">Ramesh</h2>
            <p className="text-[11px] text-gray-400 mb-2">ID: 001-UXXXXX</p>
            <button className="border border-green-600 text-green-700 text-xs px-6 py-1 rounded-full hover:bg-green-50 transition-colors">
              {t("editProfile")}
            </button>
          </div>
          <StatsBar t={t} />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-6">

          <ScrollSection title={t("myBookings")} onClick={() => navigate("/my-bookings")}>
            {myBookings.length > 0 ? (
              myBookings.map(item => (
                <BookingCard 
                  key={item._id || item.id} 
                  item={item} 
                  onClick={() => {
                    // 🚨 1. Find the stapled equipment data
                    const actualEquipmentData = item.fullEquipment && Object.keys(item.fullEquipment).length > 0 
                      ? item.fullEquipment 
                      : item; // Fallback just in case

                    // 🚨 2. Pass it exactly how Marketplace does!
                    navigate("/equipment-detail", { 
                      state: { 
                        equipment: actualEquipmentData, 
                        from: "profile" 
                      } 
                    });
                  }}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400 py-4">No recent bookings found.</p>
            )}
          </ScrollSection>

          <ScrollSection title={t("savedEquipment")} onClick={() => navigate("/saved-equipment")}>
            {savedEquipment.map(item => (
              <SavedCard key={item.id} item={item} onRemove={handleRemoveSaved} />
            ))}
          </ScrollSection>

          <ScrollSection title={t("myPostings")} onClick={() => navigate("/my-postings")}>
            {myPostings.map(item => <PostingCard key={item.id} item={item} />)}
          </ScrollSection>

          <SettingsGroup title={t("accountSettings")} items={accountSettings} />
          <SettingsGroup title={t("helpAndSupport")} items={helpSupport} />

          <button
            onClick={() => navigate("/")}
            className="w-full border border-green-600 text-green-700 font-medium rounded-xl py-3 text-sm hover:bg-green-600 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            {t("logout")}
          </button>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}