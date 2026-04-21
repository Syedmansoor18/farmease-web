import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiSearch,
  FiPlus,
  FiBell,
  FiUser,
} from "react-icons/fi";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { icon: <FiHome />, path: "/" },
    { icon: <FiSearch />, path: "/equipments" },
    { icon: <FiPlus />, path: "/add" },
    { icon: <FiBell />, path: "/notifications" },
    { icon: <FiUser />, path: "/login" },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-white shadow-sm flex flex-col items-center justify-center z-50">

      {/* Logo / Space */}
      

      {/* Menu */}
      <div className="flex flex-col gap-6">
        {menu.map((item, i) => {
          const isActive = location.pathname === item.path;

          return (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className={`relative p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-green-100 text-green-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <span className="text-xl">{item.icon}</span>

              {/* Active Indicator Line */}
              {isActive && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-6 bg-green-600 rounded-r"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;