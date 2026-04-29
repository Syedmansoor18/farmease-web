import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const navigate = useNavigate();
  // FIXED: Pulled 'changeLanguage' exactly as it is in your context
  const { t, language, changeLanguage } = useLanguage();

  return (
    <div className="relative min-h-screen flex flex-col w-full overflow-hidden bg-[#F1F4F2]">

      {/* 1. Main Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/hero-bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/30 via-transparent to-transparent"></div>

      {/* 2. Top Navbar */}
      <header className="relative z-10 w-full grid grid-cols-3 items-center px-8 md:px-16 pt-10 pb-6">
        <div></div>

        <div className="flex items-center justify-center space-x-2">
          <span className="text-[#006F1D] text-3xl">🍃</span>
          <h2 className="text-2xl md:text-3xl font-black text-[#2D3432] tracking-wide drop-shadow-sm">
            {t('introducing')}
          </h2>
        </div>

        <div className="flex items-center justify-end space-x-6">

          {/* THE LANGUAGE DROPDOWN - FIXED WITH FULL NAMES AND changeLanguage */}
          <select
            value={language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="bg-white/80 backdrop-blur-sm text-[#006F1D] font-bold py-2 px-4 rounded-xl shadow-sm outline-none cursor-pointer focus:ring-2 focus:ring-[#006F1D] border border-[#006F1D]/20"
          >
            <option value="en">English 🌐</option>
            <option value="hi">हिन्दी (Hindi) 🇮🇳</option>
            <option value="kn">ಕನ್ನಡ (Kannada) 🇮🇳</option>
            <option value="te">తెలుగు (Telugu) 🇮🇳</option>
            <option value="ta">தமிழ் (Tamil) 🇮🇳</option>
          </select>

          {/* LOGIN BUTTON */}
          <button
            onClick={() => navigate('/login')}
            className="text-[#2D3432] hover:text-[#006F1D] font-bold transition-colors"
          >
            {t('loginBtn')}
          </button>

          {/* SIGN UP BUTTON */}
          <button
            onClick={() => navigate('/signup')}
            className="bg-[#006F1D] hover:bg-green-800 text-white font-bold py-2 px-6 rounded-full shadow-md transition-all active:scale-95 border border-[#00A82D]/20"
          >
            {t('signUpBtn')}
          </button>
        </div>
      </header>

      {/* 3. Main Content Area */}
      <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center flex-grow w-full px-8 md:px-16 pb-16">
        <div className="space-y-6">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight tracking-tight">
            <span className="block text-[#2D3432]">{t('grow')}</span>
            <span className="block text-[#2D3432]">{t('connect')}</span>
            <span className="block text-[#006F1D]">{t('prosper')}</span>
          </h1>

          <p className="text-[#2D3432] text-lg md:text-xl max-w-lg leading-relaxed font-semibold">
            {t('heroDesc')}
          </p>

          <button
            onClick={() => navigate('/signup')}
            className="mt-4 bg-[#006F1D] hover:bg-green-800 transition-colors text-white font-extrabold py-4 px-10 rounded-full shadow-lg shadow-[#006F1D]/30 active:scale-95 tracking-wide"
          >
            {t('getStarted')}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-lg ml-auto">
          <div className="bg-white rounded-3xl p-6 flex flex-col justify-center shadow-xl border border-[#DDE4E1]/50">
            <h3 className="text-4xl font-black text-[#006F1D] mb-2">10K+</h3>
            <p className="text-[#59615F] font-bold text-sm">{t('activeFarmers')}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 flex flex-col justify-center shadow-xl border border-[#DDE4E1]/50">
            <h3 className="text-4xl font-black text-[#006F1D] mb-2">5K+</h3>
            <p className="text-[#59615F] font-bold text-sm">{t('equipmentListings')}</p>
          </div>

          <div className="bg-white rounded-3xl p-6 flex flex-col justify-center shadow-xl border border-[#DDE4E1]/50">
            <h3 className="text-4xl font-black text-[#006F1D] mb-2">1K+</h3>
            <p className="text-[#59615F] font-bold text-sm">{t('dailyTransactions')}</p>
          </div>

          <div className="rounded-3xl p-6 flex items-end min-h-[160px] overflow-hidden relative shadow-xl border border-[#DDE4E1]/50">
             <div
               className="absolute inset-0 z-0"
               style={{
                 backgroundImage: "url('/smart-farming.png')",
                 backgroundSize: "cover",
                 backgroundPosition: "center",
               }}
               onError={(e) => { e.target.style.backgroundImage = "url('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=1000&auto=format&fit=crop')" }}
             ></div>
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10"></div>
             <span className="text-white font-bold z-20 relative text-lg tracking-wide">{t('smartFarming')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;