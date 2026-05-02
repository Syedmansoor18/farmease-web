import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../Context/LanguageContext";

const LANGUAGES = [
  { code: "en", name: "English", native: "Global" },
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
];

export default function LanguagePage() {
  const navigate = useNavigate();
  const { language, changeLanguage, t } = useLanguage();
  const [selected, setSelected] = useState(language);
  const [search, setSearch] = useState("");

  const filtered = LANGUAGES.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.native.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = () => {
    changeLanguage(selected);
    navigate(-1);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="flex-1 ml-20 px-10 py-6 font-sans text-gray-800 flex flex-col">

        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1">
          <span
            className="cursor-pointer hover:underline text-gray-600 font-medium"
            onClick={() => navigate("/profile")}
          >
            {t("profile")}
          </span>
          <span className="text-gray-400">&gt;</span>
          <span className="text-green-600 font-medium">{t("language")}</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("selectLanguage")}</h1>
        <p className="text-sm text-gray-500 mb-6">{t("selectLanguageSubtitle")}</p>

        {/* Search */}
        <div className="relative mb-4">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={t("searchLanguage")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-green-500 text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Language List */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-5 flex-1">
          {filtered.map((lang, idx) => (
            <label
              key={lang.code}
              className={`flex items-center justify-between px-5 py-4 cursor-pointer transition-colors
                ${idx !== filtered.length - 1 ? "border-b border-gray-100" : ""}
                ${selected === lang.code ? "bg-gray-50" : "hover:bg-gray-50"}
              `}
            >
              <div>
                <p className="text-sm font-semibold text-gray-900">{lang.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{lang.native}</p>
              </div>
              <div className="relative w-5 h-5">
                <input
                  type="radio"
                  name="language"
                  value={lang.code}
                  checked={selected === lang.code}
                  onChange={() => setSelected(lang.code)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                    ${selected === lang.code
                      ? "border-green-600 bg-green-600"
                      : "border-gray-300 bg-white"
                    }`}
                >
                  {selected === lang.code && (
                    <div className="w-2 h-2 rounded-full bg-white" />
                  )}
                </div>
              </div>
            </label>
          ))}

          {filtered.length === 0 && (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              No languages found for "{search}"
            </div>
          )}
        </div>

        {/* Can't find language banner */}
        <div className="bg-green-50 rounded-2xl border border-green-100 p-5 mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-800 mb-1">{t("cantFindLanguage")}</p>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{t("cantFindLanguageDetail")}</p>
            <button className="bg-green-700 hover:bg-green-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
              {t("requestLanguage")}
            </button>
          </div>
          <div className="shrink-0 text-green-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </div>
        </div>

        {/* Save Button — sticky bottom */}
        <div className="sticky bottom-0 bg-gray-50 pt-2 pb-4">
          <button
            onClick={handleSave}
            className="w-full bg-green-800 hover:bg-green-900 text-white font-semibold py-4 rounded-xl text-sm transition-colors duration-200 flex items-center justify-center gap-2"
          >
            {t("saveSelection")}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>

      </main>
    </div>
  );
}
