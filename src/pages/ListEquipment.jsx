import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useLanguage } from "../context/LanguageContext";

const ALL_CATEGORIES = [
  "Tractor","Harvester","Combine Harvester","Rotavator","Cultivator",
  "Plough","Disc Harrow","Seed Drill","Sprayer","Irrigation Pump",
  "Power Tiller","Thresher","Reaper","Baler","Transplanter",
  "Laser Land Leveller","Mulcher","Shredder","Tiller","Water Tanker",
];

const ALL_DISTRICTS = {
  andhra_pradesh: ["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
  gujarat: ["Ahmedabad","Amreli","Anand","Banaskantha","Bharuch","Bhavnagar","Gandhinagar","Junagadh","Kutch","Rajkot","Surat","Vadodara"],
  karnataka: ["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagara","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"],
  madhya_pradesh: ["Bhopal","Gwalior","Indore","Jabalpur","Rewa","Sagar","Satna","Ujjain"],
  maharashtra: ["Amravati","Aurangabad","Kolhapur","Mumbai","Nagpur","Nashik","Pune","Raigad","Solapur","Thane"],
  punjab: ["Amritsar","Bathinda","Faridkot","Firozpur","Gurdaspur","Hoshiarpur","Jalandhar","Ludhiana","Mansa","Moga","Mohali","Patiala","Rupnagar","Sangrur","Tarn Taran"],
  rajasthan: ["Ajmer","Alwar","Barmer","Bharatpur","Bhilwara","Bikaner","Chittorgarh","Dungarpur","Jaipur","Jaisalmer","Jodhpur","Kota","Nagaur","Pali","Sikar","Udaipur"],
  uttar_pradesh: ["Agra","Aligarh","Ayodhya","Azamgarh","Bareilly","Gorakhpur","Jhansi","Kanpur Nagar","Lucknow","Mathura","Meerut","Moradabad","Prayagraj","Varanasi"],
};

const STATE_LABELS = {
  andhra_pradesh: "Andhra Pradesh",
  gujarat: "Gujarat",
  karnataka: "Karnataka",
  madhya_pradesh: "Madhya Pradesh",
  maharashtra: "Maharashtra",
  punjab: "Punjab",
  rajasthan: "Rajasthan",
  uttar_pradesh: "Uttar Pradesh",
};

const EquipmentPostingPage = ({ onNavigate, screen = "post" }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [listingIntent, setListingIntent] = useState("Rent");
  const [condition, setCondition]         = useState("Brand New");
  const [availableNow, setAvailableNow]   = useState(true);
  const [category, setCategory]           = useState("");
  const [priceMin, setPriceMin]           = useState("");
  const [priceMax, setPriceMax]           = useState("");
  const [mainPhoto, setMainPhoto]         = useState(null);
  const [extraPhotos, setExtraPhotos]     = useState([]);
  const [dragOver, setDragOver]           = useState(false);
  const [state, setState]                 = useState("");
  const [district, setDistrict]           = useState("");
  const [customState, setCustomState]     = useState("");
  const [customDistrict, setCustomDistrict] = useState("");
  const [locationToast, setLocationToast] = useState("");

  const mainInputRef  = useRef();
  const extraInputRef = useRef();

  const isOtherState = state === "other";
  const districts    = ALL_DISTRICTS[state] || [];

  const showToast = (msg) => {
    setLocationToast(msg);
    setTimeout(() => setLocationToast(""), 3000);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) { showToast(t("geolocationNotSupported")); return; }
    showToast(t("detectingLocation"));
    navigator.geolocation.getCurrentPosition(
      () => showToast(t("locationDetected")),
      () => showToast(t("locationFailed"))
    );
  };

  const readFile = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res({ url: e.target.result, name: file.name });
      reader.readAsDataURL(file);
    });

  const handleMainFiles  = async (files) => { if (!files?.length) return; setMainPhoto(await readFile(files[0])); };
  const handleExtraFiles = async (files) => {
    if (!files?.length) return;
    const newPhotos = await Promise.all(Array.from(files).map(readFile));
    setExtraPhotos((prev) => [...prev, ...newPhotos].slice(0, 4));
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    if (!mainPhoto) handleMainFiles(e.dataTransfer.files);
    else handleExtraFiles(e.dataTransfer.files);
  };

  return (
    <div className="bg-gray-50 min-h-screen" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      <Sidebar screen={screen} onNavigate={onNavigate} />

      <div className="min-w-0 py-5 px-5" style={{ marginLeft: "76px" }}>
        <div className="flex gap-6">

          {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
          <div className="flex-1 min-w-0">

            {/* Media Gallery */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">{t("mediaGallery")}</h2>

              <input ref={mainInputRef}  type="file" accept="image/*"         className="hidden" onChange={(e) => handleMainFiles(e.target.files)} />
              <input ref={extraInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleExtraFiles(e.target.files)} />

              <div className="flex gap-3 items-start">
                <div
                  onClick={() => !mainPhoto && mainInputRef.current.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all relative overflow-hidden flex-shrink-0 ${
                    mainPhoto
                      ? "border-green-400 bg-white cursor-default"
                      : "border-green-300 bg-green-50 cursor-pointer hover:bg-green-100"
                  } ${dragOver ? "border-green-600 scale-105" : ""}`}
                  style={{ width: "170px", height: "148px" }}
                >
                  {mainPhoto ? (
                    <>
                      <img src={mainPhoto.url} alt="main" className="w-full h-full object-cover" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setMainPhoto(null); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center z-10"
                      >
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-current">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); mainInputRef.current.click(); }}
                        className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs py-1 text-center"
                      >
                        {t("changePhoto")}
                      </button>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-10 h-10 text-green-600 mb-2 fill-current">
                        <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                      </svg>
                      <span className="text-sm text-green-700 font-medium">{t("uploadMainPhoto")}</span>
                      <span className="text-xs text-green-500 mt-1 text-center px-3">{t("dragDropOrClick")}</span>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  {extraPhotos.map((photo, i) => (
                    <div
                      key={i}
                      className="rounded-lg overflow-hidden border border-gray-200 relative group flex-shrink-0"
                      style={{ width: "72px", height: "70px" }}
                    >
                      <img src={photo.url} alt="" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setExtraPhotos((p) => p.filter((_, idx) => idx !== i))}
                        className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full items-center justify-center hidden group-hover:flex"
                      >
                        <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-current">
                          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  {extraPhotos.length < 4 && (
                    <div
                      onClick={() => extraInputRef.current.click()}
                      className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 flex-shrink-0"
                      style={{ width: "72px", height: "70px" }}
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400 fill-current">
                        <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                {mainPhoto
                  ? `1 main + ${extraPhotos.length} additional photo${extraPhotos.length !== 1 ? "s" : ""}`
                  : t("noPhotosYet")}
              </p>
            </div>

            {/* Basic Details */}
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">{t("basicDetails")}</h2>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t("equipmentName")}</label>
                  <input
                    type="text"
                    placeholder={t("equipmentNamePlaceholder")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t("category")}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-500 bg-white"
                  >
                    <option value="">{t("selectCategory")}</option>
                    {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t("brand")}</label>
                  <input
                    type="text"
                    placeholder={t("brandPlaceholder")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">{t("modelYear")}</label>
                  <input
                    type="text"
                    placeholder={t("modelYearPlaceholder")}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">{t("fullDescription")}</label>
                <textarea
                  rows={6}
                  placeholder={t("fullDescriptionPlaceholder")}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500 resize-none bg-white"
                />
              </div>
            </div>

          </div>

          {/* ══ RIGHT COLUMN ═════════════════════════════════════════ */}
          <div className="flex-1 min-w-0">

            {/* Equipment Condition */}
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t("equipmentCondition")}
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Brand New", t("brandNew")],
                  ["New", t("conditionNew")],
                  ["Good", t("conditionGood")],
                  ["Used", t("conditionUsed")],
                ].map(([val, label]) => (
                  <label key={val} onClick={() => setCondition(val)} className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${condition === val ? "border-green-600" : "border-gray-300"}`}>
                      {condition === val && <div className="w-2 h-2 rounded-full bg-green-600" />}
                    </div>
                    <span className="text-xs text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Listing Intent */}
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t("listingIntent")}
              </h2>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {[
                  ["Rent", t("intentRent")],
                  ["Sell", t("intentSell")],
                  ["Both", t("intentBoth")],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    onClick={() => setListingIntent(val)}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      listingIntent === val ? "bg-green-700 text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price / Day */}
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {t("pricePerDay")}
              </h2>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">{t("perMin")}</label>
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white focus-within:border-green-500">
                    <span className="pl-2 text-sm text-gray-400">₹</span>
                    <input
                      type="number" min="0" step="0.01" value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 px-1.5 py-2 text-sm text-gray-700 bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">{t("perMax")}</label>
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white focus-within:border-green-500">
                    <span className="pl-2 text-sm text-gray-400">₹</span>
                    <input
                      type="number" min="0" step="0.01" value={priceMax}
                      onChange={(e) => setPriceMax(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 px-1.5 py-2 text-sm text-gray-700 bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Storage Location */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {t("storageLocation")}
                </h2>
                <button
                  onClick={handleUseCurrentLocation}
                  className="text-xs text-green-700 font-medium hover:underline flex items-center gap-0.5"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  {t("useCurrent")}
                </button>
              </div>

              {locationToast && (
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 py-1.5 mb-2">
                  {locationToast}
                </p>
              )}

              <div className="flex gap-2 mb-2">
                <select
                  value={state}
                  onChange={(e) => { setState(e.target.value); setDistrict(""); setCustomState(""); setCustomDistrict(""); }}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 focus:outline-none bg-white"
                >
                  <option value="">{t("selectState")}</option>
                  {Object.entries(STATE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                  <option value="other">{t("otherTypeBelow")}</option>
                </select>

                {!isOtherState && districts.length > 0 ? (
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 focus:outline-none bg-white"
                  >
                    <option value="">{t("selectDistrict")}</option>
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={isOtherState ? t("typeDistrict") : t("selectDistrict")}
                    disabled={!isOtherState && !state}
                    value={isOtherState ? customDistrict : district}
                    onChange={(e) => isOtherState ? setCustomDistrict(e.target.value) : setDistrict(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 placeholder-gray-300 focus:outline-none focus:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                )}
              </div>

              {isOtherState && (
                <input
                  type="text"
                  placeholder={t("typeState")}
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  className="w-full mb-2 border border-green-300 rounded-lg px-2 py-2 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500"
                />
              )}

              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder={t("villageName")}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 placeholder-gray-300 focus:outline-none focus:border-green-500"
                />
                <input
                  type="text"
                  placeholder={t("pincode")}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 placeholder-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Map placeholder */}
              <div className="w-full h-24 bg-gray-100 rounded-xl overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: "linear-gradient(#b0c4a0 1px, transparent 1px), linear-gradient(90deg, #b0c4a0 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center shadow-md">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══ FULL-WIDTH BOTTOM SECTION ════════════════════════════ */}

        {/* Available Now toggle */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between mb-3 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-700">{t("availableNow")}</p>
            <p className="text-xs text-gray-400">{t("availableNowSub")}</p>
          </div>
          <button
            onClick={() => setAvailableNow(!availableNow)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${availableNow ? "bg-green-600" : "bg-gray-300"}`}
          >
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${availableNow ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-gray-500 mb-2">{t("contactInformation")}</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-700 fill-current">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <span className="text-sm text-gray-700 flex-1">
              +91 98765 43210{" "}
              <span className="text-xs text-gray-400 ml-1">{t("primaryNumber")}</span>
            </span>
            <button className="text-xs text-green-700 font-semibold border border-green-300 rounded-lg px-3 py-1 hover:bg-green-50">
              {t("verify")}
            </button>
          </div>
          <button className="mt-3 w-full text-sm text-green-700 font-medium flex items-center justify-center gap-1 hover:underline">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            {t("addAlternateNumber")}
          </button>
        </div>

        {/* Post Equipment button */}
        <button
          onClick={() => navigate("/post-success")}
          className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          {t("postEquipment")}
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
        <p className="text-center text-xs text-gray-400 mt-2 mb-4">
          {t("postingAgreement")}{" "}
          <span className="underline cursor-pointer">{t("termsOfService")}</span>{" "}
          {t("and")}{" "}
          <span className="underline cursor-pointer">{t("communityGuidelines")}</span>
        </p>

      </div>
    </div>
  );
};

export default EquipmentPostingPage;
