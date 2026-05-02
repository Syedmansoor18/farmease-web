import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext"; // adjust path as needed

const initialPostings = [
  {
    id: 1,
    nameKey: "equipJohnDeere",
    price: "₹ 800 / hour",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn10May",
    views: 232,
    requests: 7,
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    type: "view",
  },
  {
    id: 2,
    nameKey: "equipWaterPump",
    price: "₹ 300 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn08May",
    views: 184,
    requests: 4,
    img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
    type: "view",
  },
  {
    id: 3,
    nameKey: "equipCombineHarvester",
    price: "₹ 4,500 / day",
    statusKey: "statusInactive",
    postedOnKey: "postedOn04May",
    views: 320,
    requests: 12,
    img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80",
    type: "activate",
  },
  {
    id: 4,
    nameKey: "equipRotavator",
    price: "₹ 700 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn28Apr",
    views: 156,
    requests: 6,
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
    type: "view",
  },
  {
    id: 5,
    nameKey: "equipRotavator",
    price: "₹ 700 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn21Apr",
    views: 156,
    requests: 3,
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
    type: "view",
  },
  {
    id: 6,
    nameKey: "equipRotavator",
    price: "₹ 700 / day",
    statusKey: "statusAvailable",
    postedOnKey: "postedOn17Apr",
    views: 355,
    requests: 8,
    img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80",
    type: "view",
  },
];

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
  const [postings, setPostings] = useState(initialPostings);
  const [activePopup, setActivePopup] = useState(null);

  const handleDelete = (e, id) => {
    e.stopPropagation();
    setPostings(prev => prev.filter(p => p.id !== id));
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
        <div className="flex flex-col gap-3 w-full">
          {postings.map(posting => (
            <div
              key={posting.id}
              onClick={() => navigate("/post-success")}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 p-3 cursor-pointer hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <img
                src={posting.img}
                alt={t(posting.nameKey)}
                className="w-20 h-16 sm:w-24 sm:h-20 rounded-xl object-cover shrink-0"
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80"; }}
              />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-sm text-gray-900">{t(posting.nameKey)}</p>
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
                  <span className="text-xs text-gray-400">{t(posting.postedOnKey)}</span>
                  <span className="text-xs text-gray-400">👁 {posting.views} {t("views")}</span>
                  <span className="text-xs text-gray-400">📋 {posting.requests} {t("requests")}</span>
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex items-center gap-2 shrink-0 flex-wrap justify-end"
                onClick={e => e.stopPropagation()}
              >
                <button className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors">
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
                  onClick={e => handleDelete(e, posting.id)}
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
              <p className="text-sm mt-1">{t("noPostingsHint")}</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
