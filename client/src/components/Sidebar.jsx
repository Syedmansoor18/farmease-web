import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, Bell, User } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* 📱 MOBILE BOTTOM NAVIGATION (Hidden on Desktop) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex flex-row items-center justify-around py-3 pb-safe z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">

        <div onClick={() => navigate('/home')} className={`cursor-pointer flex flex-col items-center transition-all ${isActive('/home') || isActive('/marketplace') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <Home size={24} strokeWidth={isActive('/home') || isActive('/marketplace') ? 3 : 2} />
        </div>

        <div onClick={() => navigate('/search')} className={`cursor-pointer flex flex-col items-center transition-all ${isActive('/search') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <Search size={24} strokeWidth={isActive('/search') ? 3 : 2} />
        </div>

        <div onClick={() => navigate('/list-equipment')} className={`cursor-pointer flex flex-col items-center transition-all -mt-5 ${isActive('/list-equipment') ? 'text-[#1A4D2E]' : 'text-[#1A4D2E]'}`}>
          <div className="bg-white rounded-full p-1 shadow-md">
            <div className="bg-[#1A4D2E] text-white rounded-full p-2">
              <PlusCircle size={26} strokeWidth={2.5} className="text-white" />
            </div>
          </div>
        </div>

        <div onClick={() => navigate('/notifications')} className={`cursor-pointer flex flex-col items-center transition-all ${isActive('/notifications') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <Bell size={24} strokeWidth={isActive('/notifications') ? 3 : 2} />
        </div>

        <div onClick={() => navigate('/profile')} className={`cursor-pointer flex flex-col items-center transition-all ${isActive('/profile') || isActive('/edit-profile') || isActive('/language') || isActive('/saved-equipment') || isActive('/my-bookings') || isActive('/my-postings') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <User size={24} strokeWidth={isActive('/profile') ? 3 : 2} />
        </div>
      </div>

      {/* 💻 DESKTOP SIDEBAR (Hidden on Mobile) */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-20 bg-white border-r border-gray-100 flex-col items-center py-8 space-y-12 z-50">
        <div onClick={() => navigate('/home')} className={`cursor-pointer transition-all hover:scale-110 ${isActive('/home') || isActive('/marketplace') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <Home size={28} strokeWidth={isActive('/home') || isActive('/marketplace') ? 3 : 2} />
        </div>

        <div onClick={() => navigate('/search')} className={`cursor-pointer transition-all hover:scale-110 ${isActive('/search') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <Search size={28} strokeWidth={isActive('/search') ? 3 : 2} />
        </div>

        <div onClick={() => navigate('/list-equipment')} className={`cursor-pointer transition-all hover:scale-110 ${isActive('/list-equipment') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <PlusCircle size={28} strokeWidth={isActive('/list-equipment') ? 3 : 2} />
        </div>

        <div onClick={() => navigate('/notifications')} className={`cursor-pointer transition-all hover:scale-110 ${isActive('/notifications') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <Bell size={28} strokeWidth={isActive('/notifications') ? 3 : 2} />
        </div>

        <div onClick={() => navigate('/profile')} className={`cursor-pointer transition-all hover:scale-110 mt-auto ${isActive('/profile') || isActive('/edit-profile') || isActive('/language') || isActive('/saved-equipment') || isActive('/my-bookings') || isActive('/my-postings') ? 'text-[#1A4D2E]' : 'text-gray-400 hover:text-[#1A4D2E]'}`}>
          <User size={28} strokeWidth={isActive('/profile') ? 3 : 2} />
        </div>
      </div>
    </>
  );
};

export default Sidebar;