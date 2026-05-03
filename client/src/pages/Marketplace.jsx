import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

const Card = ({ item, onClick, highDemandLabel }) => (
  <div
    onClick={onClick}
    className="min-w-[220px] sm:min-w-[260px] bg-white rounded-2xl shadow-sm overflow-hidden mr-4 cursor-pointer hover:shadow-md transition-shadow flex-shrink-0"
  >
    <img
      src={item.image}
      alt={item.name}
      className="h-36 w-full object-cover"
      onError={e => { e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80"; }}
    />
    <div className="p-3">
      <div className="font-semibold text-sm">{item.name}</div>
      <div className="text-green-600 font-medium text-sm mt-1">{item.price}</div>
      {item.location && (
        <div className="text-gray-400 text-xs mt-1">{item.location}</div>
      )}
      {item.tag === "HIGH_DEMAND" && (
        <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded mt-2 inline-block font-bold">
          {highDemandLabel}
        </span>
      )}
    </div>
  </div>
);

const Section = ({ title, data, onCardClick, highDemandLabel }) => {
  if (!data || data.length === 0) return null; // Don't render empty sections
  
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="flex overflow-x-auto no-scrollbar pb-2">
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
  const [equipment, setEquipment] = useState({ tractors: [], harvesting: [], irrigation: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchMarketplaceData = async () => {
      try {
        // Replace this URL with your actual backend endpoint if needed
        // e.g., http://localhost:5000/api/marketplace
        const response = await fetch('http://localhost:5000/api/marketplace'); 
        
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
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-20 p-4 md:p-6 overflow-y-auto">
        
        {/* Handle Loading & Error States */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64 text-green-700 font-semibold">
            Loading equipment...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500 font-semibold">
            {error}
          </div>
        ) : (
          <>
            <Section title={t("tractorsSection")} data={equipment.tractors} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
            <Section title={t("harvestingEquipment")} data={equipment.harvesting} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
            <Section title={t("irrigationTools")} data={equipment.irrigation} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
          </>
        )}

        {/* Popular Section */}
        <h2 className="text-lg font-semibold mb-3 mt-8">{t("popularEquipment")}</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-10">

          {/* Big Banner */}
          <div className="md:col-span-2 relative rounded-2xl overflow-hidden h-56 md:h-64 shadow-sm group">
            <img
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80"
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              alt="Popular Equipment"
            />
            <div className="absolute inset-0 bg-green-900/50 p-5 md:p-6 flex flex-col justify-end">
              <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded w-fit mb-2 font-bold">
                {t("trendingIn")}
              </span>
              <h3 className="text-white text-lg md:text-xl font-bold">{t("kubotaTitle")}</h3>
              <p className="text-gray-200 text-sm mt-1">{t("kubotaDesc")}</p>
              <button
                onClick={() => navigate("/equipment-detail")}
                className="bg-white text-green-700 px-4 py-2 rounded-full mt-3 w-fit font-medium hover:bg-green-50 transition-colors text-sm"
              >
                {t("bookNowFrom")}
              </button>
            </div>
          </div>

          {/* Right Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-center border border-gray-100">
            <h3 className="font-semibold text-lg mb-2">{t("equipmentProtection")}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{t("equipmentProtectionDesc")}</p>
            <button className="text-green-600 mt-3 font-bold flex items-center gap-1 hover:gap-2 transition-all">
              {t("learnMore")} <span>→</span>
            </button>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Marketplace;