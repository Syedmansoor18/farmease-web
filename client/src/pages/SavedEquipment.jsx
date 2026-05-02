import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext"; // adjust path as needed

const initialSaved = [
  {
    id: 1,
    nameKey: "equipJohnDeere",
    price: "₹ 800 / hour",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn10May",
    views: 232,
    requests: 7,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
  },
  {
    id: 2,
    nameKey: "equipWaterPump",
    price: "₹ 300 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn08May",
    views: 184,
    requests: 4,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
  },
  {
    id: 3,
    nameKey: "equipCombineHarvester",
    price: "₹ 4,500 / day",
    statusKey: "statusInactive",
    postedOnKey: "postedOn04May",
    views: 320,
    requests: 12,
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80",
  },
  {
    id: 4,
    nameKey: "equipRotavator",
    price: "₹ 700 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn28Apr",
    views: 156,
    requests: 6,
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
  },
  {
    id: 5,
    nameKey: "equipRotavator",
    price: "₹ 700 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn21Apr",
    views: 156,
    requests: 3,
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
  },
  {
    id: 6,
    nameKey: "equipRotavator",
    price: "₹ 700 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn17Apr",
    views: 355,
    requests: 8,
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
  },
];

export default function SavedEquipments() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [saved, setSaved] = useState(initialSaved);

  const handleRemove = (e, id) => {
    e.stopPropagation();
    setSaved(prev => prev.filter(item => item.id !== id));
  };

  const handleNavigateDetail = (e, item) => {
    e.stopPropagation();
    navigate("/equipment-detail", { state: { equipment: item } });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 p-4 sm:p-6 overflow-y-auto">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1">
          <span
            className="cursor-pointer hover:text-green-700 transition-colors"
            onClick={() => navigate(-1)}
          >
            &gt; {t("profile")}
          </span>
          <span className="text-blue-700">&gt; {t("savedEquipment")}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">{t("savedEquipment")}</h1>
          <p className="text-sm text-gray-400 mt-0.5">{t("manageSavedEquipment")}</p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-3 w-full">
          {saved.map(item => (
            <div
              key={item.id}
              onClick={e => handleNavigateDetail(e, item)}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-shadow relative"
            >
              {/* Image */}
              <img
                src={item.img}
                alt={t(item.nameKey)}
                className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0"
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80"; }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-gray-900">{t(item.nameKey)}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    item.statusKey === "statusAvailable"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-600"
                  }`}>
                    {t(item.statusKey)}
                  </span>
                </div>
                <p className="text-green-700 font-semibold text-sm mt-0.5">{item.price}</p>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <span className="text-xs text-gray-400">{t(item.postedOnKey)}</span>
                  <span className="text-xs text-gray-400">👁 {item.views} {t("views")}</span>
                  <span className="text-xs text-gray-400">📋 {item.requests} {t("requests")}</span>
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
                    {t("viewDetails")}
                  </button>
                  <button
                    onClick={e => handleRemove(e, item.id)}
                    className="text-xs font-semibold px-4 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 bg-white cursor-pointer transition-colors"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>

              {/* Heart Button */}
              <button
                onClick={e => handleRemove(e, item.id)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow border border-gray-100 cursor-pointer hover:bg-red-50 transition-colors"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#e53935" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
              </button>
            </div>
          ))}

          {saved.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <p className="text-base font-semibold text-gray-600">{t("noSavedEquipment")}</p>
              <p className="text-sm mt-1">{t("noSavedEquipmentHint")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}