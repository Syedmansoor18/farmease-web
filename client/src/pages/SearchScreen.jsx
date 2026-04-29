import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"; // 🚨 Added useSearchParams
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient"; // 🚨 Added Supabase

// ── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
);
const MapPinIcon = ({ color = "currentColor", size = 13 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
);
const HeartIcon = ({ filled, color }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);
const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────
const INDIAN_STATES = [
  "All States", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

const CATEGORIES = [
  { key: "all", labelKey: "allCategories" },
  { key: "Tractor", labelKey: "categoryTractor" },
  { key: "Harvester", labelKey: "categoryHarvesting" },
  { key: "Irrigation", labelKey: "irrigationTools" },
];

// ── Status Badge ──────────────────────────────────────────────────────────────
function StatusBadge({ status, t }) {
  const ok = status === "available";
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${ok ? "bg-green-100 text-green-800" : "bg-orange-50 text-orange-700"}`}>
      {ok ? t("available") : "Unavailable"}
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
          src={item.img || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&q=80"}
          alt={item.name}
          className="w-full h-40 object-cover"
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
            <span className="text-xs text-gray-400"> {isRent ? "/ day" : ""}</span>
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
  const [searchParams] = useSearchParams();
  
  // 🚨 Catch the URL query on load
  const initialQuery = searchParams.get("query") || "";

  // 🚨 Live Data States
  const [liveEquipment, setLiveEquipment] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState(initialQuery);
  const [mode, setMode] = useState("all");
  const [selectedState, setSelectedState] = useState("All States");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  // 🚨 THE SUPABASE SEARCH ENGINE
  const fetchEquipment = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from('equipment_list').select('*').eq('is_available', true);

      // Filter by Intent (Parsing from description)
      if (mode === "rent") query = query.ilike('description', '%Listing Intent: Rent%');
      if (mode === "buy") query = query.ilike('description', '%Listing Intent: Sell%');

      // Filter by State
      if (selectedState !== "All States") query = query.eq('state', selectedState);

      // Filter by Category
      if (selectedCategory !== "all") query = query.ilike('type', `%${selectedCategory}%`);

      // 🚨 Filter by Text (Name OR Type OR Description)
      if (search.trim()) {
        query = query.or(`name.ilike.%${search}%,type.ilike.%${search}%,description.ilike.%${search}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Format the DB data for the UI
      const formattedData = data.map(eq => {
        const descMatch = eq.description?.match(/Listing Intent: (.*)/);
        const intent = descMatch ? descMatch[1].trim() : "Rent";
        
        return {
          id: eq.id,
          name: eq.name,
          category: eq.type,
          type: intent.toLowerCase() === 'sell' ? 'buy' : 'rent',
          state: eq.state,
          city: eq.location || eq.district,
          price: eq.price_per_day,
          status: eq.is_available ? "available" : "unavailable",
          img: eq.image_url,
          rawDescription: eq.description
        };
      });

      setLiveEquipment(formattedData);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Run the fetch when the component loads, or when the user changes a main filter
  useEffect(() => {
    fetchEquipment();
  }, [mode, selectedState, selectedCategory]); // Removed 'search' dependency to prevent fetching on every keystroke

  // 🚨 Local sorting using useMemo (Fast & Free!)
  const sorted = useMemo(() => {
    const arr = [...liveEquipment];
    if (sortBy === "price_low") arr.sort((a, b) => a.price - b.price);
    else if (sortBy === "price_high") arr.sort((a, b) => b.price - a.price);
    return arr;
  }, [liveEquipment, sortBy]);

  return (
    <div className="bg-[#f4f6f3] min-h-screen font-sans" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar />
      <div className="p-6" style={{ marginLeft: "76px" }}>

        {/* Search Bar */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 flex"><SearchIcon /></span>
            <input
              type="text"
              placeholder={t("searchEquipmentPlaceholder")}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && fetchEquipment()} // Fetch on Enter key
              className="w-full py-3 pl-11 pr-4 border-2 border-gray-200 rounded-full text-sm outline-none bg-white focus:border-green-700 transition-colors"
            />
          </div>
          <button 
            onClick={fetchEquipment} // Fetch on button click
            className="bg-green-800 hover:bg-green-900 transition-colors text-white border-none rounded-full px-6 py-3 text-sm font-semibold cursor-pointer flex items-center gap-2"
          >
            <SearchIcon /> {t("search")}
          </button>
        </div>

        {/* Filters Row */}
        <div className="flex gap-2 items-center mb-3 flex-wrap">
          <div className="relative">
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="appearance-none py-2 pl-3 pr-8 rounded-lg border-2 border-gray-200 text-sm bg-white cursor-pointer outline-none">
              {CATEGORIES.map(c => <option key={c.key} value={c.key}>{t(c.labelKey)}</option>)}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex"><ChevronDownIcon /></span>
          </div>

          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none flex"><MapPinIcon color="#2e7d32" size={13} /></span>
            <select value={selectedState} onChange={e => setSelectedState(e.target.value)} className="appearance-none py-2 pl-7 pr-8 rounded-lg border-2 border-gray-200 text-sm bg-white cursor-pointer outline-none min-w-[160px]">
              {INDIAN_STATES.map(s => <option key={s}>{s}</option>)}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex"><ChevronDownIcon /></span>
          </div>

          <div className="flex rounded-lg overflow-hidden border-2 border-green-800">
            {[ ["rent", t("intentRent") || "Rent"], ["buy", t("buy") || "Buy"], ["all", t("all") || "All"] ].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 text-sm font-semibold capitalize border-none cursor-pointer transition-all flex-1 ${mode === m ? "bg-green-800 text-white" : "bg-white text-green-800 hover:bg-green-50"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-gray-400">{t("sortBy")}:</span>
            <div className="relative">
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="appearance-none py-2 pl-3 pr-8 rounded-lg border-2 border-gray-200 text-sm bg-white cursor-pointer outline-none">
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
              className={`px-4 py-1.5 rounded-full border-2 text-sm font-medium cursor-pointer transition-all ${selectedCategory === cat.key ? "border-green-800 bg-green-800 text-white" : "border-gray-200 bg-white text-gray-500"}`}
            >
              {t(cat.labelKey)}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-500 font-medium">
            {isLoading ? "Searching..." : `${sorted.length} ${t("resultsFound")}`}
          </span>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-green-800 font-bold">Loading live inventory...</div>
        ) : sorted.length === 0 ? (
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