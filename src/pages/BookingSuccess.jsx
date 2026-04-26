import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

export default function BookingSuccess() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 px-10 py-6 font-sans text-gray-800">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
          <span className="cursor-pointer hover:underline text-gray-600" onClick={() => navigate("/marketplace")}>
            {t("marketplace")}
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="cursor-pointer hover:underline text-gray-600" onClick={() => navigate("/equipment-detail")}>
            Mahindra NOVO 605 DI
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-blue-600">{t("payment")}</span>
        </nav>

        {/* Success Banner */}
        <div className="w-full bg-green-100 rounded-2xl flex flex-col items-center justify-center py-8 mb-6">
          <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center mb-4 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("bookingSuccessful")}</h1>
          <p className="text-sm text-gray-500">{t("bookingSuccessSubtitle")}</p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-6">

          {/* LEFT */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl border border-gray-200 p-4 mb-5">
              <div className="flex gap-4 items-start">
                <img src="/T1.jpeg" alt="Tractor" className="w-32 h-24 object-cover rounded-xl shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-lg font-bold text-gray-900">Mahindra Novo 605 DI</h2>
                    <span className="text-xs font-semibold bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      {t("confirmed")}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="#9ca3af" className="mr-1">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                    Tumkur, Karnataka
                  </div>
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">{t("startDate")}</p>
                      <p className="text-sm font-semibold text-gray-800">Oct 12, 2023</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-0.5">{t("endDate")}</p>
                      <p className="text-sm font-semibold text-gray-800">Oct 17, 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-5 mb-5">
              <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest mb-4">{t("paymentSummary")}</p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t("rental5DaysShort")}</span>
                  <span>₹4,000</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{t("securityDeposit")}</span>
                  <span>₹2,000</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-sm font-bold text-gray-900">{t("amountPaid")}</span>
                  <span className="text-base font-bold text-gray-900">₹6,000</span>
                </div>
              </div>
            </div>

            <div className="flex gap-8 px-1">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest mb-1">{t("transactionId")}</p>
                <p className="text-sm font-semibold text-gray-700">FE-982341</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-widest mb-1">{t("deliveryMode")}</p>
                <div className="flex items-center gap-1">
                  <span className="text-sm">🧍</span>
                  <p className="text-sm font-semibold text-gray-700">{t("selfPickup")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-72 shrink-0 flex flex-col gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{t("pickupInfo")}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t("pickupInfoDetail")}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-4">
              <div className="flex gap-3">
                <svg className="w-5 h-5 text-gray-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                </svg>
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">{t("bookingStatus")}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{t("bookingStatusDetail")}</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/my-bookings")}
              className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-4 rounded-xl text-sm transition-colors duration-200"
            >
              {t("viewMyBookings")}
            </button>

            <button
              onClick={() => navigate("/marketplace")}
              className="w-full text-sm text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors text-center"
            >
              {t("backToMarketplace")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
