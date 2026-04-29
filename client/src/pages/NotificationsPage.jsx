import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../components/Sidebar.jsx";

const initialNotifications = [
  {
    id: 1,
    title: 'Booking Accepted',
    message: 'Your booking for John Deere 6070E Tractor has been accepted!',
    time: '2 days ago',
    type: 'success',
    isRead: false,
    actionUrl: '/my-bookings',
  },
  {
    id: 2,
    title: 'Rental Request',
    message: 'Rahul Deshmukh requested to rent your Wal-Mart Pump 5 HP.',
    time: '3 days ago',
    type: 'request',
    isRead: false,
    actionUrl: '/requests',
  },
  {
    id: 3,
    title: 'Pending Approval',
    message: 'Your booking request for Harvesting Machine is pending approval.',
    time: 'Tuesday, 10:00 AM',
    type: 'warning',
    isRead: true,
    actionUrl: '/my-bookings',
  },
  {
    id: 4,
    title: 'Completed',
    message: 'Your booking for Water Pump 6 HP has been completed.',
    time: '2 days ago',
    type: 'info',
    isRead: false,
    actionUrl: '/my-bookings',
  },
  {
    id: 5,
    title: 'New Equipment Available',
    message: 'New Combine Harvester is available near you in Satara.',
    time: '3 days ago',
    type: 'info',
    isRead: false,
    actionUrl: '/equipment',
  },
  {
    id: 6,
    title: 'Booking Cancelled',
    message: 'Your booking for Rotavator has been cancelled.',
    time: '1 week ago',
    type: 'error',
    isRead: true,
    actionUrl: '/my-bookings',
  },
  {
    id: 7,
    title: 'Request Accepted',
    message: 'Vilas Shinde accepted your booking request for Seed Drill Machine.',
    time: '1 week ago',
    type: 'success',
    isRead: true,
    actionUrl: '/my-bookings',
  },
  {
    id: 8,
    title: 'Local Additions',
    message: 'New Rotavators added in your area. Check them out!',
    time: '2 weeks ago',
    type: 'info',
    isRead: true,
    actionUrl: '/equipment',
  },
];

const ICONS = {
  success: '✓',
  request: '📞',
  warning: '⏳',
  error:   '✗',
  info:    'ℹ',
};

const TYPE_COLORS = {
  success: '#2e7d32',
  request: '#ff9800',
  warning: '#ffc107',
  error:   '#d32f2f',
  info:    '#2196f3',
};

function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const markAsRead = (id) =>
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );

  const markAllAsRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

  const handleClick = (notif) => {
    if (!notif.isRead) markAsRead(notif.id);
    navigate(notif.actionUrl);
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read')   return  n.isRead;
    return true;
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

        .np-page {
          display: flex;
          min-height: 100vh;
          background: #F4F7F5;
          font-family: 'DM Sans', sans-serif;
        }

        .np-wrap {
          flex: 1;
          margin-left: 80px;
          padding: 32px 40px;
          background: #F4F7F5;
          color: #1a2e1d;
          overflow-y: auto;
        }

        .np-header { margin-bottom: 28px; }
        .np-header h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0 0 6px;
          color: #2c3e2f;
        }
        .np-subtitle {
          color: #666;
          font-size: 14px;
          margin: 0;
          border-left: 3px solid #4caf50;
          padding-left: 10px;
        }

        .np-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 24px;
        }
        .np-filters { display: flex; gap: 8px; flex-wrap: wrap; }
        .np-filter-btn {
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #ddd;
          background: white;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: all 0.18s;
          color: #444;
        }
        .np-filter-btn:hover { border-color: #4caf50; color: #2c3e2f; }
        .np-filter-btn.active {
          background: #2c3e2f;
          color: white;
          border-color: #2c3e2f;
        }
        .np-mark-all {
          padding: 6px 16px;
          border-radius: 20px;
          border: 1px solid #ccc;
          background: #f5f5f5;
          cursor: pointer;
          font-size: 13px;
          font-family: 'DM Sans', sans-serif;
          font-weight: 500;
          transition: background 0.18s;
          color: #444;
        }
        .np-mark-all:hover { background: #e0e0e0; }

        .np-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .np-card {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          background: white;
          border-radius: 14px;
          padding: 16px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          border-left: 4px solid;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.2s;
          position: relative;
        }
        .np-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0,0,0,0.1);
        }
        .np-card.unread { background: #fef9e6; }
        .np-card.read   { opacity: 0.82; }

        .np-icon {
          min-width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
        }

        .np-body   { flex: 1; min-width: 0; }
        .np-title  { font-weight: 600; font-size: 15px; margin-bottom: 3px; color: #1a2e1d; }
        .np-msg    { font-size: 13px; color: #555; margin-bottom: 5px; line-height: 1.45; }
        .np-time   { font-size: 12px; color: #999; }

        .np-dot {
          width: 9px;
          height: 9px;
          background: #4caf50;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 6px;
        }

        .np-empty {
          text-align: center;
          padding: 56px 20px;
          color: #aaa;
          font-size: 15px;
        }

        @media (max-width: 600px) {
          .np-wrap { margin-left: 0; padding: 16px 12px; }
          .np-card { padding: 12px; }
          .np-icon { min-width: 32px; height: 32px; font-size: 15px; }
          .np-header h1 { font-size: 22px; }
        }
      `}</style>

      {/* ✅ FIX: Sidebar is OUTSIDE np-wrap, both sit side by side in np-page */}
<div className="np-page">
        <Sidebar />

        <div className="np-wrap">
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>

            {/* Header */}
            <div className="np-header">
              <h1>Notifications</h1>
              <p className="np-subtitle">
                Stay updated with your bookings, requests, and new equipment.
              </p>
            </div>

            {/* Toolbar */}
            <div className="np-toolbar">
              <div className="np-filters">
                {[
                  { key: 'all',    label: `All (${notifications.length})` },
                  { key: 'unread', label: `Unread (${unreadCount})` },
                  { key: 'read',   label: `Read (${notifications.length - unreadCount})` },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    className={`np-filter-btn${filter === key ? ' active' : ''}`}
                    onClick={() => setFilter(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {unreadCount > 0 && (
                <button className="np-mark-all" onClick={markAllAsRead}>
                  Mark all as read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="np-list">
              {filtered.length === 0 ? (
                <div className="np-empty">No notifications to show.</div>
              ) : (
                filtered.map(notif => (
                  <div
                    key={notif.id}
                    className={`np-card ${notif.isRead ? 'read' : 'unread'}`}
                    style={{ borderLeftColor: TYPE_COLORS[notif.type] }}
                    onClick={() => handleClick(notif)}
                  >
                    <div
                      className="np-icon"
                      style={{ background: TYPE_COLORS[notif.type] + '18' }}
                    >
                      {ICONS[notif.type]}
                    </div>

                    <div className="np-body">
                      <div className="np-title">{notif.title}</div>
                      <div className="np-msg">{notif.message}</div>
                      <div className="np-time">{notif.time}</div>
                    </div>

                    {!notif.isRead && <div className="np-dot" />}
                  </div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default NotificationsPage;