import { useState, useEffect, useMemo } from "react"; // 🚨 Added useMemo
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext";
import { supabase } from "../supabaseClient";

export default function EquipmentDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  // 1. ALL Hooks go at the absolute top
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const rawEquipment = location.state?.equipment;

  // 2. Wrap the object builder in useMemo so it doesn't trigger endless re-renders
  const equipment = useMemo(() => {
    if (!rawEquipment) return null;
    return {
      ...rawEquipment,
      name: rawEquipment.name || rawEquipment.equipmentName || "Unknown Equipment",
      price_per_day: rawEquipment.price_per_day || rawEquipment.totalAmount || rawEquipment.price || 0,
      image_url: rawEquipment.image_url || rawEquipment.imageUrl || rawEquipment.image || null,
      type: rawEquipment.type || rawEquipment.category || "General",
      description: rawEquipment.description || "Equipment details from previous booking.",
    };
  }, [rawEquipment]);

  const origin = location.state?.from || "marketplace";

  // 🚨 DYNAMIC FIX 1: Ask the database if this item is saved
  useEffect(() => {
    const checkDatabaseSavedStatus = async () => {
      if (!equipment) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      setCurrentUser(user);

      try {
        const response = await fetch(`http://localhost:5000/api/saved?user_id=${user.id}`);
        if (response.ok) {
          const savedData = await response.json();
          // Check if the current equipment ID exists in the user's database list
          setWishlist(savedData.some(item => item.id === equipment.id));
        }
      } catch (error) {
        console.error("Failed to load database saved items:", error);
      }
    };

    checkDatabaseSavedStatus();
  }, [equipment]);

  // 🚨 DYNAMIC FIX 2: Toggle Save/Unsave in the Database
  const toggleSave = async (e) => {
    if (e) e.stopPropagation();

    if (!currentUser) {
      alert("You must be logged in to save equipment.");
      return;
    }

    const currentlySaved = wishlist;
    // Optimistic UI Update
    setWishlist(!currentlySaved);

    try {
      const response = await fetch("http://localhost:5000/api/saved/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: currentUser.id,
          equipment_id: equipment.id
        })
      });

      if (!response.ok) throw new Error("Database rejected the save");
    } catch (error) {
      console.error("Database sync failed:", error);
      // Revert if it fails
      setWishlist(currentlySaved);
    }
  };

  if (!rawEquipment || !equipment) {
    return <Navigate to="/marketplace" />;
  }

  const descMatch = equipment.description?.match(/Brand: (.*?)\| Model: (.*?)\n\n([\s\S]*?)\n\nListing Intent: (.*)/);
  const brand = descMatch ? descMatch[1].trim() : "FarmEase";
  const modelYear = descMatch ? descMatch[2].trim() : "Standard";
  const rawDesc = descMatch ? descMatch[3].trim() : equipment.description;
  const listingIntent = descMatch ? descMatch[4].trim() : "Rent";
  const isSelling = listingIntent.toLowerCase() === "sell";

  const breadcrumbMap = {
    "marketplace": { label: t("marketplace") || "Marketplace", path: "/marketplace" },
    "my-bookings": { label: t("myBookings") || "My Bookings", path: "/my-bookings" },
    "profile": { label: t("profile") || "Profile", path: "/profile" },
    "search": { label: t("search") || "Search", path: "/search" }
  };

  const currentBreadcrumb = breadcrumbMap[origin] || breadcrumbMap["marketplace"];

  const images = equipment.image_url || equipment.image
    ? [equipment.image_url || equipment.image]
    : ["https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80"];

  const SPECS = [
    { label: t("brand") || "Brand",  value: brand },
    { label: t("modelYear"),   value: modelYear },
    { label: t("category") || "Category", value: equipment.type || "Equipment" },
  ];

  const postedDate = equipment.created_at
    ? new Date(equipment.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : "Recently";

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-20 p-4 md:p-6 overflow-y-auto">

        {/* Dynamic Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1">
          <span
            className="cursor-pointer hover:text-gray-700 transition-colors capitalize"
            onClick={() => navigate(currentBreadcrumb.path)}
          >
            {currentBreadcrumb.label}
          </span>
          <span className="text-blue-700">&gt; {equipment.name}</span>
        </nav>

        {/* Main Body */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">

          {/* LEFT — Image Gallery */}
          <div className="w-full md:w-80 shrink-0">
            <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
              <img
                src={images[activeImg]}
                alt={equipment.name}
                className="w-full h-52 md:h-56 object-cover transition-opacity duration-200"
              />
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`flex-shrink-0 w-14 h-12 rounded-md overflow-hidden border-2 transition-all duration-150 cursor-pointer
                      ${activeImg === i ? "border-green-600 shadow-md" : "border-gray-200 hover:border-green-400"}`}
                  >
                    <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Details */}
          <div className="flex-1 min-w-0">

            <div className="flex gap-2 mb-3 flex-wrap">
              <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800 tracking-wide">
                {listingIntent}
              </span>
              {equipment.condition && (
                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 tracking-wide capitalize">
                  {equipment.condition === 'excellent' ? 'Brand New' : (equipment.condition === 'fair' ? 'Used' : 'Good Condition')}
                </span>
              )}
            </div>

            <div className="flex items-start justify-between mb-1 gap-2">
              <h1 className="text-xl md:text-2xl font-bold leading-tight capitalize">
                {equipment.name}
              </h1>
              <button onClick={toggleSave} className="p-1 mt-1 cursor-pointer bg-transparent border-none shrink-0">
                <svg width="22" height="22" viewBox="0 0 24 24" fill={wishlist ? "#e53e3e" : "none"} stroke={wishlist ? "#e53e3e" : "#aaa"} strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>

            <div className="flex items-center text-sm text-gray-500 mb-4 capitalize">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280" className="mr-1 shrink-0">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              {equipment.location || equipment.district}, {equipment.state || ""}
            </div>

            <div className="flex items-baseline gap-4 mb-5 flex-wrap">
              <span className="text-2xl font-bold text-gray-900">
                {isSelling
                  ? `₹${equipment.price_per_day || equipment.price}`
                  : `₹${equipment.price_per_day || equipment.price} / day`}
              </span>
            </div>

            <div className="flex flex-wrap gap-x-7 gap-y-3 mb-6">
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">{t("owner")}</p>
                <p className="text-sm font-semibold text-gray-700">Verified Farmer</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">{t("posted")}</p>
                <p className="text-sm font-semibold text-gray-700">{postedDate}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">{t("status")}</p>
                <p className={`text-sm font-semibold ${equipment.is_available ? 'text-green-600' : 'text-red-500'}`}>
                  {equipment.is_available ? t("available") : "Unavailable"}
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Connecting to owner at: ${equipment.contact_number || "Number not provided"}`)}
              className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg mb-3 transition-colors duration-200 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
              {t("contactOwner")}
            </button>

            <button
              onClick={() => navigate("/payment", { state: { equipment } })}
              className="w-full flex items-center justify-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold py-3 rounded-lg mb-6 transition-colors duration-200 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
              </svg>
              {t("bookNow")}
            </button>

            <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
              <h3 className="text-sm font-bold px-4 py-3 border-b border-gray-200 bg-white">
                {t("equipmentSpecifications")}
              </h3>
              {SPECS.map((s, i) => (
                <div key={i} className={`flex justify-between px-4 py-3 text-sm ${i % 2 === 0 ? "bg-gray-50" : "bg-white"}`}>
                  <span className="text-gray-500">{s.label}</span>
                  <span className="font-semibold text-gray-800">{s.value}</span>
                </div>
              ))}
              <div className="px-4 py-3 text-sm bg-white border-t border-gray-100 text-gray-600 leading-relaxed">
                <span className="font-semibold text-gray-800 block mb-1">Details:</span>
                {rawDesc || "No additional description provided."}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}