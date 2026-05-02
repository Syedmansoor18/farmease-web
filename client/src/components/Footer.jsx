import { useLanguage } from '../Context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#F1F4F2] border-t border-[#DDE4E1] pt-12 md:pt-16 pb-24 md:pb-8 px-5 md:px-16 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto text-center md:text-left">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-12 mb-12 md:mb-16">
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-4 md:mb-6">
              <span className="text-[#006F1D] text-3xl">🍃</span>
              <span className="text-2xl font-bold text-[#2D3432] tracking-wide">FarmEase</span>
            </div>
            <p className="text-[#59615F] text-sm md:text-base font-medium leading-relaxed max-w-sm">
              {t('footerDesc')}
            </p>
          </div>

          <div>
            <h4 className="text-[#2D3432] font-extrabold mb-4 md:mb-6">{t('quickLinks')}</h4>
            <ul className="space-y-3 md:space-y-4">
              <li><button className="text-[#59615F] hover:text-[#006F1D] text-sm md:text-base font-medium transition-colors">{t('home')}</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] text-sm md:text-base font-medium transition-colors">{t('features')}</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] text-sm md:text-base font-medium transition-colors">{t('inspiration')}</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#2D3432] font-extrabold mb-4 md:mb-6">{t('support')}</h4>
            <ul className="space-y-3 md:space-y-4">
              <li><button className="text-[#59615F] hover:text-[#006F1D] text-sm md:text-base font-medium transition-colors">{t('helpAndSupport')}</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] text-sm md:text-base font-medium transition-colors">{t('contact')}</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] text-sm md:text-base font-medium transition-colors">{t('privacyPolicy')}</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#DDE4E1] pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#59615F] text-xs md:text-sm font-medium">
            {t('copyright')}
          </p>
          <div className="flex space-x-4 md:space-x-6">
            <button className="text-[#59615F] hover:text-[#006F1D] text-xs md:text-sm font-medium transition-colors">{t('termsOfServiceFooter')}</button>
            <button className="text-[#59615F] hover:text-[#006F1D] text-xs md:text-sm font-medium transition-colors">{t('cookiePolicy')}</button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;