import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

// ✅ Status Button Component
function StatusButton({ status, onClick }) {
  const { t } = useLanguage();

  if (status === "view") {
    return (
      <button
        onClick={onClick}
        className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors cursor-pointer border-none"
      >
        {t("viewBooking")}
      </button>
    );
  }

  if (status === "rented") {
    return (
      <span className="bg-red-100 text-red-500 text-xs font-bold px-4 py-1.5 rounded-md">
        {t("rented")}
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

  return null;
}

// ✅ Main Component
export default function MyBookings() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/booking-success");
  };

  const bookings = [
    {
      id: 1,
      name: "John Deere 5075E Tractor",
      price: "₹ 800 / hour",
      date: "Booked on 10 May 2024",
      status: "view",
      img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    },
    {
      id: 2,
      name: "Water Pump 5 HP",
      price: "₹ 300 / day",
      date: "Booked on 08 May 2024",
      status: "view",
      img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
    },
    {
      id: 3,
      name: "Combine Harvester",
      price: "₹ 4,500 / day",
      date: "Booked on 04 May 2024",
      status: "rented",
      img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80",
    },
  ];

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 p-6 overflow-y-auto">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-500 mb-4 flex-items center gap-1">
          <span
            className="cursor-pointer hover:text-gray-700 transition-colors"
            onClick={() => navigate(-1)}
          >
            &gt; {t("profile")}
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

        {/* Booking Cards */}
        <div className="flex flex-col gap-3 w-full">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              onClick={handleNavigate}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <img
                src={booking.img}
                alt={booking.name}
                className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80";
                }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">
                  {booking.name}
                </p>
                <p className="text-green-700 font-semibold text-sm mt-0.5">
                  {booking.price}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {booking.date}
                </p>
              </div>

              {/* Action Button */}
              <div
                className="shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <StatusButton
                  status={booking.status}
                  onClick={handleNavigate}
                />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}