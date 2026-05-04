import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";

export default function MyPostings() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [postings, setPostings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // States for Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Owner's Equipment
      const eqResponse = await fetch(`http://localhost:5000/api/my-postings?user_id=${user.id}`);
      const equipmentData = await eqResponse.json();

      // 2. Fetch Incoming Requests
      const reqResponse = await fetch(`http://localhost:5000/api/owner-requests?owner_id=${user.id}`);
      if (reqResponse.ok) {
        const reqData = await reqResponse.json();
        setRequests(reqData);
      }

      if (!eqResponse.ok) throw new Error(equipmentData.error || "Failed to fetch");

      // Format the DB data for the UI cards
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
          price: isSelling ? `₹ ${displayPrice}` : `₹ ${displayPrice} / day`,
          statusKey: eq.is_available ? "statusAvailable" : "statusInactive",
          postedOnKey: new Date(eq.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          img: eq.image_url || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80",

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

      setPostings(formattedPostings);
    } catch (error) {
      console.error("Error fetching my equipment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 🚨 THE APPROVAL LOGIC
  const handleAcceptRequest = async (request) => {
    try {
      // 1. Update Booking status to 'rented' in your Node Backend
      await fetch(`http://localhost:5000/api/bookings/${request._id || request.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "rented" })
      });

      // 2. Send Notification to Renter
      await supabase.from("notifications").insert([{
        user_id: request.userId,
        title: "Booking Accepted! 🎉",
        message: `Your request for ${request.equipmentName} has been approved.`,
        type: "success",
        action_url: "/my-bookings",
        is_read: false
      }]);

      // 3. Remove request from UI
      setRequests(prev => prev.filter(r => (r._id || r.id) !== (request._id || request.id)));
      alert("Booking Accepted! The renter has been notified.");
    } catch (error) {
      console.error("Failed to accept request", error);
    }
  };

  // Triggered when they click the delete button
  const confirmDelete = (id) => {
    setPostToDelete(id);
    setShowDeleteModal(true);
  };

  // Triggered when they click "Yes, Delete" inside the pop-up
  const executeDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/equipment/${postToDelete}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete from server");

      setPostings(prev => prev.filter(item => item.id !== postToDelete));
      setShowDeleteModal(false);
      setPostToDelete(null);

    } catch (error) {
      console.error("Error deleting equipment:", error);
      alert("Something went wrong trying to delete this item.");
    }
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

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

        {/* 🚨 INCOMING REQUESTS SECTION */}
        {requests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              Pending Requests ({requests.length})
            </h2>
            <div className="flex flex-col gap-3 w-full">
              {requests.map(req => (
                <div key={req._id || req.id} className="bg-orange-50 rounded-2xl border border-orange-200 shadow-sm flex items-center gap-4 p-4">
                  <img src={req.imageUrl} alt={req.equipmentName} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-gray-900">{req.equipmentName}</p>
                    <p className="text-orange-700 font-semibold text-xs mt-0.5">Requested for {req.rentalDays} days • ₹{req.totalAmount}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAcceptRequest(req)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
                      Accept
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold text-gray-900 mb-3">Your Equipment</h2>
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
                    <span className="text-xs text-gray-400">Posted on: {posting.postedOnKey}</span>
                  </div>
                </div>

                {/* Actions: ONLY Edit and Delete */}
                <div
                  className="flex items-center gap-2 shrink-0 flex-wrap justify-end"
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate("/list-equipment", { state: posting.editPayload });
                    }}
                    className="text-xs font-semibold px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    {t("editListing") || "Edit"}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      confirmDelete(posting.id);
                    }}
                    className="text-xs font-semibold px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 cursor-pointer transition-colors bg-white"
                  >
                    {t("delete") || "Delete"}
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