import { useState } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient"

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [deliveryMode, setDeliveryMode] = useState("self");
  const [showPopup, setShowPopup] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const equipment = location.state?.equipment;

  if (!equipment) {
    return <Navigate to="/marketplace" />;
  }

  // 1. DETERMINE INTENT (Rent vs Sell)
  const descMatch = equipment.description?.match(/Listing Intent: (.*)/);
  const listingIntent = descMatch ? descMatch[1].trim().toLowerCase() : "rent";
  const isSelling = listingIntent === "sell";

  // 2. DYNAMIC MATH LOGIC
  const basePrice = equipment.price_per_day || equipment.price || 0; 
  const rentalDays = 5; 
  
  let rentalCost = 0;
  let securityDeposit = 0;
  let totalAmount = 0;

  if (isSelling) {
    totalAmount = basePrice;
  } else {
    rentalCost = basePrice * rentalDays;
    securityDeposit = basePrice * 2;
    totalAmount = rentalCost + securityDeposit;
  }

  const equipmentImage = equipment.image || equipment.image_url || "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=400&q=80";

  // 3. RAZORPAY SCRIPT LOADER
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // 4. THE LIVE PAYMENT HANDLER
  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, 
      amount: totalAmount * 100, 
      currency: "INR",
      name: "FarmEase",
      description: isSelling ? `Purchase: ${equipment.name}` : `Rental: ${equipment.name} (${rentalDays} Days)`,
      image: "https://images.unsplash.com/photo-1592982537447-6f23b361bbcc?w=100&q=80", 
      handler: async function (response) {
        
        setShowPopup(true);
        setIsSuccess(true);
        
        // 🚨 NEW: API CALL TO SAVE BOOKING TO YOUR SERVER FOLDER
        try {
          const { data: { user } } = await supabase.auth.getUser();

          await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user?.id,
              equipmentId: equipment.id || equipment._id,
              equipmentName: equipment.name,
              totalAmount: totalAmount,
              rentalDays: rentalDays,
              isSelling: isSelling,
              transactionId: response.razorpay_payment_id,
              deliveryMode: deliveryMode,
              imageUrl: equipmentImage,
              status: isSelling ? "buyout" : "rented"
            })
          });
        } catch (error) {
          console.error("Failed to save booking to database:", error);
        }

        setTimeout(() => {
          navigate("/booking-success", {
            state: {
              equipment,
              totalAmount,
              rentalCost,
              securityDeposit,
              rentalDays,
              isSelling,
              deliveryMode,
              transactionId: response.razorpay_payment_id 
            }
          });
        }, 2000);
      },
      prefill: {
        name: "FarmEase User",
        email: "user@farmease.com",
        contact: "9876543210" 
      },
      theme: {
        color: "#15803d" 
      }
    };

    const paymentObject = new window.Razorpay(options);
    
    paymentObject.on('payment.failed', function (response){
      alert(`Payment Failed! Reason: ${response.error.description}`);
    });

    paymentObject.open();
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-0 md:ml-20 px-4 md:px-12 py-5 font-sans text-gray-800 overflow-y-auto">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-4 flex flex-wrap items-center gap-1">
          <span className="cursor-pointer hover:underline text-gray-700" onClick={() => navigate("/marketplace")}>
            {t("marketplace")}
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="cursor-pointer hover:underline text-gray-700 capitalize" onClick={() => navigate("/equipment-detail", { state: { equipment } })}>
            {equipment.name}
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-blue-600">{t("payment")}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
          {t("confirmAndPay")}
        </h1>

        <div className="flex flex-col md:flex-row gap-8">

          {/* LEFT — Order Summary */}
          <div className="w-full md:w-80 shrink-0">
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

              <div className="px-4 py-3 flex items-center gap-2 border-b border-gray-200 bg-gray-50">
                <span className="text-lg">🚜</span>
                <span className="font-semibold text-sm">
                  {isSelling ? t("purchaseSummary") || "Purchase Summary" : t("rentalSummary")}
                </span>
              </div>

              <img src={equipmentImage} alt={equipment.name} className="w-full h-44 object-cover" />

              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="font-bold text-base text-gray-900 capitalize">{equipment.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1 capitalize">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="#6b7280" className="mr-1 shrink-0">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  {equipment.location || equipment.district}, {equipment.state || ""}
                </div>
              </div>

              {/* Conditional Dates based on Rent/Sell */}
              <div className="px-4 py-3 flex gap-6 border-b border-gray-200 bg-gray-50">
                <div>
                  <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">
                    {isSelling ? "Date" : t("startDate")}
                  </p>
                  <p className="text-sm font-semibold">Today</p>
                </div>
                {!isSelling && (
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold tracking-wide mb-1">{t("endDate")}</p>
                    <p className="text-sm font-semibold">+{rentalDays} Days</p>
                  </div>
                )}
              </div>

              <div className="px-4 py-3 flex justify-between items-center border-b border-gray-200">
                <span className="text-sm text-gray-500">
                  {isSelling ? "Selling Price" : t("dailyRentalRate")}
                </span>
                <span className="text-sm font-bold text-green-700">
                  ₹{basePrice.toLocaleString()} {isSelling ? "" : `/ ${t("day")}`}
                </span>
              </div>

              <div className="px-4 py-4 bg-green-50">
                <p className="text-sm font-semibold text-gray-700 mb-3">{t("selectDeliveryMode")}</p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="radio" name="deliveryMode" value="self" checked={deliveryMode === "self"} onChange={() => setDeliveryMode("self")} className="accent-green-600 w-4 h-4" />
                    {t("selfPickup")}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="radio" name="deliveryMode" value="partner" checked={deliveryMode === "partner"} onChange={() => setDeliveryMode("partner")} className="accent-green-600 w-4 h-4" />
                    {t("deliveryPartners")}
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT — Payment Details */}
          <div className="flex-1">
            <h2 className="text-base font-bold text-gray-900 mb-4">{t("paymentDetails")}</h2>

            <div className="space-y-3 mb-4 bg-white p-4 rounded-xl border border-gray-200">
              {isSelling ? (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Equipment Price</span>
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Rental ({rentalDays} Days)</span>
                    <span className="font-medium text-gray-900">₹{rentalCost.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      {t("securityDeposit")}
                      <span className="w-4 h-4 rounded-full border border-gray-400 text-gray-400 text-xs flex items-center justify-center cursor-help" title="Refundable upon safe return">i</span>
                    </span>
                    <span className="font-medium text-gray-900">₹{securityDeposit.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between items-center mb-6 bg-gray-900 text-white p-5 rounded-xl shadow-md">
              <div>
                <p className="text-xs text-gray-300 uppercase font-semibold tracking-wide mb-1">{t("totalAmount")}</p>
                <p className="text-3xl font-bold">₹{totalAmount.toLocaleString()}</p>
              </div>
              <span className="text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full">
                {t("includesGST")}
              </span>
            </div>

            <p className="text-sm font-semibold text-gray-700 mb-3">{t("selectPaymentMethod")}</p>

            <div className="space-y-3 mb-8">
              {/* UPI */}
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "upi" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}>
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-base">🟢</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{t("upiLabel")}</p>
                  <p className="text-xs text-gray-400">{t("upiSub")}</p>
                </div>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === "upi"} onChange={() => setPaymentMethod("upi")} className="accent-green-600 w-4 h-4" />
              </label>

              {/* CARD */}
              <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === "card" ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"}`}>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-base">💳</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{t("cardLabel")}</p>
                  <p className="text-xs text-gray-400">{t("cardSub")}</p>
                </div>
                <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-green-600 w-4 h-4" />
              </label>

              {/* NETBANKING */}
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
              className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-4 rounded-xl text-base transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
             Pay Securely — ₹{totalAmount.toLocaleString()}
            </button>

            {/* Success Popup */}
            {showPopup && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white rounded-2xl p-6 w-[320px] text-center shadow-xl">
                  <div className="text-green-600 text-3xl mb-2">✔</div>
                  <h2 className="font-semibold text-green-600">{t("paymentSuccessful")}</h2>
                  <p className="text-sm text-gray-500">{t("redirecting")}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}