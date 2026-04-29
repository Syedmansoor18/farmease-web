import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
export default function PaymentPage() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [deliveryMode, setDeliveryMode] = useState("self");
  const [showPopup, setShowPopup] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useLanguage();

  const handlePayment = () => {
    setShowPopup(true);
    setProgress(0);
    setIsSuccess(false);

    let value = 0;

    const interval = setInterval(() => {
      value += 10;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSuccess(true);
          setTimeout(() => {
            navigate("/booking-success");
          }, 2000);
        }, 300);
      }
    }, 200);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 px-12 py-5 font-sans text-gray-800">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4">
          <span
            className="cursor-pointer hover:underline text-gray-700"
            onClick={() => navigate("/marketplace")}
          >
            &gt; {t("marketplace")}
          </span>
          <span className="mx-1">&gt;</span>
          <span
            className="cursor-pointer hover:underline text-gray-700"
            onClick={() => navigate("/equipment-detail")}
          >
            Mahindra NOVO 605 DI
          </span>
          <span className="mx-1">&gt;</span>
          <span className="text-blue-600">{t("payment")}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
          {t("confirmAndPay")}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT — Rental Summary */}
          <div className="w-full md:w-72 shrink-0">
            <div className="border border-gray-200 rounded-xl overflow-hidden">

              <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <span className="text-lg">🚜</span>
                <span className="font-semibold text-sm">{t("rentalSummary")}</span>
              </div>

              <img src="/T1.jpeg" alt="Tractor" className="w-full h-44 object-cover" />

              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="font-bold text-base text-gray-900">Mahindra Novo 605 DI</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#6b7280" className="mr-1">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Tumkur, Karnataka
                </div>
              </div>

              <div className="px-4 py-3 flex gap-6 border-b border-gray-200 bg-gray-50">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">{t("startDate")}</p>
                  <p className="text-sm font-semibold">Oct 12, 2023</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">{t("endDate")}</p>
                  <p className="text-sm font-semibold">Oct 17, 2023</p>
                </div>
              </div>

              <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-500">{t("dailyRentalRate")}</span>
                <span className="text-sm font-bold text-green-700">₹800 / {t("day")}</span>
              </div>

              <div className="px-4 py-3 bg-green-50">
                <p className="text-sm font-semibold text-gray-700 mb-2">{t("selectDeliveryMode")}</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="self"
                      checked={deliveryMode === "self"}
                      onChange={() => setDeliveryMode("self")}
                      className="accent-green-600"
                    />
                    {t("selfPickup")}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="partner"
                      checked={deliveryMode === "partner"}
                      onChange={() => setDeliveryMode("partner")}
                      className="accent-green-600"
                    />
                    {t("deliveryPartners")}
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Payment Details */}
          <div className="flex-1">
            <h2 className="text-base font-bold text-gray-900 mb-4">{t("paymentDetails")}</h2>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>{t("rental5Days")}</span>
                <span>₹4,000</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  {t("securityDeposit")}
                  <span className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-xs flex items-center justify-center cursor-pointer">i</span>
                </span>
                <span>₹2,000</span>
              </div>
            </div>

            <div className="border-t border-gray-200 my-4" />

            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">{t("totalAmount")}</p>
                <p className="text-3xl font-bold text-gray-900">₹6,000</p>
              </div>
              <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {t("includesGST")}
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3">{t("selectPaymentMethod")}</p>

            <div className="space-y-3 mb-8">

              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "upi" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}>
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-base">🟢</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{t("upiLabel")}</p>
                  <p className="text-xs text-gray-400">{t("upiSub")}</p>
                </div>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} className="accent-green-600 w-4 h-4" />
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "card" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">💳</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{t("cardLabel")}</p>
                  <p className="text-xs text-gray-400">{t("cardSub")}</p>
                </div>
                <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-green-600 w-4 h-4" />
              </label>

              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "netbanking" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}>
                <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center text-base">🏦</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{t("netBankingLabel")}</p>
                  <p className="text-xs text-gray-400">{t("netBankingSub")}</p>
                </div>
                <input type="radio" name="payment" value="netbanking" checked={paymentMethod === "netbanking"} onChange={() => setPaymentMethod("netbanking")} className="accent-green-600 w-4 h-4" />
              </label>

            </div>

            <button
              onClick={handlePayment}
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl text-base transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2"
            >
             {t("pay")}
            </button>

            {showPopup && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-[320px] text-center shadow-xl">
                  {!isSuccess ? (
                    <>
                      <h2 className="text-lg font-semibold mb-3">{t("transactionInProgress")}</h2>
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div className="bg-green-600 h-3 rounded-full transition-all duration-200" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-sm text-gray-500">{t("processingPayment")}</p>
                    </>
                  ) : (
                    <>
                      <div className="text-green-600 text-3xl mb-2">✔</div>
                      <h2 className="font-semibold text-green-600">{t("paymentSuccessful")}</h2>
                      <p className="text-sm text-gray-500">{t("redirecting")}</p>
                    </>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
