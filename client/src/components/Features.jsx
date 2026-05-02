import { useLanguage } from '../Context/LanguageContext';

const Features = () => {
  const { t } = useLanguage();

  const featuresData = [
    { title: t('feat1Title'), description: t('feat1Desc'), icon: "👥" },
    { title: t('feat2Title'), description: t('feat2Desc'), icon: "🎯" },
    { title: t('feat3Title'), description: t('feat3Desc'), icon: "🚜" },
    { title: t('feat4Title'), description: t('feat4Desc'), icon: "📈" },
    { title: t('feat5Title'), description: t('feat5Desc'), icon: "🗣️" },
    { title: t('feat6Title'), description: t('feat6Desc'), icon: "🚚" }
  ];

  return (
    <section className="py-16 md:py-24 px-5 md:px-16 lg:px-24 bg-[#FAFAFA] w-full">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 md:gap-6">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#2D3432] mb-3 md:mb-4 tracking-tight">
              {t('featuresTitle')}
            </h2>
            <p className="text-[#59615F] text-base md:text-lg font-medium leading-relaxed">
              {t('featuresDesc')}
            </p>
          </div>

          <button className="text-[#006F1D] font-bold flex items-center justify-center hover:text-green-800 transition-colors self-center md:self-end group">
            {t('viewAllFeatures')}
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] p-6 md:p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#DDE4E1] hover:shadow-xl transition-shadow duration-300 flex flex-col items-center md:items-start text-center md:text-left"
            >
              <div className="w-12 h-12 rounded-full bg-[#006F1D]/10 flex items-center justify-center mb-5 md:mb-6 text-xl">
                {feature.icon}
              </div>
              <h3 className="text-xl font-extrabold text-[#2D3432] mb-2 md:mb-3">
                {feature.title}
              </h3>
              <p className="text-[#59615F] text-sm md:text-base leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Features;