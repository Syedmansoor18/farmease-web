import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";

const StatsBar = ({ t, listingsCount, rating, savedCount, aadhaarVerified, kisanVerified }) => (
  <div className="flex items-center justify-around border-b border-gray-100 py-4 bg-white">

    {/* AADHAAR */}
    <div className="flex flex-col items-center gap-0.5">
      <svg viewBox="0 0 24 24" className={`w-6 h-6 ${aadhaarVerified ? 'fill-green-600' : 'fill-yellow-500'}`}>
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
      </svg>
      <span className="text-sm font-semibold text-gray-700">Aadhaar</span>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${aadhaarVerified ? 'text-green-600' : 'text-yellow-600'}`}>
        {aadhaarVerified ? t("verified") || "Verified" : t("pending") || "Pending"}
      </span>
    </div>

    {/* 🚨 FIXED: KISAN ID (Text is now dynamic!) */}
    <div className="flex flex-col items-center gap-0.5">
      <svg viewBox="0 0 24 24" className={`w-6 h-6 ${kisanVerified ? 'fill-green-600' : 'fill-yellow-500'}`}>
        <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V6h16v12zM6 10h2v2H6zm0 4h8v2H6zm4-4h8v2h-8z"/>
      </svg>
      <span className="text-sm font-semibold text-gray-700">Kisan ID</span>
      <span className={`text-[10px] font-bold uppercase tracking-wider ${kisanVerified ? 'text-green-600' : 'text-yellow-600'}`}>
        {kisanVerified ? t("verified") || "Verified" : t("pending") || "Pending"}
      </span>
    </div>

    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-800">{listingsCount}</span>
      <span className="text-sm text-gray-500">{t("listings") || "Listings"}</span>
    </div>
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-800 flex items-center gap-1">
        {rating}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#EAB308"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
      </span>
      <span className="text-sm text-gray-500">{t("rating") || "Rating"}</span>
    </div>
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-xl font-bold text-gray-800">{savedCount}</span>
      <span className="text-sm text-gray-500">{t("saved") || "Saved"}</span>
    </div>
  </div>
);

const ScrollSection = ({ title, children, onClick }) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
      <svg onClick={onClick} viewBox="0 0 24 24" className="w-7 h-7 fill-current text-gray-300 hover:text-green-600 transition-colors duration-200 cursor-pointer">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </div>
    <div className="flex gap-3 pb-1">
      {children}
    </div>
  </div>
);

const BookingCard = ({ item, onClick }) => (
  <div onClick={onClick} className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
    <div className="w-full aspect-video">
      <img src={item.imageUrl || item.img || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400"} alt={item.equipmentName || item.name} className="w-full h-full object-cover"/>
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

const SavedCard = ({ item, onRemove }) => {
  const isSelling = item.description?.toLowerCase().includes("listing intent: sell");
  const priceText = isSelling ? `₹${item.price || item.price_per_day}` : `₹${item.price_per_day || item.price} / day`;
  const image = item.image_url || item.image || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80";

  return (
    <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm relative">
      <div className="w-full aspect-video relative">
        <img src={image} alt={item.name} className="w-full h-full object-cover"/>
        <button onClick={e => { e.stopPropagation(); onRemove(item); }} className="absolute top-1 right-1 bg-white rounded-full p-1 shadow cursor-pointer border-none z-10 hover:bg-red-50">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-red-400">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      <div className="p-2">
        <p className="text-sm font-semibold text-gray-800 truncate capitalize">{item.name}</p>
        <p className="text-xs text-green-700 font-bold mt-1">{priceText}</p>
      </div>
    </div>
  );
};

const PostingCard = ({ item }) => (
  <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition">
    <div className="w-full aspect-video">
      <img src={item.img || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400"} alt={item.name} className="w-full h-full object-cover"/>
    </div>
    <div className="p-2">
      <p className="text-sm font-semibold text-gray-800 truncate capitalize">{item.name}</p>
      <p className="text-xs text-gray-400 font-medium truncate">{item.sub}</p>
    </div>
  </div>
);

const SettingsGroup = ({ title, items }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-4 pt-3 pb-1">{title}</p>
    {items.map((item, idx) => (
      <button key={item.id} onClick={item.onClick} className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors cursor-pointer ${idx < items.length - 1 ? "border-b border-gray-50" : ""}`}>
        {item.icon}
        <span className="text-xs text-gray-700">{item.label}</span>
        <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current text-gray-300 ml-auto">
          <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
        </svg>
      </button>
    ))}
  </div>
);

export default function Profile() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [profileData, setProfileData] = useState({
    name: "Loading...",
    kisanId: "Loading...",
    rating: "5.0",
    aadhaarVerified: false,
    kisanVerified: false,
  });

  const [myBookings, setMyBookings] = useState([]);
  const [savedEquipment, setSavedEquipment] = useState([]);
  const [myPostings, setMyPostings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        localStorage.removeItem("myPostings"); // Clean old ghosts

        const savedProfile = JSON.parse(localStorage.getItem("userProfile"));
        const { data: { user } } = await supabase.auth.getUser();

        if (savedProfile) {
          setProfileData({
            name: savedProfile.fullName || "Verified Farmer",
            kisanId: savedProfile.kisanId ? `ID: ${savedProfile.kisanId}` : "ID: PENDING",
            rating: "5.0",
            aadhaarVerified: savedProfile.aadhaarVerified,
            kisanVerified: savedProfile.kisanVerified,
          });
        } else if (user) {
          setProfileData({
            name: user.user_metadata?.full_name || "Verified Farmer",
            kisanId: "ID: " + user.id.substring(0, 8).toUpperCase(),
            rating: "5.0",
            aadhaarVerified: false,
            kisanVerified: false,
          });
        }

        if (user) {
          // Fetch Bookings
          const bookingsRes = await fetch(`http://localhost:5000/api/bookings?user_id=${user.id}`);
          if (bookingsRes.ok) {
            const bData = await bookingsRes.json();
            setMyBookings(bData.slice(0, 5));
          }

          // Fetch Postings
          const postingsRes = await fetch(`http://localhost:5000/api/my-postings?user_id=${user.id}`);
          if (postingsRes.ok) {
            const pData = await postingsRes.json();
            const formattedPostings = pData.map(eq => ({
              id: eq.id,
              name: eq.name,
              sub: `${eq.type || 'Equipment'} • ₹${eq.price_per_day || eq.price || 0}`,
              img: eq.image_url || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400"
            }));
            setMyPostings(formattedPostings.slice(0, 5));
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("savedEquipment") || "[]");
    setSavedEquipment(items.slice(0, 5));
  }, []);

  const handleRemoveSaved = (itemToRemove) => {
    const updatedItems = savedEquipment.filter(item => item.id ? item.id !== itemToRemove.id : item.name !== itemToRemove.name);
    setSavedEquipment(updatedItems);
    localStorage.setItem("savedEquipment", JSON.stringify(updatedItems));
  };

  const accountSettings = [
    { id: 1, label: t("changePassword"), onClick: () => navigate("/change-password"), icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>) },
    { id: 2, label: t("languageSettings"), onClick: () => navigate("/language"), icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95c-.32-1.25-.78-2.45-1.38-3.56 1.84.63 3.37 1.91 4.33 3.56zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-1.84-.63-3.37-1.9-4.33-3.56zm2.95-8H5.08c.96-1.66 2.49-2.93 4.33-3.56C8.81 5.55 8.35 6.75 8.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-.96 1.65-2.49 2.93-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"/></svg>) },
    { id: 3, label: t("notifications"), onClick: () => navigate("/notifications"), icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>) },
  ];

  const helpSupport = [
    { id: 1, label: t("helpCenter"), onClick: () => {}, icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>) },
    { id: 2, label: t("contactSupport"), onClick: () => {}, icon: (<svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-500"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>) },
  ];

  return (
    <div className="min-h-screen bg-gray-100 flex w-full" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar />
      <div className="flex-1 py-6 px-8 ml-0 md:ml-12 overflow-x-hidden">

        <div className="bg-white border-b border-gray-100 rounded-t-xl overflow-hidden">
          <div className="flex flex-col items-center pt-6 pb-3">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-green-400 mb-2">
              <img src={`https://ui-avatars.com/api/?name=${profileData.name}&background=d1fae5&color=065f46&bold=true`} alt={profileData.name} className="w-full h-full object-cover" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 capitalize">{profileData.name}</h2>
            <p className="text-[11px] text-gray-400 mb-2">{profileData.kisanId}</p>
            <button onClick={() => navigate("/edit-profile")} className="border border-green-600 text-green-700 text-xs px-6 py-1 rounded-full hover:bg-green-50 transition-colors cursor-pointer">
              {t("editProfile") || "Edit Profile"}
            </button>
          </div>

          <StatsBar
            t={t}
            listingsCount={myPostings.length}
            rating={profileData.rating}
            savedCount={savedEquipment.length}
            aadhaarVerified={profileData.aadhaarVerified}
            kisanVerified={profileData.kisanVerified}
          />
        </div>

        {/* CONTENT */}
        <div className="p-4 space-y-6">

          {/* MY BOOKINGS SECTION */}
          <ScrollSection title={t("myBookings")} onClick={() => navigate("/my-bookings")}>
            {myBookings.length > 0 ? (
              <>
                {myBookings.map(item => (
                  <BookingCard
                    key={item._id || item.id}
                    item={item}
                    onClick={() => {
                      const actualEquipmentData = item.fullEquipment && Object.keys(item.fullEquipment).length > 0
                        ? item.fullEquipment
                        : item;
                      navigate("/equipment-detail", {
                        state: { equipment: actualEquipmentData, from: "profile" }
                      });
                    }}
                  />
                ))}
                {/* INVISIBLE SPACERS */}
                {Array.from({ length: Math.max(0, 5 - myBookings.length) }).map((_, i) => (
                  <div key={`booking-spacer-${i}`} className="flex-1 min-w-0 pointer-events-none opacity-0" />
                ))}
              </>
            ) : (
              <p className="text-sm text-gray-400 py-4">No recent bookings found.</p>
            )}
          </ScrollSection>

          {/* SAVED EQUIPMENT SECTION */}
          <ScrollSection title={t("savedEquipment")} onClick={() => navigate("/saved-equipment")}>
            {savedEquipment.length > 0 ? (
              <>
                {savedEquipment.map((item, index) => (
                  <SavedCard key={item.id || index} item={item} onRemove={handleRemoveSaved} />
                ))}
                {Array.from({ length: Math.max(0, 5 - savedEquipment.length) }).map((_, i) => (
                  <div key={`saved-spacer-${i}`} className="flex-1 min-w-0 pointer-events-none opacity-0" />
                ))}
              </>
            ) : (
              <p className="text-sm text-gray-400 italic py-4">No saved equipment yet.</p>
            )}
          </ScrollSection>

          {/* MY POSTINGS SECTION */}
          <ScrollSection title={t("myPostings")} onClick={() => navigate("/my-postings")}>
            {myPostings.length > 0 ? (
              <>
                {myPostings.map(item => <PostingCard key={item.id} item={item} />)}
                {Array.from({ length: Math.max(0, 5 - myPostings.length) }).map((_, i) => (
                  <div key={`posting-spacer-${i}`} className="flex-1 min-w-0 pointer-events-none opacity-0" />
                ))}
              </>
            ) : (
              <p className="text-sm text-gray-400 italic py-4">You have not posted any equipment yet.</p>
            )}
          </ScrollSection>

          <SettingsGroup title={t("accountSettings")} items={accountSettings} />
          <SettingsGroup title={t("helpAndSupport")} items={helpSupport} />

          <button onClick={() => navigate("/")} className="w-full border border-green-600 text-green-700 font-medium rounded-xl py-3 text-sm hover:bg-green-600 hover:text-white transition-colors duration-200 cursor-pointer">
            {t("logout")}
          </button>
          <div className="h-4" />
        </div>
      </div>
    </div>
  );
}