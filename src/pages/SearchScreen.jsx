import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const MapPinIcon = ({ color = "currentColor", size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const HeartIcon = ({ filled, color }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
  </svg>
);
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "All States",
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const CATEGORIES = [
  { key: "all", labelKey: "allCategories" },
  { key: "tractor", labelKey: "categoryTractor" },
  { key: "tool", labelKey: "categoryTools" },
  { key: "harvesting", labelKey: "categoryHarvesting" },
];

const equipmentData = [
  { id: 1, name: "Swaraj 744 FE Tractor", category: "tractor", type: "rent", state: "Maharashtra", city: "Pune", price: 1200, unit: "hour", status: "available", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 2, name: "John Deere 5050 D", category: "tractor", type: "buy", state: "Maharashtra", city: "Nagpur", price: 650000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 3, name: "Rotavator 6 Feet", category: "tool", type: "rent", state: "Maharashtra", city: "Aurangabad", price: 800, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 4, name: "Seed Drill Machine", category: "tool", type: "rent", state: "Maharashtra", city: "Nashik", price: 1500, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 5, name: "Wheat Harvester", category: "harvesting", type: "buy", state: "Maharashtra", city: "Jalgaon", price: 1200000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 6, name: "Farm Tools Set", category: "tool", type: "rent", state: "Maharashtra", city: "Solapur", price: 300, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 7, name: "Combine Harvester Pro", category: "harvesting", type: "rent", state: "Punjab", city: "Amritsar", price: 5000, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 8, name: "Rice Harvester HD", category: "harvesting", type: "buy", state: "Punjab", city: "Ludhiana", price: 850000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 9, name: "Maize Harvesting Machine", category: "harvesting", type: "rent", state: "Punjab", city: "Patiala", price: 3500, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 10, name: "Mahindra 575 DI Tractor", category: "tractor", type: "rent", state: "Punjab", city: "Jalandhar", price: 950, unit: "hour", status: "available", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 11, name: "Laser Land Leveler", category: "tool", type: "rent", state: "Punjab", city: "Bathinda", price: 2000, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 12, name: "Eicher 380 Tractor", category: "tractor", type: "buy", state: "Rajasthan", city: "Jodhpur", price: 520000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 13, name: "Drip Irrigation Kit", category: "tool", type: "rent", state: "Rajasthan", city: "Udaipur", price: 200, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 14, name: "Desert Tractor 4WD", category: "tractor", type: "rent", state: "Rajasthan", city: "Jaipur", price: 1100, unit: "hour", status: "available", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 15, name: "Millet Harvester", category: "harvesting", type: "rent", state: "Rajasthan", city: "Bikaner", price: 2500, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 16, name: "Sugarcane Harvester", category: "harvesting", type: "rent", state: "Uttar Pradesh", city: "Lucknow", price: 4500, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 17, name: "Potato Digger Machine", category: "harvesting", type: "buy", state: "Uttar Pradesh", city: "Agra", price: 380000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 18, name: "Onion Harvester", category: "harvesting", type: "rent", state: "Uttar Pradesh", city: "Kanpur", price: 2800, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 19, name: "Sonalika 750 Tractor", category: "tractor", type: "rent", state: "Uttar Pradesh", city: "Varanasi", price: 800, unit: "hour", status: "available", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 20, name: "Power Weeder", category: "tool", type: "rent", state: "Uttar Pradesh", city: "Meerut", price: 400, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 21, name: "Paddy Transplanter", category: "tool", type: "rent", state: "Karnataka", city: "Bengaluru", price: 1800, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 22, name: "Coffee Pulper Machine", category: "tool", type: "buy", state: "Karnataka", city: "Coorg", price: 95000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 23, name: "Ragi Harvester", category: "harvesting", type: "rent", state: "Karnataka", city: "Mysuru", price: 2200, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 24, name: "TAFE 45 DI Tractor", category: "tractor", type: "buy", state: "Karnataka", city: "Hubli", price: 480000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 25, name: "Rice Combine Harvester", category: "harvesting", type: "rent", state: "Tamil Nadu", city: "Thanjavur", price: 3800, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 26, name: "Banana Fiber Extractor", category: "tool", type: "buy", state: "Tamil Nadu", city: "Madurai", price: 75000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 27, name: "Kubota L4508 Tractor", category: "tractor", type: "rent", state: "Tamil Nadu", city: "Coimbatore", price: 1000, unit: "hour", status: "available", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 28, name: "Groundnut Digger", category: "harvesting", type: "rent", state: "Tamil Nadu", city: "Tirunelveli", price: 1500, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 29, name: "Cotton Harvester", category: "harvesting", type: "rent", state: "Gujarat", city: "Ahmedabad", price: 4000, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 30, name: "Sprinkler Irrigation Set", category: "tool", type: "rent", state: "Gujarat", city: "Rajkot", price: 350, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 31, name: "New Holland 3600 Tractor", category: "tractor", type: "buy", state: "Gujarat", city: "Surat", price: 720000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 32, name: "Castor Harvester", category: "harvesting", type: "rent", state: "Gujarat", city: "Bhavnagar", price: 1800, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 33, name: "Jute Retting Machine", category: "tool", type: "rent", state: "West Bengal", city: "Kolkata", price: 600, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 34, name: "Rice Transplanter", category: "tool", type: "rent", state: "West Bengal", city: "Siliguri", price: 1200, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 35, name: "Mini Combine Harvester", category: "harvesting", type: "buy", state: "West Bengal", city: "Burdwan", price: 420000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 36, name: "VST Shakti Tractor", category: "tractor", type: "rent", state: "West Bengal", city: "Asansol", price: 700, unit: "hour", status: "available", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 37, name: "Soybean Harvester", category: "harvesting", type: "rent", state: "Madhya Pradesh", city: "Indore", price: 3200, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 38, name: "Rotary Tiller", category: "tool", type: "rent", state: "Madhya Pradesh", city: "Bhopal", price: 900, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 39, name: "Force Balwan 400 Tractor", category: "tractor", type: "buy", state: "Madhya Pradesh", city: "Jabalpur", price: 460000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 40, name: "Tobacco Harvester", category: "harvesting", type: "rent", state: "Andhra Pradesh", city: "Vijayawada", price: 2600, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 41, name: "Chilli Harvester", category: "harvesting", type: "rent", state: "Andhra Pradesh", city: "Guntur", price: 2000, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 42, name: "Indo Farm 2030 Tractor", category: "tractor", type: "rent", state: "Andhra Pradesh", city: "Visakhapatnam", price: 850, unit: "hour", status: "available", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 43, name: "Paddy Harvester", category: "harvesting", type: "rent", state: "Telangana", city: "Hyderabad", price: 3500, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 44, name: "Boom Sprayer", category: "tool", type: "rent", state: "Telangana", city: "Warangal", price: 700, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 45, name: "ACE DI 450 Tractor", category: "tractor", type: "buy", state: "Telangana", city: "Karimnagar", price: 495000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80" },
  { id: 46, name: "Basmati Rice Harvester", category: "harvesting", type: "rent", state: "Haryana", city: "Karnal", price: 4200, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&q=80" },
  { id: 47, name: "Happy Seeder Machine", category: "tool", type: "rent", state: "Haryana", city: "Hisar", price: 1600, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
  { id: 48, name: "Farmtrac 60 Tractor", category: "tractor", type: "buy", state: "Haryana", city: "Rohtak", price: 580000, unit: null, status: "for sale", img: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=400&q=80" },
  { id: 49, name: "Maize Sheller", category: "tool", type: "rent", state: "Bihar", city: "Patna", price: 500, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80" },
  { id: 50, name: "Lichi Harvesting Kit", category: "harvesting", type: "rent", state: "Bihar", city: "Muzaffarpur", price: 900, unit: "day", status: "available", img: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80" },
];

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, t }) {
  const ok = status === "available";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ok ? "bg-green-100 text-green-800" : "bg-orange-50 text-orange-700"}`}>
      {ok ? t("available") : t("forSale")}
    </span>
  );
}

// ── Equipment Card ────────────────────────────────────────────────────────────
function EquipmentCard({ item, t }) {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const isRent = item.type === "rent";

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
      onClick={() => navigate("/equipment-detail", { state: { equipment: item } })}
    >
      <div className="relative">
        <img
          src={item.img}
          alt={item.name}
          className="w-full h-40 object-cover"
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80"; }}
        />
        <button
          onClick={e => { e.stopPropagation(); setLiked(l => !l); }}
          className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full border-none flex items-center justify-center cursor-pointer shadow-sm"
        >
          <HeartIcon filled={liked} color={liked ? "#e53935" : "#aaa"} />
        </button>
        <div className="absolute top-2 left-2">
          <StatusBadge status={item.status} t={t} />
        </div>
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <p className="font-bold text-sm text-gray-900 leading-tight">{item.name}</p>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPinIcon color="#2e7d32" size={12} />
          {item.city}, {item.state}
        </div>
        <div className="mt-auto flex justify-between items-center pt-2">
          <div>
            <span className="font-bold text-sm text-gray-900">₹{item.price.toLocaleString("en-IN")}</span>
            {item.unit && <span className="text-xs text-gray-400"> / {item.unit}</span>}
          </div>
          <button
            onClick={e => e.stopPropagation()}
            className={`text-white text-xs font-semibold px-4 py-1.5 rounded-lg border-none cursor-pointer ${isRent ? "bg-green-800" : "bg-blue-800"}`}
          >
            {isRent ? t("intentRent") : t("buy")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main SearchScreen ─────────────────────────────────────────────────────────
export default function SearchScreen() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("both");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  const filtered = useMemo(() => {
    return equipmentData.filter(item => {
      if (search.trim()) {
        const q = search.toLowerCase();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.city.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (mode === "rent" && item.type !== "rent") return false;
      if (mode === "buy" && item.type !== "buy") return false;
      if (selectedState !== "All States" && item.state !== selectedState) return false;
      if (selectedCategory !== "all" && item.category !== selectedCategory) return false;
      return true;
    });
  }, [search, mode, selectedState, selectedCategory]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    if (sortBy === "price_low") arr.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [filtered, sortBy]);

  return (
    <div className="bg-[#f4f6f3] min-h-screen font-sans" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar />
      <div className="p-6" style={{ marginLeft: "76px" }}>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder={t("searchEquipmentPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-full text-sm outline-none bg-white focus:border-green-700 transition-colors"
            />
          </div>
          <button className="bg-green-800 text-white border-none rounded-full px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2">
            <SearchIcon /> {t("search")}
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 items-center mb-3 flex-wrap">

          {/* Category Select */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="appearance-none py-2 pl-3 pr-8 rounded-lg border-2 border-gray-200 text-sm bg-white cursor-pointer outline-none"
            >
              {CATEGORIES.map(c => (
                <option key={c.key} value={c.key}>{t(c.labelKey)}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex"><ChevronDownIcon /></span>
          </div>

          {/* State Select */}
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none flex">
              <MapPinIcon color="#2e7d32" size={13} />
            </span>
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="appearance-none py-2 pl-7 pr-8 rounded-lg border-2 border-gray-200 text-sm bg-white cursor-pointer outline-none min-w-[160px]"
            >
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex"><ChevronDownIcon /></span>
          </div>

          {/* Rent / Both / Buy Toggle */}
          <div className="flex rounded-lg overflow-hidden border-2 border-green-800">
            {[
              ["rent", t("intentRent")],
              ["both", t("both")],
              ["buy", t("buy")],
            ].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-sm font-semibold border-none cursor-pointer transition-all ${mode === m ? "bg-green-800 text-white" : "bg-white text-green-800"}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-400">{t("sortBy")}:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="appearance-none py-2 pl-3 pr-8 rounded-lg border-2 border-gray-200 text-sm bg-white cursor-pointer outline-none"
              >
                <option value="recommended">{t("recommended")}</option>
                <option value="price_low">{t("priceLowToHigh")}</option>
                <option value="price_high">{t("priceHighToLow")}</option>
              </select>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex"><ChevronDownIcon /></span>
            </div>
          </div>
        </div>

        {/* Category Pills + Results Count */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium cursor-pointer transition-all ${
                selectedCategory === cat.key
                  ? "border-green-800 bg-green-800 text-white"
                  : "border-gray-200 bg-white text-gray-500"
              }`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500 font-medium">
            {sorted.length} {t("resultsFound")}
          </span>
        </div>

        {/* Cards Grid */}
        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <div className="flex justify-center mb-4 text-gray-300"><SearchIcon /></div>
            <p className="text-base text-gray-600 font-semibold">{t("noEquipmentFound")}</p>
            <p className="text-sm text-gray-400 mt-1">{t("tryDifferentSearch")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(235px,1fr))] gap-4">
            {sorted.map(item => <EquipmentCard key={item.id} item={item} t={t} />)}
          </div>
        )}

      </div>
    </div>
  );
}