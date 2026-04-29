const featuresData = [
  {
    title: "Inclusive",
    description: "Breaking barriers for farmers of all scales, ensuring everyone has the digital tools to succeed.",
    icon: "👥",
  },
  {
    title: "Smart Profiling",
    description: "Advanced data modeling to create a comprehensive digital twin of your farm's unique ecosystem.",
    icon: "🎯",
  },
  {
    title: "Equipment Hub",
    description: "Rent, lease, or purchase precision machinery directly from trusted local and regional partners.",
    icon: "🚜",
  },
  {
    title: "Recommendations",
    description: "Context-aware advice on irrigation, fertilizing, and harvesting based on real-time climate data.",
    icon: "📈",
  },
  {
    title: "Multilingual",
    description: "Native support for over 15 regional languages to ensure clarity and ease of use for everyone.",
    icon: "🗣️",
  },
  {
    title: "Delivery",
    description: "Integrated logistics network to bring produce to market faster and fresher than ever before.",
    icon: "🚚",
  }
];

const Features = () => {
  return (
    <section className="py-24 px-8 md:px-16 lg:px-24 bg-[#FAFAFA] w-full">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#2D3432] mb-4 tracking-tight">
              Features that Empower Farmers
            </h2>
            <p className="text-[#59615F] text-lg font-medium leading-relaxed">
              Designed with precision, built for growth. Every tool is crafted to remove friction from your daily workflow.
            </p>
          </div>

          <button className="text-[#006F1D] font-bold flex items-center hover:text-green-800 transition-colors self-start md:self-end group">
            View All Features
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featuresData.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-[2rem] p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#DDE4E1] hover:shadow-xl transition-shadow duration-300 flex flex-col"
            >
              {/* Icon Circle */}
              <div className="w-12 h-12 rounded-full bg-[#006F1D]/10 flex items-center justify-center mb-6 text-xl">
                {feature.icon}
              </div>

              {/* Text Content */}
              <h3 className="text-xl font-extrabold text-[#2D3432] mb-3">
                {feature.title}
              </h3>
              <p className="text-[#59615F] leading-relaxed font-medium">
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