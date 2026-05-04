import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext";
import { supabase } from "../supabaseClient";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    // 1. Check if Supabase triggered a secure password recovery session
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryFlow(true);
      }
    });

    // 2. Ensure a real user is actually here
    const verifyUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      // If there is no user session AT ALL (they aren't logged in, and didn't click an email link)
      // Boot them out immediately. No peeking at the Sidebar.
      if (!user) {
        navigate("/");
        return;
      }

      setUserEmail(user.email);

      // Check URL hash fallback for recovery
      if (window.location.hash.includes("type=recovery")) {
        setIsRecoveryFlow(true);
      }

      setIsCheckingAuth(false);
    };

    verifyUser();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!formData.newPassword || !formData.confirmPassword) {
      setErrorMsg("Please fill in all new password fields.");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("New passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      // If they are logged in normally (from Profile), they MUST prove they know the old password
      if (!isRecoveryFlow) {
        if (!formData.currentPassword) {
          setErrorMsg("Please enter your current password to authorize this change.");
          setIsLoading(false);
          return;
        }

        // Verify the old password against Supabase
        const { error: verifyError } = await supabase.auth.signInWithPassword({
          email: userEmail,
          password: formData.currentPassword,
        });

        if (verifyError) {
          setErrorMsg("Incorrect current password. Please try again.");
          setIsLoading(false);
          return;
        }
      }

      // 🚨 REAL SECURE DATABASE UPDATE
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (updateError) throw updateError;

      setSuccessMsg("Password securely changed! Redirecting to login...");

      // Log out all sessions and redirect to login
      setTimeout(async () => {
        await supabase.auth.signOut();
        navigate("/");
      }, 2000);

    } catch (error) {
      console.error("Error updating password:", error);
      setErrorMsg(error.message || "Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent rendering the page with the Sidebar until we confirm they belong here
  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading security check...</div>;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      {/* Sidebar is only visible because verifyUser() confirmed they have a session */}
      <Sidebar />

      <div className="flex-1 py-8 px-4 sm:px-8 ml-0 md:ml-12 overflow-x-hidden flex flex-col items-center">

        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-6">
            {!isRecoveryFlow && (
              <button
                onClick={() => navigate("/profile")}
                className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-100 cursor-pointer border-none"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">
              {isRecoveryFlow ? "Reset Password" : "Change Password"}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">

            {errorMsg && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-6 border border-red-100 font-medium">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="bg-green-50 text-green-700 text-sm p-3 rounded-lg mb-6 border border-green-100 font-medium text-center">
                {successMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Only ask for Current Password if they came from the Profile page */}
              {!isRecoveryFlow && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Enter current password"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading || successMsg}
                  className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? "Updating Database..." : "Update Password"}
                </button>
              </div>

            </form>

            {!isRecoveryFlow && (
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => {
                    supabase.auth.signOut().then(() => {
                      navigate("/forgot-password");
                    });
                  }}
                  className="text-sm text-green-700 font-medium hover:underline bg-transparent border-none cursor-pointer"
                >
                  Forgot your password?
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}