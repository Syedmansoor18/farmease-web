import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext"; 
import { supabase } from "../supabaseClient";

// We leave the dummy requests here for now until we build the Booking Engine
const farmerRequests = [
  { farmer: "Ramesh Kumar",  location: "Pune, Maharashtra",   date: "12 May 2024", deliveryKey: "deliverySelfPickup",   avatar: "RK" },
  { farmer: "Suresh Patel",  location: "Nashik, Maharashtra", date: "10 May 2024", deliveryKey: "deliveryHomeDelivery", avatar: "SP" },
  { farmer: "Anita Sharma",  location: "Nagpur, Maharashtra", date: "09 May 2024", deliveryKey: "deliverySelfPickup",   avatar: "AS" },
];

function RequestPopup({ posting, onClose, t }) {
  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {t("requestsFor")} {t(posting.nameKey)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold border-none bg-transparent cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Equipment Info */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 mb-5">
          <img
            src={posting.img}
            alt={t(posting.nameKey)}
            className="w-16 h-12 rounded-lg object-cover"
          />
          <div>
            <p className="font-bold text-sm text-gray-900">{t(posting.nameKey)}</p>
            <p className="text-green-700 text-sm font-semibold">{posting.price}</p>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700 uppercase">
              {t(posting.statusKey)}
            </span>
          </div>
        </div>

        {/* Farmer Requests */}
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          {t("farmerRequests")} ({farmerRequests.length})
        </p>
        <div className="flex flex-col gap-3 max-h-64 overflow-y-auto">
          {farmerRequests.map((req, i) => (
            <div key={i} className="flex items-center justify-between border border-gray-100 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {req.avatar}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{req.farmer}</p>
                  <p className="text-xs text-gray-400">{req.location}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-500">📅 {req.date}</span>
                    <span className="text-xs text-gray-500">🚜 {t(req.deliveryKey)}</span>
                  </div>
                </div>
              </div>
              <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors">
                {t("accept")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MyPostings() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [postings, setPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePopup, setActivePopup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  // 🚨 FETCH LIVE DATA ON LOAD
  useEffect(() => {
    fetchMyEquipment();
  }, []);

  const fetchMyEquipment = async () => {
    try {
      setIsLoading(true);
      
      // 1. Get logged-in user (This stays on the frontend because it handles secure browser cookies!)
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 2. Ask our Node server to do all the heavy lifting
      const response = await fetch(`http://localhost:5000/api/my-postings?user_id=${user.id}`);
      const equipmentData = await response.json();

      if (!response.ok) throw new Error(equipmentData.error || "Failed to fetch");

      // 3. Map the DB data into our UI format (Keeping your awesome regex unpacking!)
      const formattedPostings = equipmentData.map(eq => {
        
        const descMatch = eq.description?.match(/Brand: (.*?)\| Model: (.*?)\n\n([\s\S]*?)\n\nListing Intent: (.*)/);
        const parsedBrand = descMatch ? descMatch[1].trim() : "";
        const parsedModel = descMatch ? descMatch[2].trim() : "";
        const parsedDesc = descMatch ? descMatch[3].trim() : eq.description;
        const parsedIntent = descMatch ? descMatch[4].trim() : "Rent";
        const isSelling = parsedIntent.toLowerCase() === "sell";
        const displayPrice = eq.price_per_day || eq.price || 0;

        return {
          id: eq.id,
          nameKey: eq.name, 
          // 🚨 SMART PRICE TAG
          price: isSelling ? `₹ ${displayPrice}` : `₹ ${displayPrice} / day`,
          statusKey: eq.is_available ? "statusAvailable" : "statusInactive",
          postedOnKey: new Date(eq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          views: Math.floor(Math.random() * 50), 
          requests: Math.floor(Math.random() * 5),
          img: eq.image_url || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80",
          type: eq.is_available ? "view" : "activate",
          
          editPayload: {
            id: eq.id,
            equipmentName: eq.name,
            category: eq.type,
            brand: parsedBrand,
            modelYear: parsedModel,
            description: parsedDesc,
            priceMin: eq.price_per_day,
            village: eq.location,
            district: eq.district,
            state: eq.state,
            pincode: eq.pincode,
            condition: eq.condition === 'excellent' ? 'Brand New' : (eq.condition === 'fair' ? 'Used' : 'Good'),
            availableNow: eq.is_available,
            listingIntent: parsedIntent,
            image_url: eq.image_url, 
            mainPhoto: eq.image_url ? { url: eq.image_url, name: "cloud-image" } : null
          }
        };
      });

      // Assuming your state hook is named setMyEquipment or similar
      setPostings(formattedPostings); 
    } catch (error) {
      console.error("Error fetching my equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

// Triggered when they click the trash can icon
  const confirmDelete = (id) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  // Triggered when they click "Yes, Delete" inside the pop-up
  const executeDelete = async () => {
    if (!postToDelete) return;
    
    try {
      // Tell the Node server to delete it from Supabase
      const response = await fetch(`http://localhost:5000/api/equipment/${postToDelete}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete from server");

      // Instantly remove it from the screen without refreshing the page!
      setPostings(prev => prev.filter(item => item.id !== postToDelete));
      
      // Close the modal
      setShowDeleteModal(false);
      setPostToDelete(null);

    } catch (error) {
      console.error("Error deleting equipment:", error);
      alert("Something went wrong trying to delete this item.");
    }
  };

  const handleViewRequest = (e, posting) => {
    e.stopPropagation();
    setActivePopup(posting);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      {activePopup && (
        <RequestPopup posting={activePopup} onClose={() => setActivePopup(null)} t={t} />
      )}

      <main className="flex-1 ml-20 p-4 sm:p-6 overflow-y-auto">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400 mb-4 flex items-center gap-1">
          <span className="cursor-pointer hover:text-green-700 transition-colors" onClick={() => navigate(-1)}>
            &gt; {t("profile")}
          </span>
          <span className="text-blue-700">&gt; {t("myPostings")}</span>
        </nav>

        {/* Header */}
        <div className="flex items-center justify-between mb-6 gap-3 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t("myPostings")}</h1>
            <p className="text-sm text-gray-400 mt-0.5">{t("managePostings")}</p>
          </div>
          <button
            onClick={() => navigate("/list-equipment")}
            className="bg-green-700 hover:bg-green-800 text-white text-sm font-semibold px-4 py-2 rounded-xl border-none cursor-pointer transition-colors flex items-center gap-2"
          >
            + {t("addNewEquipment")}
          </button>
        </div>

        {/* Posting Cards */}
        {isLoading ? (
          <div className="text-center py-10 text-green-700 font-bold">Loading your equipment...</div>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {postings.map(posting => (
              <div
                key={posting.id}
                onClick={() => navigate("/post-success", { state: posting.editPayload })}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <img
                  src={posting.img}
                  alt={posting.nameKey}
                  className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-sm text-gray-900">{posting.nameKey}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      posting.statusKey === "statusAvailable"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-600"
                    }`}>
                      {t(posting.statusKey)}
                    </span>
                  </div>
                  <p className="text-green-700 font-semibold text-sm mt-0.5">{posting.price}</p>
                  <div className="flex items-center gap-4 mt-1 flex-wrap">
                    <span className="text-xs text-gray-400">{posting.postedOnKey}</span>
                    <span className="text-xs text-gray-400">👁 {posting.views} {t("views")}</span>
                    <span className="text-xs text-gray-400">📋 {posting.requests} {t("requests")}</span>
                  </div>
                </div>

                {/* Actions */}
                <div
                  className="flex items-center gap-2 shrink-0 flex-wrap justify-end"
                  onClick={e => e.stopPropagation()}
                >
                  {/* 🚨 EDIT LISTING NOW PASSES THE UNPACKED DATA */}
                  <button 
                    onClick={() => navigate("/list-equipment", { state: posting.editPayload })}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {t("editListing")}
                  </button>

                  {posting.type === "activate" ? (
                    <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors">
                      {t("activate")}
                    </button>
                  ) : (
                    <button
                      onClick={e => handleViewRequest(e, posting)}
                      className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border-none cursor-pointer transition-colors"
                    >
                      {t("viewRequests")}
                    </button>
                  )}

                  <button
                    onClick={e => confirmDelete(posting.id)}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 cursor-pointer transition-colors bg-white"
                  >
                    {t("delete")}
                  </button>
                </div>
              </div>
            ))}

            {postings.length === 0 && (
              <div className="text-center py-20 text-gray-400">
                <p className="text-base font-semibold text-gray-600">{t("noPostingsYet")}</p>
                <p className="text-sm mt-1">You haven't posted any equipment yet.</p>
              </div>
            )}
          </div>

          
        )}

        {/* 🚨 THE CUSTOM DELETE CONFIRMATION POP-UP */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[320px] text-center shadow-xl animate-fade-in">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-red-600 fill-current">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </div>
              <h2 className="text-lg font-bold text-gray-900 mb-2">Delete Equipment?</h2>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to remove this listing? This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setPostToDelete(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDelete}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}