import { useLanguage } from '../context/LanguageContext';

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-8 md:px-16 lg:px-24 bg-white w-full pb-24">
      <div className="max-w-7xl mx-auto">

        {/* Removed the solid dark green base to let your light image shine! */}
        <div className="relative rounded-[2rem] overflow-hidden shadow-xl border border-[#DDE4E1]">

          {/* Your light background image */}
          <img
            src="/cta-bg.png"
            alt="Farm Harvest Background"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          />

          {/* A very faint white fade on the left just to make the text 100% perfectly crisp */}
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/70 via-white/40 to-transparent"></div>

          <div className="relative z-10 p-12 md:p-16 lg:p-20 max-w-2xl">

            {/* TWEAK 1: Changed heading to your bold FarmEase Green */}
            <h2 className="text-4xl md:text-5xl font-black text-[#006F1D] mb-6 leading-tight tracking-tight">
              {t('ctaTitle')}
            </h2>

            {/* TWEAK 2: Changed subtext to your dark charcoal color */}
            <p className="text-[#2D3432] text-lg md:text-xl font-bold mb-10 leading-relaxed">
              {t('ctaDesc')}
            </p>

            {/* TWEAK 3: The exact same Green Button from your Hero Section */}
            <button className="bg-[#006F1D] hover:bg-green-800 text-white font-extrabold py-4 px-10 rounded-full shadow-lg shadow-green-900/20 hover:shadow-green-900/40 active:scale-95 transition-all duration-200 tracking-wide">
              {t('getStartedNow')}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;