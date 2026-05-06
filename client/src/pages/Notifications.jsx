import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext";
import { supabase } from "../supabaseClient";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { t } = useLanguage();

  // 🚨 SUPABASE REAL-TIME FETCH & SUBSCRIBE
  useEffect(() => {
    let subscription;

    const fetchNotifications = async () => {
      setIsLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }
      setUserId(user.id);

      // 1. Initial Fetch from your database
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotifications(data);
      }
      setIsLoading(false);

      // 2. Subscribe to Live Changes
      subscription = supabase
        .channel("realtime-notifications")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setNotifications((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setNotifications((prev) =>
                prev.map((n) => (n.id === payload.new.id ? payload.new : n))
              );
            } else if (payload.eventType === "DELETE") {
              setNotifications((prev) =>
                prev.filter((n) => n.id !== payload.old.id)
              );
            }
          }
        )
        .subscribe();
    };

    fetchNotifications();

    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  // 🚨 ESCROW ACTION: ACCEPT BOOKING
  const handleAccept = async (e, notification) => {
    e.stopPropagation();

    try {
      const targetBookingId = notification.booking_id || notification.bookingId;
      if (!targetBookingId || targetBookingId === "undefined") {
        throw new Error("Booking ID missing. This might be an old test record.");
      }

      // 1. Instantly update UI for snappy UX
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, is_read: true, type: 'success', message: 'You have accepted this rental request. The escrow is locked.' }
            : n
        )
      );

      // 2. Update Bookings Database
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'accepted' })
        .eq('id', targetBookingId);

      if (bookingError) throw bookingError;

      // 3. Update Notifications Database
      await supabase
        .from('notifications')
        .update({
          type: 'success',
          message: 'You have accepted this rental request. The escrow is locked.',
          is_read: true
        })
        .eq('id', notification.id);

      alert("✅ Request Accepted! Escrow locked.");
    } catch (err) {
      console.error("Accept Error:", err);
      alert("Failed to update: " + err.message);
    }
  };

  // 🚨 ESCROW ACTION: REJECT BOOKING
  const handleReject = async (e, notification) => {
    e.stopPropagation();

    try {
      const targetBookingId = notification.booking_id || notification.bookingId;
      if (!targetBookingId || targetBookingId === "undefined") {
        throw new Error("Booking ID missing. This might be an old test record.");
      }

      // 1. Instantly update UI for snappy UX
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id
            ? { ...n, is_read: true, type: 'error', message: 'You rejected this rental request. The deposit hold will be released.' }
            : n
        )
      );

      // 2. Update Bookings Database (FIXED to say 'rejected')
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'rejected' })
        .eq('id', targetBookingId);

      if (bookingError) throw bookingError;

      // 3. Update Notifications Database
      await supabase
        .from('notifications')
        .update({
          type: 'error',
          message: 'You rejected this rental request. The deposit hold will be released.',
          is_read: true
        })
        .eq('id', notification.id);

      alert("❌ Request Rejected.");
    } catch (err) {
      console.error("Reject Error:", err);
      alert("Failed to update: " + err.message);
    }
  };

  const markAsRead = async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  const markAllAsRead = async () => {
    if (!userId) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
  };

  const handleNotificationClick = (notif) => {
    if (!notif.is_read) markAsRead(notif.id);
    if (notif.action_url) navigate(notif.action_url);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.is_read;
    if (filter === "read") return n.is_read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const getBorderColor = (type) => {
    switch (type) {
      case "success": return "border-green-700";
      case "request": return "border-orange-500";
      case "warning": return "border-yellow-400";
      case "error":   return "border-red-600";
      default:        return "border-blue-500";
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "success": return "✓";
      case "request": return "📞";
      case "warning": return "⏳";
      case "error":   return "✗";
      default:        return "ℹ";
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "Just now";
    const date = new Date(timeString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex max-w-[100vw] overflow-hidden">
      <Sidebar />

      <div className="flex-1 py-6 px-4 sm:px-8 ml-0 md:ml-[76px] pb-28 md:pb-8 overflow-y-auto w-full">

        <div className="mb-6 mt-2 md:mt-0">
          <h1 className="text-2xl font-bold text-green-900 mb-2">
            {t("notifications")}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 border-l-4 border-green-500 pl-3">
            {t("notificationsSubtitle") || "Stay updated with your bookings and requests."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2 flex-wrap w-full sm:w-auto">
            {["all", "unread", "read"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`flex-1 sm:flex-none px-4 py-2 sm:py-1.5 rounded-full text-sm border transition cursor-pointer text-center ${
                  filter === type
                    ? "bg-green-900 text-white border-green-900"
                    : "bg-white border-gray-300 hover:bg-gray-50"
                }`}
              >
                {type === "all"    && `${t("filterAll") || "All"} (${notifications.length})`}
                {type === "unread" && `${t("filterUnread") || "Unread"} (${unreadCount})`}
                {type === "read"   && `${t("filterRead") || "Read"} (${notifications.length - unreadCount})`}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="w-full sm:w-auto px-4 py-2 sm:py-1.5 rounded-full text-sm bg-gray-100 border border-gray-300 hover:bg-gray-200 cursor-pointer text-center"
            >
              {t("markAllAsRead") || "Mark all as read"}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
             <div className="text-center py-12 text-green-700 font-bold">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm sm:text-base">
              {t("noNotifications") || "No notifications to show."}
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex flex-col gap-3 p-3 sm:p-4 rounded-xl shadow-sm border-l-4 cursor-pointer transition hover:-translate-y-1 hover:shadow-md
                  ${getBorderColor(notif.type)}
                  ${notif.is_read ? "opacity-70 bg-white" : "bg-yellow-50"}`}
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 text-xl">
                    {getIcon(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-green-900 text-sm sm:text-base break-words">
                      {notif.title}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-700 break-words mt-0.5">
                      {notif.message}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1.5">
                      {formatTime(notif.created_at)}
                    </div>
                  </div>

                  {!notif.is_read && (
                    <div className="w-2.5 h-2.5 flex-shrink-0 bg-green-500 rounded-full mt-2" />
                  )}
                </div>

                {/* 🚨 INTERACTIVE BUTTONS FOR REQUESTS (Hidden if already read/acted upon) */}
                {notif.type === "request" && !notif.is_read && (
                  <div className="flex flex-row gap-2 mt-2 ml-13 sm:ml-14">
                    <button
                      onClick={(e) => handleAccept(e, notif)}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition-colors shadow-sm cursor-pointer"
                    >
                      Accept
                    </button>
                    <button
                      onClick={(e) => handleReject(e, notif)}
                      className="flex-1 bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm font-bold border border-red-100 hover:bg-red-100 transition-colors cursor-pointer"
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}