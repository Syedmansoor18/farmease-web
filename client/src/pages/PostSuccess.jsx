import { useNavigate, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext"; 

const Postingsuccessfulpage = ({ onEditListing }) => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { t } = useLanguage();

  // 1. Extract the equipment data sent from the ListEquipment page
  const equipment = location.state?.equipment;

  // 2. Fallback: If someone refreshes or visits directly, send them back to the form
  if (!equipment) {
    return <Navigate to="/list-equipment" />;
  }

  // 3. Unpack dynamic variables safely
  const name = equipment.name || equipment.equipmentName || "New Equipment";
  const brand = equipment.brand || "N/A";
  const modelYear = equipment.modelYear || "N/A";
  const condition = equipment.condition || "Good";
  const price = equipment.price_per_day || equipment.priceMin || equipment.price || 0;
  
  // Logic for Rent vs Sell
  const intent = equipment.listingIntent || "Rent";
  const isSelling = intent.toLowerCase() === "sell";
  
  const category = equipment.type || equipment.category || "Equipment";
  const description = equipment.description || "No description provided.";
  
  // Handle image safely
  const image = equipment.image_url || equipment.image || equipment.mainPhoto?.url || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80";
  
  // Format location beautifully
  const locRaw = [equipment.village, equipment.location, equipment.district].filter(Boolean)[0] || "";
  const locationText = locRaw ? `${locRaw}, ${equipment.state || ""}` : equipment.state || "Location not specified";

  return (
    <div className="flex bg-gray-50 min-h-screen" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar />

      <div className="flex-1 py-6 px-4 sm:px-8" style={{ marginLeft: "76px" }}>

        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-1 text-sm flex-wrap">
          <span onClick={() => navigate("/list-equipment")} className="text-gray-700 cursor-pointer hover:underline flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
            {t("listEquipment")}
          </span>
          <span className="text-blue-700 flex items-center gap-1">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
            </svg>
            {t("postingSuccessful")}
          </span>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">

          {/* Success Banner */}
          <div className="bg-green-100 px-4 sm:px-6 py-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-md">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {t("equipmentPostedSuccessfully")}
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-2">
              {t("equipmentNowLive")}
            </p>
          </div>

          {/* Equipment Card */}
          <div className="px-4 sm:px-8 py-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
              {t("yourPostedEquipment")}
            </h3>

            <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col sm:flex-row">

              {/* Image */}
              <div className="relative w-full sm:w-72 flex-shrink-0 bg-white h-52 sm:h-auto">
                <img src={image} alt={name} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 bg-green-700 text-white text-sm font-bold px-3 py-1 rounded uppercase tracking-wider">
                  {intent}
                </span>
                <div className="absolute bottom-3 left-3 bg-white/90 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1.5 capitalize">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                  {t("availableNow") || "Available"}
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 px-4 sm:px-8 py-5 sm:py-6">
                <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 capitalize">
                  {name}
                </h4>

                <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5 capitalize">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-400 flex-shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {locationText}
                </p>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mb-5">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide mb-1">{t("category") || "Category"}</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-700 capitalize">{category}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide mb-1">{t("brand")}</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-700 capitalize">{brand}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide mb-1">{t("modelYear")}</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-700">{modelYear}</p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-wide mb-1">{t("condition")}</p>
                    <p className="text-sm sm:text-base font-semibold text-gray-700 capitalize">{condition}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-4 gap-2">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{isSelling ? "Selling Price" : t("rentPricePerDay")}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-800">
                      ₹{Number(price).toLocaleString()} {isSelling ? "" : `/ ${t("day") || "day"}`}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 italic leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="mx-4 sm:mx-8 mb-6 bg-gray-50 rounded-xl px-4 sm:px-6 py-4">
            <p className="text-base font-semibold text-gray-700 mb-1">{t("whatsNext")}</p>
            <p className="text-sm text-gray-500">{t("whatsNextDetail")}</p>
          </div>

          {/* Buttons */}
          <div className="px-4 sm:px-8 pb-8">
            <button onClick={() => navigate("/my-postings")} className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl py-4 text-base transition-colors mb-3">
              {t("viewMyPostings")}
            </button>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              
              {/* 🚨 This is the restored Edit button! */}
              <button onClick={onEditListing} className="flex-1 border border-gray-300 text-gray-700 font-medium rounded-xl py-3.5 text-base hover:bg-gray-50">
                {t("editListing")}
              </button>

              <button onClick={() => navigate("/list-equipment")} className="flex-1 border border-gray-300 text-gray-700 font-medium rounded-xl py-3.5 text-base hover:bg-gray-50">
                {t("postAnother")}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Postingsuccessfulpage;