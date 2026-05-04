import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { supabase } from "../supabaseClient";

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    location: "",
    aadhaarNumber: "",
    kisanId: "",
    aadhaarVerified: false,
    kisanVerified: false,
  });

  const [loading, setLoading] = useState(false);
  const [verifyingAadhaar, setVerifyingAadhaar] = useState(false);
  const [verifyingKisan, setVerifyingKisan] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      // 🚨 DYNAMIC FIX 1: Check if we already saved a profile previously
      const savedProfile = JSON.parse(localStorage.getItem("userProfile"));

      if (savedProfile) {
        setFormData(savedProfile); // Load the saved data!
      } else {
        // Fallback to basic Supabase auth info if nothing is saved yet
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setFormData(prev => ({
            ...prev,
            fullName: user.user_metadata?.full_name || "",
            phone: user.phone || "",
          }));
        }
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🚨 DYNAMIC FIX 2: Save the verified status and name to localStorage
    localStorage.setItem("userProfile", JSON.stringify(formData));

    setTimeout(() => {
      setLoading(false);
      navigate("/profile");
    }, 1000);
  };

  const handleVerifyAadhaar = () => {
    if (formData.aadhaarNumber.length !== 12) {
      alert("Aadhaar must be exactly 12 digits.");
      return;
    }
    setVerifyingAadhaar(true);
    setTimeout(() => {
      setVerifyingAadhaar(false);
      setFormData(prev => ({ ...prev, aadhaarVerified: true }));
    }, 1500);
  };

  const handleVerifyKisan = () => {
    if (!formData.kisanId) {
      alert("Please enter a valid Kisan ID.");
      return;
    }
    setVerifyingKisan(true);
    setTimeout(() => {
      setVerifyingKisan(false);
      setFormData(prev => ({ ...prev, kisanVerified: true }));
    }, 1500);
  };

  const maskAadhaar = (aadhaarStr) => {
    if (!aadhaarStr || aadhaarStr.length < 4) return "Not Provided";
    const lastFour = aadhaarStr.slice(-4);
    return `XXXX-XXXX-${lastFour}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex w-full" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar />
      <div className="flex-1 py-6 px-4 md:px-8 ml-0 md:ml-12 overflow-x-hidden">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/profile")} className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 cursor-pointer">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
          <form onSubmit={handleSave} className="space-y-6">

            <div>
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">Personal Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Enter your full name" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">Phone Number</label>
                  <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none" placeholder="Enter your phone number" />
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-800 border-b pb-2 mb-4">Identity Verification</h3>
              <div className="space-y-4">

                {/* Aadhaar Block */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-500">Aadhaar Number</label>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${formData.aadhaarVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {formData.aadhaarVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  {formData.aadhaarVerified ? (
                    <p className="text-sm font-bold text-gray-800 tracking-wider">{maskAadhaar(formData.aadhaarNumber)}</p>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} maxLength="12" className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none tracking-widest font-mono" placeholder="1234 5678 9012" />
                      <button type="button" onClick={handleVerifyAadhaar} disabled={verifyingAadhaar || formData.aadhaarNumber.length < 12} className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white text-xs font-bold px-4 rounded-lg transition-colors cursor-pointer">
                        {verifyingAadhaar ? "Verifying..." : "Verify Now"}
                      </button>
                    </div>
                  )}
                </div>

                {/* Kisan ID Block */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-gray-500">Kisan ID</label>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${formData.kisanVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {formData.kisanVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  {formData.kisanVerified ? (
                    <p className="text-sm font-bold text-gray-800 uppercase">{formData.kisanId}</p>
                  ) : (
                    <div className="flex gap-2">
                      <input type="text" name="kisanId" value={formData.kisanId} onChange={handleChange} className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 outline-none uppercase font-mono" placeholder="KISAN-XXXXXX" />
                      <button type="button" onClick={handleVerifyKisan} disabled={verifyingKisan || formData.kisanId.length < 5} className="bg-green-700 hover:bg-green-800 disabled:bg-gray-400 text-white text-xs font-bold px-4 rounded-lg transition-colors cursor-pointer">
                        {verifyingKisan ? "Verifying..." : "Verify Now"}
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-gray-400 italic mt-2">
                  * Identity details cannot be changed manually once verified.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button type="submit" disabled={loading} className="w-full bg-green-700 text-white font-bold py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer">
                {loading ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}