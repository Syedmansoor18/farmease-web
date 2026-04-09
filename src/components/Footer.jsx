const Footer = () => {
  return (
    <footer className="bg-[#F1F4F2] border-t border-[#DDE4E1] pt-16 pb-8 px-8 md:px-16 lg:px-24 w-full">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <span className="text-[#006F1D] text-3xl">🍃</span>
              <span className="text-2xl font-bold text-[#2D3432] tracking-wide">FarmEase</span>
            </div>
            <p className="text-[#59615F] font-medium leading-relaxed max-w-sm">
              Grow. Connect. Prosper. We are rewriting the future of agriculture through data and community.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-[#2D3432] font-extrabold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><button className="text-[#59615F] hover:text-[#006F1D] font-medium transition-colors">Home</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] font-medium transition-colors">Features</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] font-medium transition-colors">Inspiration</button></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="text-[#2D3432] font-extrabold mb-6">Support</h4>
            <ul className="space-y-4">
              <li><button className="text-[#59615F] hover:text-[#006F1D] font-medium transition-colors">Help & Support</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] font-medium transition-colors">Contact</button></li>
              <li><button className="text-[#59615F] hover:text-[#006F1D] font-medium transition-colors">Privacy Policy</button></li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-[#DDE4E1] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#59615F] text-sm font-medium">
            © 2026 FarmEase. Grow. Connect. Prosper. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <button className="text-[#59615F] hover:text-[#006F1D] text-sm font-medium transition-colors">Terms of Service</button>
            <button className="text-[#59615F] hover:text-[#006F1D] text-sm font-medium transition-colors">Cookie Policy</button>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;