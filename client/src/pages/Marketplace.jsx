import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext";

const Card = ({ item, onClick, highDemandLabel }) => {
  // 🚨 1. Figure out if this is a Sale or a Rental
  const descMatch = item.description?.match(/Listing Intent: (.*)/);
  const listingIntent = descMatch ? descMatch[1].trim() : "Rent";
  const isSelling = listingIntent.toLowerCase() === "sell";

  // 🚨 2. Clean the price string (This forces "/ day" out of the string if the backend baked it in)
  // We also fallback to item.price_per_day just in case your database uses that instead!
  let basePrice = item.price || `₹${item.price_per_day || 0}`;
  basePrice = basePrice.toString().replace(/\/?\s*day/gi, '').trim();

  return (
    <div
      onClick={onClick}
      // Added snap-start for smooth mobile swiping
      className="min-w-[220px] sm:min-w-[260px] bg-white rounded-2xl shadow-sm overflow-hidden mr-4 cursor-pointer hover:shadow-md transition-shadow flex-shrink-0 snap-start"
    >
      <img
        src={item.image_url || item.image} // Safely checking both image variables
        alt={item.name}
        className="h-36 w-full object-cover"
        onError={e => { e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80"; }}
      />
      <div className="p-3">
        <div className="font-semibold text-sm truncate">{item.name}</div>

        {/* 🚨 3. THE DYNAMIC PRICE RENDER 🚨 */}
        <div className="text-green-600 font-medium text-sm mt-1">
          {basePrice} {isSelling ? "" : <span className="text-gray-400 text-xs font-normal">/ day</span>}
        </div>

        {item.location && (
          <div className="text-gray-400 text-xs mt-1 truncate">{item.location}</div>
        )}
        {item.tag === "HIGH_DEMAND" && (
          <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded mt-2 inline-block font-bold">
            {highDemandLabel}
          </span>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, data, onCardClick, highDemandLabel }) => {
  if (!data || data.length === 0) return null; // Don't render empty sections

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {/* Added edge-to-edge scrolling on mobile with -mx-4 px-4 and snap scrolling */}
      <div className="flex overflow-x-auto no-scrollbar pb-4 -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory">
        {data.map((item, i) => (
          <Card key={i} item={item} onClick={() => onCardClick(item)} highDemandLabel={highDemandLabel} />
        ))}
      </div>
    </div>
  );
};

const Marketplace = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // State to hold our real-time data
  // 🚨 ADDED: A bucket for everything else!
  const [equipment, setEquipment] = useState({ tractors: [], harvesting: [], irrigation: [], others: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        // Replace this URL with your actual backend endpoint if needed
        // e.g., https://farmease-web.onrender.com/api/marketplace
        const response = await fetch('https://farmease-web.onrender.com/api/marketplace');

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setEquipment(data);
      } catch (err) {
        console.error("Failed to fetch equipment:", err);
        setError("Could not load marketplace data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketplaceData();
  }, []);

  const handleCardClick = (item) => {
    navigate("/equipment-detail", { state: { equipment: item, from: "marketplace" } });
  };

  return (
    // Added overflow-hidden to the outer container to stop accidental horizontal screen bouncing
    <div className="flex bg-gray-50 min-h-screen max-w-[100vw] overflow-hidden">
      <Sidebar />

      {/* Added extra bottom padding (pb-24) on mobile so bottom navigation bars don't cover content */}
      <main className="flex-1 ml-0 md:ml-20 p-4 md:p-6 overflow-x-hidden overflow-y-auto w-full pb-24 md:pb-10">

        {/* Handle Loading & Error States */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-green-700 font-semibold text-sm md:text-base">
            Loading equipment...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 font-semibold text-sm md:text-base text-center px-4">
            {error}
          </div>
        ) : (
          <>
            <Section title={t("tractorsSection")} data={equipment.tractors} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
            <Section title={t("harvestingEquipment")} data={equipment.harvesting} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
            <Section title={t("irrigationTools")} data={equipment.irrigation} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
            <Section title={t("Other Equipment") || "Other Farm Tools"} data={equipment.others} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
          </>
        )}

        {/* Popular Section */}
        <h2 className="text-lg font-semibold mb-3 mt-4 md:mt-8">{t("popularEquipment")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-4">

          {/* Big Banner */}
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden h-60 md:h-64 shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Popular Equipment"
            />
            <div className="absolute inset-0 bg-green-900/50 p-4 md:p-6 flex flex-col justify-end">
              <span className="bg-green-200 text-green-800 text-[10px] md:text-xs px-2 py-1 rounded w-fit mb-2 font-bold uppercase tracking-wider">
                {t("trendingIn")}
              </span>
              <h3 className="text-white text-lg md:text-xl font-bold leading-tight">{t("kubotaTitle")}</h3>
              <p className="text-gray-200 text-xs md:text-sm mt-1 line-clamp-2 md:line-clamp-none">{t("kubotaDesc")}</p>
              <button
                onClick={() => navigate("/equipment-detail")}
                className="bg-white text-green-700 px-4 py-2 rounded-full mt-3 w-fit font-medium hover:bg-green-50 transition-colors text-xs md:text-sm shadow-sm"
              >
                {t("bookNowFrom")}
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-center border border-gray-100">
            <h3 className="font-semibold text-base md:text-lg mb-2">{t("equipmentProtection")}</h3>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4 md:mb-0">{t("equipmentProtectionDesc")}</p>
            <button className="text-green-600 mt-auto md:mt-3 font-bold flex items-center gap-1 hover:gap-2 transition-all text-sm w-fit">
              {t("learnMore")} <span>→</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Marketplace;