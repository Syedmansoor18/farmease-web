import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom"; 
import Sidebar from "../components/Sidebar";
import { supabase } from "../supabaseClient"; // Adjust path if needed
// 🚨 IMPORTING OUR NEW DATA STORE:
import { INDIA_DATA, STATE_NAMES } from "../data/indianStates";

const ALL_CATEGORIES = [
  "Tractor","Harvester","Combine Harvester","Rotavator","Cultivator",
  "Plough","Disc Harrow","Seed Drill","Sprayer","Irrigation Pump",
  "Power Tiller","Thresher","Reaper","Baler","Transplanter",
  "Laser Land Leveller","Mulcher","Shredder","Tiller","Water Tanker",
];

/* ─── Main Page ───────────────────────────────────────────────── */
const EquipmentPostingPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const editData = location.state || {};

  // 🚨 THE CRITICAL NEW STATE: Capture the DB ID if we are editing
  const [recordId, setRecordId]           = useState(editData.id || null);

  const [listingIntent, setListingIntent] = useState(editData.listingIntent || "Rent");
  const [condition, setCondition]         = useState(editData.condition || "Brand New");
  const [availableNow, setAvailableNow]   = useState(editData.availableNow ?? true);
  const [category, setCategory]           = useState(editData.category || "");
  const [priceMin, setPriceMin]           = useState(editData.priceMin || "");
  const [priceMax, setPriceMax]           = useState(editData.priceMax || "");
  const [mainPhoto, setMainPhoto]         = useState(editData.mainPhoto || null);
  const [extraPhotos, setExtraPhotos]     = useState(editData.extraPhotos || []);
  const [dragOver, setDragOver]           = useState(false);
  
  const [state, setState]                 = useState(editData.state || "");
  const [district, setDistrict]           = useState(editData.district || "");
  const [customState, setCustomState]     = useState(editData.customState || "");
  const [customDistrict, setCustomDistrict] = useState(editData.customDistrict || "");
  
  const [equipmentName, setEquipmentName] = useState(editData.equipmentName || "");
  const [brand, setBrand]                 = useState(editData.brand || "");
  const [modelYear, setModelYear]         = useState(editData.modelYear || "");
  const [description, setDescription]     = useState(editData.description || "");
  const [village, setVillage]             = useState(editData.village || "");
  const [pincode, setPincode]             = useState(editData.pincode || "");
  
  const [locationToast, setLocationToast] = useState("");
  const [isSubmitting, setIsSubmitting]   = useState(false);

  const mainInputRef  = useRef();
  const extraInputRef = useRef();

  // 🚨 DYNAMIC DISTRICT LOOKUP
  const isOtherState = state === "other";
  const districts = state && !isOtherState ? INDIA_DATA[state] || [] : [];

  const showToast = (msg) => {
    setLocationToast(msg);
    setTimeout(() => setLocationToast(""), 3000);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) { showToast("Geolocation not supported."); return; }
    showToast("Detecting location...");
    navigator.geolocation.getCurrentPosition(
      () => showToast("Location detected!"),
      () => showToast("Could not detect. Please enter manually.")
    );
  };

 const readFile = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res({ url: e.target.result, name: file.name, rawFile: file }); // 🚨 Added rawFile: file
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

  // ─── DB SUBMISSION LOGIC ───
  const handleSubmit = async () => {
    setIsSubmitting(true);
    showToast(recordId ? "Updating listing..." : "Preparing listing...");

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in to post equipment.");

      const { data: farmerData, error: farmerError } = await supabase
        .from('farmers')
        .select('id')
        .eq('profile_id', user.id)
        .single();
        
      if (farmerError || !farmerData) throw new Error("Could not find your Farmer profile.");

      let dbCondition = 'good';
      if (condition === 'Brand New' || condition === 'New') dbCondition = 'excellent';
      if (condition === 'Used') dbCondition = 'fair';

      const fullDescription = `Brand: ${brand} | Model: ${modelYear}\n\n${description}\n\nListing Intent: ${listingIntent}`;

      // 🚨 CLOUD IMAGE UPLOAD LOGIC
      let finalImageUrl = editData.image_url || null; // Keep existing image if editing

      if (mainPhoto && mainPhoto.rawFile) {
        showToast("Uploading image to cloud...");
        const fileExt = mainPhoto.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`; // Organizes images by user ID folder

        const { error: uploadError } = await supabase.storage
          .from('equipment-images')
          .upload(filePath, mainPhoto.rawFile);

        if (uploadError) throw new Error("Image upload failed: " + uploadError.message);

        // Get the public URL for the database
        const { data: { publicUrl } } = supabase.storage
          .from('equipment-images')
          .getPublicUrl(filePath);

        finalImageUrl = publicUrl;
      }

      // Build the data payload
      const dbPayload = {
        owner_id: farmerData.id,
        name: equipmentName,
        type: category,
        description: fullDescription,
        price_per_day: parseFloat(priceMin) || 0,
        is_free: parseFloat(priceMin) === 0,
        location: village || 'Not specified',
        district: district || customDistrict,
        state: state === 'other' ? customState : state,
        pincode: pincode,
        is_available: availableNow,
        condition: dbCondition,
        image_url: finalImageUrl
      };

      let dbResponse;

      // 🚨 UPSERT LOGIC: If we have a recordId, UPDATE. Otherwise, INSERT.
      // We attach .select().single() so Supabase returns the ID of the new/updated row!
      if (recordId) {
        dbResponse = await supabase
          .from('equipment_list')
          .update(dbPayload)
          .eq('id', recordId)
          .select()
          .single();
      } else {
        dbResponse = await supabase
          .from('equipment_list')
          .insert([dbPayload])
          .select()
          .single();
      }

      if (dbResponse.error) throw dbResponse.error;
      
      const savedRecord = dbResponse.data; // The freshly saved row from Supabase
      
      // Update local state so if they click post again without leaving, it updates
      setRecordId(savedRecord.id); 

      showToast(recordId ? "Equipment updated successfully!" : "Equipment posted successfully!");

      // 🚨 Pass the NEW Database ID back to the success screen
      navigate("/post-success", { 
        state: {
          id: savedRecord.id, // THE MAGIC KEY
          equipmentName, category, brand, modelYear, condition, priceMin, priceMax, 
          village, pincode, district, customDistrict, state, customState, description, 
          listingIntent, availableNow, mainPhoto, extraPhotos,
          displayState: state === 'other' ? customState : state,
          displayDistrict: district || customDistrict
        } 
      });

    } catch (error) {
      console.error("Error posting equipment:", error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex" style={{ maxWidth: "100vw", overflowX: "hidden" }}>
      
      <Sidebar />

      <div className="flex-1 min-w-0 py-5 px-5 ml-20">
        <div className="flex gap-6">

          {/* ══ LEFT COLUMN ══════════════════════════════════════════ */}
          <div className="flex-1 min-w-0">

            {/* Media Gallery */}
            <div className="mb-5">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Media Gallery</h2>

              <input ref={mainInputRef}  type="file" accept="image/*"          className="hidden" onChange={(e) => handleMainFiles(e.target.files)} />
              <input ref={extraInputRef} type="file" accept="image/*" multiple  className="hidden" onChange={(e) => handleExtraFiles(e.target.files)} />

              <div className="flex gap-3 items-start">
                {/* Main photo drop-zone */}
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
                        Change Photo
                      </button>
                    </>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-10 h-10 text-green-600 mb-2 fill-current">
                        <path d="M19.35 10.04A7.49 7.49 0 0012 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 000 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z" />
                      </svg>
                      <span className="text-sm text-green-700 font-medium">Upload Main Photo</span>
                      <span className="text-xs text-green-500 mt-1 text-center px-3">Drag & Drop or Click</span>
                    </>
                  )}
                </div>

                {/* Extra thumbnails */}
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
                  : "No photos uploaded yet — click or drag an image above"}
              </p>
            </div>

            {/* Basic Details */}
            <div className="mb-4">
              <h2 className="text-sm font-semibold text-gray-700 mb-3">Basic Details</h2>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Equipment Name</label>
                  <input
                    type="text"
                    value={equipmentName}
                    onChange={(e) => setEquipmentName(e.target.value)}
                    placeholder="e.g. John Deere 5050E"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:border-green-500 bg-white"
                  >
                    <option value="">Select Category</option>
                    {ALL_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Brand</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Mahindra"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Model / Year</label>
                  <input
                    type="text"
                    value={modelYear}
                    onChange={(e) => setModelYear(e.target.value)}
                    placeholder="e.g. 2023 Edition"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500 bg-white"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="text-xs text-gray-500 mb-1 block">Full Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell potential buyers/renters about the history and maintenance of your equipment..."
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
                Equipment Condition
              </h2>
              <div className="grid grid-cols-2 gap-2">
                {["Brand New", "New", "Good", "Used"].map((c) => (
                  <label key={c} onClick={() => setCondition(c)} className="flex items-center gap-2 cursor-pointer">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        condition === c ? "border-green-600" : "border-gray-300"
                      }`}
                    >
                      {condition === c && <div className="w-2 h-2 rounded-full bg-green-600" />}
                    </div>
                    <span className="text-xs text-gray-700">{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Listing Intent */}
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Listing Intent
              </h2>
              <div className="flex rounded-lg overflow-hidden border border-gray-200">
                {["Rent", "Sell", "Both"].map((intent) => (
                  <button
                    key={intent}
                    onClick={() => setListingIntent(intent)}
                    className={`flex-1 py-2 text-xs font-medium transition-colors ${
                      listingIntent === intent
                        ? "bg-green-700 text-white"
                        : "bg-white text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {intent}
                  </button>
                ))}
              </div>
            </div>

            {/* Price / Day */}
            <div className="mb-5">
              <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Price/Day (₹)
              </h2>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Per Min</label>
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white focus-within:border-green-500">
                    <span className="pl-2 text-sm text-gray-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceMin}
                      onChange={(e) => setPriceMin(e.target.value)}
                      placeholder="0.00"
                      className="flex-1 px-1.5 py-2 text-sm text-gray-700 bg-transparent focus:outline-none w-full"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-400 mb-1 block">Per Max</label>
                  <div className="flex items-center border border-gray-200 rounded-lg bg-white focus-within:border-green-500">
                    <span className="pl-2 text-sm text-gray-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={priceMax}
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
                  Storage Location
                </h2>
                <button
                  onClick={handleUseCurrentLocation}
                  className="text-xs text-green-700 font-medium hover:underline flex items-center gap-0.5"
                >
                  <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                  </svg>
                  Use Current
                </button>
              </div>

              {locationToast && (
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-2 py-1.5 mb-2">
                  {locationToast}
                </p>
              )}

              {/* State + District */}
              <div className="flex gap-2 mb-2">
                <select
                  value={state}
                  onChange={(e) => { setState(e.target.value); setDistrict(""); setCustomState(""); setCustomDistrict(""); }}
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 focus:outline-none bg-white"
                >
                  <option value="">Select State</option>
                  {/* 🚨 USING INDIAN_STATES JSON DATA HERE */}
                  {STATE_NAMES.map((val) => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                  <option value="other">Other (type below)</option>
                </select>

                {!isOtherState && districts.length > 0 ? (
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 focus:outline-none bg-white"
                  >
                    <option value="">Select District</option>
                    {/* 🚨 USING INDIAN_STATES JSON DATA HERE */}
                    {districts.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={isOtherState ? "Type district..." : "Select District"}
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
                  placeholder="Type your state..."
                  value={customState}
                  onChange={(e) => setCustomState(e.target.value)}
                  className="w-full mb-2 border border-green-300 rounded-lg px-2 py-2 text-xs text-gray-700 placeholder-gray-300 focus:outline-none focus:border-green-500"
                />
              )}

              {/* Village + Pincode */}
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village Name"
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 placeholder-gray-300 focus:outline-none focus:border-green-500"
                />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Pincode"
                  className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-xs text-gray-600 placeholder-gray-300 focus:outline-none focus:border-green-500"
                />
              </div>

              {/* Map placeholder */}
              <div className="w-full h-24 bg-gray-100 rounded-xl overflow-hidden relative">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(#b0c4a0 1px, transparent 1px), linear-gradient(90deg, #b0c4a0 1px, transparent 1px)",
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
          {/* ══ END RIGHT COLUMN ══════════════════════════════════════ */}

        </div>

        {/* ══ FULL-WIDTH BOTTOM SECTION ════════════════════════════ */}

        {/* Available Now toggle */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 flex items-center justify-between mb-3 mt-4">
          <div>
            <p className="text-sm font-medium text-gray-700">Available Now</p>
            <p className="text-xs text-gray-400">Turn off to set future date</p>
          </div>
          <button
            onClick={() => setAvailableNow(!availableNow)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              availableNow ? "bg-green-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                availableNow ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Contact Information */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-4">
          <p className="text-xs text-gray-500 mb-2">Contact Information</p>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-4 h-4 text-green-700 fill-current">
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
              </svg>
            </div>
            <span className="text-sm text-gray-700 flex-1">
              +91 98765 43210{" "}
              <span className="text-xs text-gray-400 ml-1">Primary number</span>
            </span>
            <button className="text-xs text-green-700 font-semibold border border-green-300 rounded-lg px-3 py-1 hover:bg-green-50">
              Verify
            </button>
          </div>
          <button className="mt-3 w-full text-sm text-green-700 font-medium flex items-center justify-center gap-1 hover:underline">
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Alternate Number
          </button>
        </div>

        {/* Post Equipment button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full ${isSubmitting ? 'bg-green-400' : 'bg-green-700 hover:bg-green-800'} text-white font-semibold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-colors shadow-sm`}
        >
          {isSubmitting ? "Processing..." : (recordId ? "Update Equipment" : "Post Equipment")}
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
        <p className="text-center text-xs text-gray-400 mt-2 mb-4">
          By posting, you agree to Farmease's{" "}
          <span className="underline cursor-pointer">Terms of Service</span> and{" "}
          <span className="underline cursor-pointer">Community Guidelines</span>
        </p>

      </div>
    </div>
  );
};

export default EquipmentPostingPage;