import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext"; // adjust path as needed

const initialNotifications = [
  {
    id: 1,
    titleKey: "notifBookingAcceptedTitle",
    messageKey: "notifBookingAcceptedMsg",
    time: "2 days ago",
    type: "success",
    isRead: false,
    actionUrl: "/my-bookings",
  },
  {
    id: 2,
    titleKey: "notifRentalRequestTitle",
    messageKey: "notifRentalRequestMsg",
    time: "3 days ago",
    type: "request",
    isRead: false,
    actionUrl: "/requests",
  },
  {
    id: 3,
    titleKey: "notifPendingApprovalTitle",
    messageKey: "notifPendingApprovalMsg",
    time: "Tuesday, 10:00 AM",
    type: "warning",
    isRead: true,
    actionUrl: "/my-bookings",
  },
  {
    id: 4,
    titleKey: "notifCompletedTitle",
    messageKey: "notifCompletedMsg",
    time: "2 days ago",
    type: "info",
    isRead: false,
    actionUrl: "/my-bookings",
  },
  {
    id: 5,
    titleKey: "notifNewEquipmentTitle",
    messageKey: "notifNewEquipmentMsg",
    time: "3 days ago",
    type: "info",
    isRead: false,
    actionUrl: "/equipment",
  },
  {
    id: 6,
    titleKey: "notifBookingCancelledTitle",
    messageKey: "notifBookingCancelledMsg",
    time: "1 week ago",
    type: "error",
    isRead: true,
    actionUrl: "/my-bookings",
  },
  {
    id: 7,
    titleKey: "notifRequestAcceptedTitle",
    messageKey: "notifRequestAcceptedMsg",
    time: "1 week ago",
    type: "success",
    isRead: true,
    actionUrl: "/my-bookings",
  },
  {
    id: 8,
    titleKey: "notifLocalAdditionsTitle",
    messageKey: "notifLocalAdditionsMsg",
    time: "2 weeks ago",
    type: "info",
    isRead: true,
    actionUrl: "/equipment",
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();
  const { t } = useLanguage();

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif) => {
    if (!notif.isRead) markAsRead(notif.id);
    navigate(notif.actionUrl);
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "read") return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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

  return (
    <div
      className="min-h-screen bg-gray-100 flex w-full"
      style={{ maxWidth: "100vw", overflowX: "hidden" }}
    >
      <Sidebar />

      <div className="flex-1 py-6 px-4 sm:px-8" style={{ marginLeft: "76px" }}>

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-green-900 mb-2">
            {t("notifications")}
          </h1>
          <p className="text-gray-600 border-l-4 border-green-500 pl-3">
            {t("notificationsSubtitle")}
          </p>
        </div>

        {/* TOOLBAR */}
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <div className="flex gap-2 flex-wrap">
            {["all", "unread", "read"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-full text-sm border transition ${
                  filter === type
                    ? "bg-green-900 text-white border-green-900"
                    : "bg-white border-gray-300"
                }`}
              >
                {type === "all"    && `${t("filterAll")} (${notifications.length})`}
                {type === "unread" && `${t("filterUnread")} (${unreadCount})`}
                {type === "read"   && `${t("filterRead")} (${notifications.length - unreadCount})`}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-1.5 rounded-full text-sm bg-gray-100 border border-gray-300 hover:bg-gray-200"
            >
              {t("markAllAsRead")}
            </button>
          )}
        </div>

        {/* LIST */}
        <div className="flex flex-col gap-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {t("noNotifications")}
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex gap-4 p-4 rounded-xl shadow-sm border-l-4 cursor-pointer transition hover:-translate-y-1 hover:shadow-md
                  ${getBorderColor(notif.type)}
                  ${notif.isRead ? "opacity-70 bg-white" : "bg-yellow-50"}`}
              >
                {/* ICON */}
                <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full bg-gray-100 text-xl">
                  {getIcon(notif.type)}
                </div>

                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-green-900">
                    {t(notif.titleKey)}
                  </div>
                  <div className="text-sm text-gray-700">
                    {t(notif.messageKey)}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {notif.time}
                  </div>
                </div>

                {/* UNREAD DOT */}
                {!notif.isRead && (
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