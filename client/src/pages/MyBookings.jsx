import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext";
import { supabase } from "../supabaseClient";

export default function MyBookings() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMyBookings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const response = await fetch(`https://farmease-web.onrender.com/api/bookings?user_id=${user.id}`);
        const data = await response.json();
        console.log("My Bookings Data:", data);
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

    // Try to grab the 'stapled' equipment manual from the backend
    let dataToPass = booking.fullEquipment;

    // 🚨 THE SAFETY NET 🚨
    // If the backend didn't attach 'fullEquipment' (or it's empty), we build a
    // manual fallback object matching the exact keys the Detail page expects!
    if (!dataToPass || Object.keys(dataToPass).length === 0) {
      console.warn("⚠️ 'fullEquipment' is missing! Triggering safety net translation.");

      dataToPass = {
        id: booking.equipmentId || booking.id,
        name: booking.equipmentName || "Unknown Equipment",
        image_url: booking.imageUrl || booking.image || booking.img,
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
        <nav className="text-xs text-gray-500 mb-4 flex items-center gap-1">
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
            {bookings.map((booking) => {

              // 1. Calculate dynamic colors and text safely combining both your logic
              const currentStatus = (booking.status || 'pending').toLowerCase();
              let colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
              let displayText = currentStatus;

              if (currentStatus === 'pending') {
                colorClass = 'bg-yellow-100 text-yellow-800 border-yellow-200';
                displayText = 'Awaiting Approval';
              } else if (currentStatus === 'accepted' || currentStatus === 'rented' || currentStatus === 'buyout') {
                colorClass = 'bg-green-100 text-green-800 border-green-200';
                displayText = currentStatus === 'buyout' ? 'Purchased' : 'Accepted';
              } else if (currentStatus === 'rejected') {
                colorClass = 'bg-red-100 text-red-800 border-red-200';
                displayText = 'Rejected';
              }

              return (
                <div
                  key={booking.id || booking._id}
                  onClick={() => handleNavigate(booking)}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-shadow relative"
                >
                  {/* Image - Uses safe fallbacks from both sets of code */}
                  <img
                    src={booking.imageUrl || booking.image || booking.img}
                    alt={booking.equipmentName || booking.name}
                    className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80";
                    }}
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-bold text-sm text-gray-900 truncate capitalize">
                        {booking.equipmentName || booking.name}
                      </p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border shrink-0 ${colorClass}`}>
                        {displayText}
                      </span>
                    </div>

                    <p className="text-green-700 font-semibold text-sm mt-0.5">
                      ₹{booking.totalAmount || booking.price}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : (booking.date || "N/A")}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents the outer div click from firing
                        handleNavigate(booking);
                      }}
                      className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors cursor-pointer border-none"
                    >
                      {t("viewBooking") || "View"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}