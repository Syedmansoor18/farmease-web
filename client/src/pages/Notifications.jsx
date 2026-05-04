import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
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

      // 2. Subscribe to Live Changes (Real-Time Magic!)
      subscription = supabase
        .channel("realtime-notifications")
        .on(
          "postgres_changes",
          {
            event: "*", // Listen for INSERT, UPDATE, and DELETE
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

    // Cleanup subscription when leaving the page
    return () => {
      if (subscription) supabase.removeChannel(subscription);
    };
  }, []);

  // 🚨 UPDATE DATABASE WHEN NOTIFICATION IS CLICKED
  const markAsRead = async (id) => {
    // Instantly update UI
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );

    // Update Supabase in background
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
  };

  const markAllAsRead = async () => {
    if (!userId) return;

    // Instantly update UI
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));

    // Update all unread in Supabase
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
    <div className="min-h-screen bg-gray-100 flex w-full" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar />

      <div className="flex-1 py-6 px-4 sm:px-8" style={{ marginLeft: "76px" }}>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-900 mb-2">
            {t("notifications")}
          </h1>
          <p className="text-gray-600 border-l-4 border-green-500 pl-3">
            {t("notificationsSubtitle") || "Stay updated with your bookings and requests."}
          </p>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["all", "unread", "read"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm border transition cursor-pointer ${
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
              className="px-4 py-1.5 rounded-full text-sm bg-gray-100 border border-gray-300 hover:bg-gray-200 cursor-pointer"
            >
              {t("markAllAsRead") || "Mark all as read"}
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {isLoading ? (
             <div className="text-center py-12 text-green-700 font-bold">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {t("noNotifications") || "No notifications to show."}
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex gap-4 p-4 rounded-xl shadow-sm border-l-4 cursor-pointer transition hover:-translate-y-1 hover:shadow-md
                  ${getBorderColor(notif.type)}
                  ${notif.is_read ? "opacity-70 bg-white" : "bg-yellow-50"}`}
              >
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 text-xl">
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-green-900">
                    {notif.title}
                  </div>
                  <div className="text-sm text-gray-700">
                    {notif.message}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {formatTime(notif.created_at)}
                  </div>
                </div>

                {!notif.is_read && (
                  <div className="w-2.5 h-2.5 flex-shrink-0 bg-green-500 rounded-full mt-2" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}