import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext"; // Ensure path is correct

export default function SavedEquipments() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Start completely empty. No dummy data allowed!
  const [saved, setSaved] = useState([]);

  // 1. Pull EXACTLY what you clicked from localStorage
  useEffect(() => {
    // We look for the exact "savedEquipment" key that your Detail Page uses
    const items = JSON.parse(localStorage.getItem("savedEquipment") || "[]");
    setSaved(items);
  }, []);

  // 2. Remove items dynamically
  const handleRemove = (e, itemToRemove) => {
    e.stopPropagation(); // Stop the card from clicking when you click the heart

    // Filter out the one you just un-hearted
    const updatedItems = saved.filter(item =>
      item.id ? item.id !== itemToRemove.id : item.name !== itemToRemove.name
    );

    // Instantly update the screen AND the browser memory
    setSaved(updatedItems);
    localStorage.setItem("savedEquipment", JSON.stringify(updatedItems));
  };

  // 3. Go to detail page if clicked
  const handleNavigateDetail = (e, item) => {
    e.stopPropagation();
    navigate("/equipment-detail", { state: { equipment: item, from: "saved" } });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-20 p-4 sm:p-6 overflow-y-auto">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1">
          <span
            className="cursor-pointer hover:text-green-700 transition-colors capitalize"
            onClick={() => navigate(-1)}
          >
            &gt; {t("profile") || "Profile"}
          </span>
          <span className="text-blue-700 capitalize">&gt; {t("savedEquipment") || "Saved Equipment"}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">{t("savedEquipment") || "Saved Equipment"}</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {t("manageSavedEquipment") || "Your dynamically saved items will appear here."}
          </p>
        </div>

        {/* Cards Container */}
        <div className="flex flex-col gap-3 w-full">

          {/* ONLY MAP THROUGH REAL, SAVED DATA */}
          {saved.map((item, index) => {
            const isSelling = item.description?.toLowerCase().includes("listing intent: sell");
            const priceText = isSelling ? `₹${item.price || item.price_per_day}` : `₹${item.price_per_day || item.price} / day`;
            const image = item.image_url || item.image || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80";

            return (
              <div
                key={item.id || index}
                onClick={e => handleNavigateDetail(e, item)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-shadow relative"
              >
                {/* Image */}
                <img
                  src={image}
                  alt={item.name}
                  className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0"
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80"; }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-gray-900 capitalize">{item.name}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      item.is_available !== false 
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-600"
                    }`}>
                      {item.is_available !== false ? "AVAILABLE" : "UNAVAILABLE"}
                    </span>
                  </div>

                  <p className="text-green-700 font-semibold text-sm mt-0.5">{priceText}</p>

                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400">
                      👁 {item.views || 0} {t("views") || "views"}
                    </span>
                  </div>

                  {/* Buttons */}
                  <div
                    className="flex items-center gap-2 mt-2 flex-wrap"
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      onClick={e => handleNavigateDetail(e, item)}
                      className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
                    >
                      {t("viewDetails") || "View Details"}
                    </button>
                    <button
                      onClick={e => handleRemove(e, item)}
                      className="text-xs font-semibold px-4 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white cursor-pointer transition-colors"
                    >
                      {t("remove") || "Remove"}
                    </button>
                  </div>
                </div>

                {/* Heart Button (Clicking it removes the item) */}
                <button
                  onClick={e => handleRemove(e, item)}
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow border border-gray-100 cursor-pointer hover:bg-red-50 transition-colors shrink-0"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            );
          })}

          {/* EMPTY STATE: This shows up if there is NOTHING saved in localStorage */}
          {saved.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <p className="text-base font-semibold text-gray-600">
                {t("noSavedEquipment") || "No Saved Equipment"}
              </p>
              <p className="text-sm mt-1">
                {t("noSavedEquipmentHint") || "Items you heart in the marketplace will appear here."}
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="mt-6 bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800 transition-colors cursor-pointer"
              >
                Go to Marketplace
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}