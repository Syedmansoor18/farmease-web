import React from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

const tractors = [
  { name: "Swaraj 855 FE", price: "₹600/day", location: "Odisha", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { name: "Kubota MU4501", price: "₹800/day", location: "Mandya", image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { name: "Eicher 380", price: "₹400/day", location: "Arala", image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { name: "John Deere 5050 D", price: "₹700/day", location: "Punjab", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80" },
  { name: "Mahindra 575 DI", price: "₹550/day", location: "Haryana", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&q=80" },
  { name: "New Holland 3630", price: "₹650/day", location: "Kumta", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
];

const harvesting = [
  { name: "Kartar 4000 Combine", price: "₹2500/day", location: "Itarsi, MP", image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=400&q=80", tag: "HIGH_DEMAND" },
  { name: "Preet 987 Multicrop", price: "₹2200/day", location: "Hoshangabad", image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&q=80" },
  { name: "Wheat Combine Harvester", price: "₹2000/day", location: "Rajasthan", image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { name: "Rice Harvester HD", price: "₹1800/day", location: "Tamil Nadu", image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { name: "Sugarcane Harvester", price: "₹2800/day", location: "Maharashtra", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", tag: "HIGH_DEMAND" },
  { name: "Maize Harvester Pro", price: "₹2100/day", location: "Karnataka", image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
];

const irrigation = [
  { name: "Diesel Water Pump 5HP", price: "₹200/day", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { name: "Sprinkler Set (20 Pipes)", price: "₹350/day", image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80" },
  { name: "Drip Irrigation Kit", price: "₹150/day", image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400&q=80" },
  { name: "Boom Sprayer 500L", price: "₹300/day", image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
];

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

const Section = ({ title, data, onCardClick, highDemandLabel }) => (
  <div className="mb-8">
    <h2 className="text-lg font-semibold mb-3">{title}</h2>
    <div className="flex overflow-x-auto no-scrollbar pb-2">
      {data.map((item, i) => (
        <Card key={i} item={item} onClick={() => onCardClick(item)} highDemandLabel={highDemandLabel} />
      ))}
    </div>
  </div>
);

const Marketplace = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleCardClick = (item) => {
    navigate("/equipment-detail", { state: { equipment: item } });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-20 p-4 md:p-6 overflow-y-auto">

        <Section title={t("tractorsSection")} data={tractors} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
        <Section title={t("harvestingEquipment")} data={harvesting} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />
        <Section title={t("irrigationTools")} data={irrigation} onCardClick={handleCardClick} highDemandLabel={t("highDemand")} />

        {/* Popular Section */}
        <h2 className="text-lg font-semibold mb-3">{t("popularEquipment")}</h2>

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
