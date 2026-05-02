import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext";

const IMAGES = [
  "/T1.jpeg",
  "/T2.jpeg",
  "/T3.jpeg",
  "/T4.jpeg",
  "/T5.jpeg",
];

export default function EquipmentDetailPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Specs built with t() so labels translate
  const SPECS = [
    { label: t("horsepower"),  value: "57 HP" },
    { label: t("engineHours"), value: "1,200 hrs" },
    { label: t("modelYear"),   value: "2021" },
    { label: t("fuelType"),    value: t("diesel") },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      {/* ml-0 on mobile (sidebar overlays), ml-20 on md+ */}
      <main className="flex-1 ml-0 md:ml-20 p-4 md:p-6 overflow-y-auto">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex items-center gap-1 flex-wrap">
          <span
            className="text-gray-700 cursor-pointer hover:underline"
            onClick={() => navigate("/marketplace")}
          >
            {t("marketplace")}
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-blue-500">Mahindra NOVO 605 DI</span>
        </nav>

        {/* Main Body */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* LEFT — Image Gallery */}
          <div className="w-full md:w-80 shrink-0">
            <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
              <img
                src={IMAGES[activeImg]}
                alt="Equipment"
                className="w-full h-52 md:h-56 object-cover transition-opacity duration-200"
              />
            </div>

            {/* Thumbnails — scrollable on mobile */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {IMAGES.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`flex-shrink-0 w-14 h-12 rounded-md overflow-hidden border-2 transition-all duration-150 cursor-pointer
                    ${activeImg === i
                      ? "border-green-600 shadow-md"
                      : "border-gray-200 hover:border-green-400"
                    }`}
                >
                  <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT — Details */}
          <div className="flex-1 min-w-0">

            {/* Badges */}
            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800 tracking-wide">
                {t("rentAndSell")}
              </span>
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 tracking-wide">
                {t("goodCondition")}
              </span>
            </div>

            {/* Title + Wishlist */}
            <div className="flex items-start justify-between mb-1 gap-2">
              <h1 className="text-xl md:text-2xl font-bold leading-tight">
                Mahindra Novo 605 DI
              </h1>
              <button
                onClick={() => setWishlist(!wishlist)}
                className="p-1 mt-1 cursor-pointer bg-transparent border-none shrink-0"
                aria-label="Toggle wishlist"
              >
                <svg width="22" height="22" viewBox="0 0 24 24"
                  fill={wishlist ? "#e53e3e" : "none"}
                  stroke={wishlist ? "#e53e3e" : "#aaa"}
                  strokeWidth="2"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            {/* Location */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280" className="mr-1 shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              Tumkur, Karnataka
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-5 flex-wrap">
              <span className="text-2xl font-bold text-gray-900">
                ₹800 <span className="text-sm font-normal text-gray-500">/{t("day")}</span>
              </span>
              <span className="text-xl font-semibold text-gray-800">₹15,000</span>
            </div>

            {/* Owner / Posted / Status — wraps on small screens */}
            <div className="flex flex-wrap gap-x-7 gap-y-3 mb-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                  {t("owner")}
                </p>
                <p className="text-sm font-semibold text-gray-700">Ramesh Kumar</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                  {t("posted")}
                </p>
                <p className="text-sm font-semibold text-gray-700">2 {t("daysAgo")}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">
                  {t("status")}
                </p>
                <p className="text-sm font-semibold text-green-600">{t("available")}</p>
              </div>
            </div>

            {/* Contact Owner Button */}
            <button
              onClick={() => alert("Contact Owner clicked")}
              className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg mb-3 transition-colors duration-200 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              {t("contactOwner")}
            </button>

            {/* Book Now Button */}
            <button
              onClick={() => navigate("/payment")}
              className="w-full flex items-center justify-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold py-3 rounded-lg mb-6 transition-colors duration-200 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              {t("bookNow")}
            </button>

            {/* Specs Card */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <h3 className="text-sm font-bold px-4 py-3 border-b border-gray-200 bg-white">
                {t("equipmentSpecifications")}
              </h3>
              {SPECS.map((s, i) => (
                <div
                  key={i}
                  className={`flex justify-between px-4 py-3 text-sm ${
                    i % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <span className="text-gray-500">{s.label}</span>
                  <span className="font-semibold text-gray-800">{s.value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
