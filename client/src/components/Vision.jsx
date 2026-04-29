import { useLanguage } from '../context/LanguageContext';

const Vision = () => {
  const { t } = useLanguage();

  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-white w-full border-t border-gray-100">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 lg:gap-24 items-center">

        {/* Left Column: Heading & Badges */}
        <div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#2D3432] leading-[1.1] tracking-tight mb-8">
            {t('visionTitle1')}<br />{t('visionTitle2')}<br />{t('visionTitle3')}
          </h2>

          {/* Pill Badges from Figma */}
          <div className="flex flex-wrap gap-3">
            <span className="bg-[#F9FBB7]/60 text-[#2D3432] text-xs font-bold px-4 py-2 rounded-full tracking-wider uppercase border border-[#F9FBB7]">
              {t('actionableMetrics')}
            </span>
            <span className="bg-[#F1F4F2] text-[#2D3432] text-xs font-bold px-4 py-2 rounded-full tracking-wider uppercase border border-[#DDE4E1]">
              {t('sustainableGrowth')}
            </span>
            <span className="bg-[#F1F4F2] text-[#2D3432] text-xs font-bold px-4 py-2 rounded-full tracking-wider uppercase border border-[#DDE4E1]">
              {t('globalReach')}
            </span>
          </div>
        </div>

        {/* Right Column: Paragraph & Link */}
        <div className="flex flex-col items-start">
          <p className="text-[#59615F] text-lg md:text-xl leading-relaxed font-medium mb-8">
            {t('visionDesc')}
          </p>

          {/* Custom "Our Vision" Button with Arrow Circle */}
          <button className="flex items-center text-[#006F1D] font-extrabold text-sm tracking-widest uppercase hover:text-green-800 transition-colors group">
            {t('ourVisionBtn')}
            <span className="ml-3 w-8 h-8 rounded-full border-2 border-[#006F1D] flex items-center justify-center group-hover:bg-[#006F1D] group-hover:text-white transition-all duration-300">
              →
            </span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default Vision;