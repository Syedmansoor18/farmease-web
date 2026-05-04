import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";

// ✅ Status Button Component
function StatusButton({ status, onClick }) {
  const { t } = useLanguage();

  if (status === "pending") {
    return (
      <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-xs font-bold px-4 py-1.5 rounded-md">
        {t("pending") || "Pending"}
      </span>
    );
  }

  if (status === "rented") {
    return (
      <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-md">
        {t("rented") || "Accepted"}
      </span>
    );
  }

  if (status === "buyout") {
    return (
      <span className="bg-green-100 text-green-700 text-xs font-bold px-4 py-1.5 rounded-md">
        {t("buyout")}
      </span>
    );
  }

  // Fallback for active/view
  return (
    <button
      onClick={onClick}
      className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors cursor-pointer border-none"
    >
      {t("viewBooking")}
    </button>
  );
}

// ✅ Main Component
export default function MyBookings() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        const response = await fetch(`http://localhost:5000/api/bookings?user_id=${user.id}`);
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching real bookings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyBookings();
  }, []);

  const handleNavigate = (booking) => {
    console.log("📦 Raw Booking Data:", booking);
    let dataToPass = booking.fullEquipment;

    if (!dataToPass || Object.keys(dataToPass).length === 0) {
      console.warn("⚠️ 'fullEquipment' is missing! Triggering safety net translation.");
      dataToPass = {
        id: booking.equipmentId || booking.id,
        name: booking.equipmentName || "Unknown Equipment",
        image_url: booking.imageUrl,
        price_per_day: booking.totalAmount || booking.price,
        description: "Booking Date: " + (booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : "N/A"),
        brand: "FarmEase Rental",
        condition: "good"
      };
    }

    console.log("🚀 Sending this to Detail Page:", dataToPass);

    navigate("/equipment-detail", {
      state: {
        equipment: dataToPass,
        from: "my-bookings"
      }
    });
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-20 p-6 overflow-y-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4 flex-items center gap-1">
          <span
            className="cursor-pointer hover:text-gray-700 transition-colors"
            onClick={() => navigate("/profile")}
          >
             {t("profile")}
          </span>
          <span className="text-blue-700">&gt; {t("myBookings")}</span>
        </nav>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900">
            {t("myBookings")}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {t("manageBookings")}
          </p>
        </div>

        {/* Booking Cards Loading State */}
        {isLoading ? (
            <p className="text-gray-500 text-sm">Loading your bookings...</p>
        ) : bookings.length === 0 ? (
            <p className="text-gray-500 text-sm">You haven't made any bookings yet.</p>
        ) : (
          <div className="flex flex-col gap-3 w-full">
            {bookings.map((booking) => (
              <div
                key={booking._id || booking.id}
                onClick={() => handleNavigate(booking)}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <img
                  src={booking.imageUrl || booking.image || booking.img}
                  alt={booking.equipmentName || booking.name}
                  className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0"
                  onError={(e) => {
                    e.target.src =
                      "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80";
                  }}
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate capitalize">
                    {booking.equipmentName || booking.name}
                  </p>
                  <p className="text-green-700 font-semibold text-sm mt-0.5">
                    ₹{booking.totalAmount || booking.price}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : booking.date}
                  </p>
                </div>

                {/* Action Button */}
                <div
                  className="shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNavigate(booking);
                  }}
                >
                  <StatusButton
                    status={booking.status}
                    onClick={() => handleNavigate(booking)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}