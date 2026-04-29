import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Helper function to check if the icon is for the current page
  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed left-0 top-0 h-screen w-20 bg-white border-r border-gray-100 flex flex-col items-center py-8 space-y-12 z-50">

      {/* Home Icon - Dashboard */}
      <div
  onClick={() => navigate('/home')}
  className={`cursor-pointer transition-all hover:scale-110 ${
    isActive('/home') || isActive('/marketplace')
      ? 'text-[#1A4D2E]'
      : 'text-gray-400 hover:text-[#1A4D2E]'
  }`}
>
  <Home
    size={28}
    strokeWidth={
      isActive('/home') || isActive('/marketplace') ? 3 : 2
    }
  />
</div>

      {/* Search Icon - Dedicated Search Screen */}
      <div
  onClick={() => navigate('/search')}
  className={`cursor-pointer transition-all hover:scale-110 ${
    isActive('/search')
      ? 'text-[#1A4D2E]'
      : 'text-gray-400 hover:text-[#1A4D2E]'
  }`}
>
  <Search
    size={28}
    strokeWidth={isActive('/search') ? 3 : 2}
  />
</div>

      {/* Add Icon - List Equipment */}
      <div
        onClick={() => navigate('/list-equipment')}
        className={`cursor-pointer transition-all hover:scale-110 ${
          isActive('/list-equipment') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'
        }`}
      >
        <PlusCircle size={28} strokeWidth={isActive('/list-equipment') ? 3 : 2} />
      </div>

      {/* Notifications Icon */}
      <div
        onClick={() => navigate('/notifications')}
        className={`cursor-pointer transition-all hover:scale-110 ${
          isActive('/notifications') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'
        }`}
      >
        <Bell size={28} strokeWidth={isActive('/notifications') ? 3 : 2} />
      </div>

      {/* Profile Icon - Pushed to bottom */}
      <div
        onClick={() => navigate('/profile')}
        className={`cursor-pointer transition-all hover:scale-110 mt-auto ${
          isActive('/profile') || 
          isActive('/edit-profile') || 
          isActive('/language') || 
          isActive('/saved-equipment') || 
          isActive('/my-bookings') || 
          isActive('/my-postings')
            ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'
        }`}
      >
        <User size={28} strokeWidth={isActive('/profile') ? 3 : 2} />
      </div>
    </div>
  );
};

export default Sidebar;