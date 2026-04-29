import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Search, Globe, ChevronLeft, Check } from 'lucide-react';

const languages = [
  { id: 'en', name: 'English', sub: 'Global' },
  { id: 'hi', name: 'Hindi', sub: 'हिन्दी' },
  { id: 'kn', name: 'Kannada', sub: 'ಕನ್ನಡ' },
  { id: 'ta', name: 'Tamil', sub: 'தமிழ்' },
  { id: 'te', name: 'Telugu', sub: 'తెలుగు' },
  { id: 'ml', name: 'Malayalam', sub: 'മലയാളം' },
  { id: 'mr', name: 'Marathi', sub: 'मराठी' },
  { id: 'gu', name: 'Gujarati', sub: 'ગુજરાતી' },
];

const Language = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState('en');

  return (
    <div className="flex bg-[#FBFDFB] min-h-screen font-sans">
      <Sidebar />

      <main className="flex-1 ml-20 p-8 md:p-12 overflow-y-auto">
        <div className="max-w-3xl mx-auto">

          {/* Breadcrumb */}
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-400 font-bold text-sm mb-6 hover:text-[#1A4D2E] transition-colors"
          >
            <ChevronLeft size={18} /> Profile &gt; Language
          </button>

          <h1 className="text-4xl font-black text-[#1A4D2E] tracking-tighter mb-2">Select Language</h1>
          <p className="text-gray-400 font-medium mb-8">Choose your preferred language for a better harvesting experience.</p>

          {/* Search Bar */}
          <div className="relative mb-10">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
            <input
              type="text"
              placeholder="Search for your language..."
              className="w-full bg-[#F1F3F2] py-5 pl-12 pr-6 rounded-2xl outline-none font-medium placeholder:text-gray-300"
            />
          </div>

          {/* Language List */}
          <div className="space-y-2 mb-10">
            {languages.map((lang) => (
              <div
                key={lang.id}
                onClick={() => setSelected(lang.id)}
                className={`flex items-center justify-between p-5 rounded-2xl cursor-pointer transition-all ${
                  selected === lang.id ? 'bg-white shadow-md border border-gray-100' : 'hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-black text-[#2D3432]">{lang.name}</p>
                  <p className="text-xs font-bold text-gray-300 tracking-widest">{lang.sub}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selected === lang.id ? 'bg-[#1A4D2E] border-[#1A4D2E]' : 'border-gray-200'
                }`}>
                  {selected === lang.id && <Check size={14} className="text-white" strokeWidth={4} />}
                </div>
              </div>
            ))}
          </div>

          {/* Request Banner */}
          <div className="bg-[#B7E9CC] p-8 rounded-[35px] flex items-center justify-between relative overflow-hidden mb-12">
            <div className="relative z-10">
              <h3 className="text-[#1A4D2E] font-black text-xl mb-1">Can't find your language?</h3>
              <p className="text-[#1A4D2E]/60 text-sm font-bold mb-4">We are constantly adding new regional dialects to serve every corner of the field.</p>
              <button className="bg-[#1A4D2E] text-white px-6 py-3 rounded-full font-black text-xs shadow-lg">Request Language</button>
            </div>
            <Globe size={120} className="text-[#1A4D2E]/5 absolute -right-4 -bottom-4 rotate-12" />
          </div>

          {/* Save Button */}
          <button
            onClick={() => navigate('/profile')}
            className="w-full bg-[#1A4D2E] text-white py-6 rounded-3xl font-black text-xl shadow-xl hover:bg-[#143d24] active:scale-95 transition-all mb-10"
          >
            Save Selection
          </button>

        </div>
      </main>
    </div>
  );
};

export default Language;