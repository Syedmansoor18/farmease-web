import { useLanguage } from '../Context/LanguageContext';

const CTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 px-5 md:px-16 lg:px-24 bg-white w-full pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto">

        <div className="relative rounded-3xl md:rounded-[2rem] overflow-hidden shadow-xl border border-[#DDE4E1]">
          <img
            src="/cta-bg.png"
            alt="Farm Harvest Background"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-80"
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-white/90 md:from-white/70 via-white/70 md:via-white/40 to-white/30 md:to-transparent"></div>

          <div className="relative z-10 p-8 md:p-16 lg:p-20 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#006F1D] mb-4 md:mb-6 leading-tight tracking-tight">
              {t('ctaTitle')}
            </h2>
            <p className="text-[#2D3432] text-base md:text-lg lg:text-xl font-bold mb-8 md:mb-10 leading-relaxed">
              {t('ctaDesc')}
            </p>
            <button className="bg-[#006F1D] hover:bg-green-800 text-white font-extrabold py-3 md:py-4 px-8 md:px-10 rounded-full shadow-lg shadow-green-900/20 hover:shadow-green-900/40 active:scale-95 transition-all duration-200 tracking-wide text-sm md:text-base w-full sm:w-auto">
              {t('getStartedNow')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;