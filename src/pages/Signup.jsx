import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "../supabaseClient";

// ══ FULL INDIA DATA: ALL 28 STATES & 8 UTs ══════════════════
const ALL_DISTRICTS = {
  "Andhra Pradesh": ["Anantapur","Chittoor","East Godavari","Guntur","Krishna","Kurnool","Nellore","Prakasam","Srikakulam","Visakhapatnam","Vizianagaram","West Godavari","YSR Kadapa"],
  "Arunachal Pradesh": ["Anjaw","Changlang","Dibang Valley","East Kameng","East Siang","Kamle","Kra Daadi","Kurung Kumey","Lepa Rada","Lohit","Longding","Lower Dibang Valley","Lower Siang","Lower Subansiri","Namsai","Pakke Kessang","Papum Pare","Shi Yomi","Siang","Tawang","Tirap","Upper Siang","Upper Subansiri","West Kameng","West Siang"],
  "Assam": ["Baksa","Barpeta","Biswanath","Bongaigaon","Cachar","Charaideo","Chirang","Darrang","Dhemaji","Dhubri","Dibrugarh","Dima Hasao","Goalpara","Golaghat","Hailakandi","Hojai","Jorhat","Kamrup","Kamrup Metropolitan","Karbi Anglong","Karimganj","Kokrajhar","Lakhimpur","Majuli","Morigaon","Nagaon","Nalbari","Sivasagar","Sonitpur","South Salmara-Mankachar","Tinsukia","Udalguri","West Karbi Anglong"],
  "Bihar": ["Araria","Arwal","Aurangabad","Banka","Begusarai","Bhagalpur","Bhojpur","Buxar","Darbhanga","East Champaran","Gaya","Gopalganj","Jamui","Jehanabad","Kaimur","Katihar","Khagaria","Kishanganj","Lakhisarai","Madhepura","Madhubani","Munger","Muzaffarpur","Nalanda","Nawada","Patna","Purnia","Rohtas","Saharsa","Samastipur","Saran","Sheikhpura","Sheohar","Sitamarhi","Siwan","Supaul","Vaishali","West Champaran"],
  "Chhattisgarh": ["Balod","Baloda Bazar","Balrampur","Bastar","Bemetara","Bijapur","Bilaspur","Dantewada","Dhamtari","Durg","Gariaband","Gaurela-Pendra-Marwahi","Janjgir-Champa","Jashpur","Kabirdham","Kanker","Kondagaon","Korba","Koriya","Mahasamund","Mungeli","Narayanpur","Raigarh","Raipur","Rajnandgaon","Sukma","Surajpur","Surguja"],
  "Goa": ["North Goa","South Goa"],
  "Gujarat": ["Ahmedabad","Amreli","Anand","Banaskantha","Bharuch","Bhavnagar","Botad","Chhota Udepur","Dahod","Dang","Devbhumi Dwarka","Gandhinagar","Gir Somnath","Jamnagar","Junagadh","Kheda","Kutch","Mahisagar","Mehsana","Morbi","Narmada","Navsari","Panchmahal","Patan","Porbandar","Rajkot","Sabarkantha","Surat","Surendranagar","Tapi","Vadodara","Valsad"],
  "Haryana": ["Ambala","Bhiwani","Charkhi Dadri","Faridabad","Fatehabad","Gurugram","Hisar","Jhajjar","Jind","Kaithal","Karnal","Kurukshetra","Mahendragarh","Nuh","Palwal","Panchkula","Panipat","Rewari","Rohtak","Sirsa","Sonipat","Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur","Chamba","Hamirpur","Kangra","Kinnaur","Kullu","Lahaul and Spiti","Mandi","Shimla","Sirmaur","Solan","Una"],
  "Jharkhand": ["Bokaro","Chatra","Deoghar","Dhanbad","Dumka","East Singhbhum","Garhwa","Giridih","Godda","Gumla","Hazaribagh","Jamtara","Khunti","Koderma","Latehar","Lohardaga","Pakur","Palamu","Ramgarh","Ranchi","Sahibganj","Seraikela Kharsawan","Simdega","West Singhbhum"],
  "Karnataka": ["Bagalkot","Ballari","Belagavi","Bengaluru Rural","Bengaluru Urban","Bidar","Chamarajanagara","Chikkaballapur","Chikkamagaluru","Chitradurga","Dakshina Kannada","Davanagere","Dharwad","Gadag","Hassan","Haveri","Kalaburagi","Kodagu","Kolar","Koppal","Mandya","Mysuru","Raichur","Ramanagara","Shivamogga","Tumakuru","Udupi","Uttara Kannada","Vijayapura","Yadgir"],
  "Kerala": ["Alappuzha","Ernakulam","Idukki","Kannur","Kasaragod","Kollam","Kottayam","Kozhikode","Malappuram","Palakkad","Pathanamthitta","Thiruvananthapuram","Thrissur","Wayanad"],
  "Madhya Pradesh": ["Agar Malwa","Alirajpur","Anuppur","Ashoknagar","Balaghat","Barwani","Betul","Bhind","Bhopal","Burhanpur","Chhatarpur","Chhindwara","Damoh","Datia","Dewas","Dhar","Dindori","Guna","Gwalior","Harda","Hoshangabad","Indore","Jabalpur","Jhabua","Katni","Khandwa","Khargone","Mandla","Mandsaur","Morena","Narsinghpur","Neemuch","Panna","Raisen","Rajgarh","Ratlam","Rewa","Sagar","Satna","Sehore","Seoni","Shahdol","Shajapur","Sheopur","Shivpuri","Sidhi","Singrauli","Tikamgarh","Ujjain","Umaria","Vidisha"],
  "Maharashtra": ["Ahmednagar","Akola","Amravati","Aurangabad","Beed","Bhandara","Buldhana","Chandrapur","Dhule","Gadchiroli","Gondia","Hingoli","Jalgaon","Jalna","Kolhapur","Latur","Mumbai City","Mumbai Suburban","Nagpur","Nanded","Nandurbar","Nashik","Osmanabad","Palghar","Parbhani","Pune","Raigad","Ratnagiri","Sangli","Satara","Sindhudurg","Solapur","Thane","Wardha","Washim","Yavatmal"],
  "Manipur": ["Bishnupur","Chandel","Churachandpur","Imphal East","Imphal West","Jiribam","Kakching","Kamjong","Kangpokpi","Noney","Pherzawl","Senapati","Tamenglong","Tengnoupal","Thoubal","Ukhrul"],
  "Meghalaya": ["East Garo Hills","East Jaintia Hills","East Khasi Hills","North Garo Hills","Ri Bhoi","South Garo Hills","South West Garo Hills","South West Khasi Hills","West Garo Hills","West Jaintia Hills","West Khasi Hills"],
  "Mizoram": ["Aizawl","Champhai","Hnahthial","Khawzawl","Kolasib","Lawngtlai","Lunglei","Mamit","Saiha","Saitual","Serchhip"],
  "Nagaland": ["Dimapur","Kiphire","Kohima","Longleng","Mokokchung","Mon","Noklak","Peren","Phek","Tuensang","Wokha","Zunheboto"],
  "Odisha": ["Angul","Balangir","Balasore","Bargarh","Bhadrak","Boudh","Cuttack","Deogarh","Dhenkanal","Gajapati","Ganjam","Jagatsinghpur","Jajpur","Jharsuguda","Kalahandi","Kandhamal","Kendrapara","Kendujhar","Khordha","Koraput","Malkangiri","Mayurbhanj","Nabarangpur","Nayagarh","Nuapada","Puri","Rayagada","Sambalpur","Sonepur","Sundargarh"],
  "Punjab": ["Amritsar","Barnala","Bathinda","Faridkot","Fatehgarh Sahib","Fazilka","Ferozepur","Gurdaspur","Hoshiarpur","Jalandhar","Kapurthala","Ludhiana","Mansa","Moga","Muktsar","Pathankot","Patiala","Rupnagar","Sahibzada Ajit Singh Nagar","Sangrur","Shahid Bhagat Singh Nagar","Sri Muktsar Sahib","Tarn Taran"],
  "Rajasthan": ["Ajmer","Alwar","Banswara","Baran","Barmer","Bharatpur","Bhilwara","Bikaner","Bundi","Chittorgarh","Churu","Dausa","Dholpur","Dungarpur","Hanumangarh","Jaipur","Jaisalmer","Jalore","Jhalawar","Jhunjhunu","Jodhpur","Karauli","Kota","Nagaur","Pali","Pratapgarh","Rajsamand","Sawai Madhopur","Sikar","Sirohi","Sri Ganganagar","Tonk","Udaipur"],
  "Sikkim": ["East Sikkim","North Sikkim","South Sikkim","West Sikkim"],
  "Tamil Nadu": ["Ariyalur","Chengalpattu","Chennai","Coimbatore","Cuddalore","Dharmapuri","Dindigul","Erode","Kallakurichi","Kanchipuram","Kanyakumari","Karur","Krishnagiri","Madurai","Mayiladuthurai","Nagapattinam","Namakkal","Nilgiris","Perambalur","Pudukkottai","Ramanathapuram","Ranipet","Salem","Sivaganga","Tenkasi","Thanjavur","Theni","Thoothukudi","Tiruchirappalli","Tirunelveli","Tirupathur","Tiruppur","Tiruvallur","Tiruvannamalai","Tiruvarur","Vellore","Viluppuram","Virudhunagar"],
  "Telangana": ["Adilabad","Bhadradri Kothagudem","Hyderabad","Jagtial","Jangaon","Jayashankar Bhupalpally","Jogulamba Gadwal","Kamareddy","Karimnagar","Khammam","Kumuram Bheem Asifabad","Mahabubabad","Mahabubnagar","Mancherial","Medak","Medchal-Malkajgiri","Mulugu","Nagarkurnool","Nalgonda","Narayanpet","Nirmal","Nizamabad","Peddapalli","Rajanna Sircilla","Rangareddy","Sangareddy","Siddipet","Suryapet","Vikarabad","Wanaparthy","Warangal Rural","Warangal Urban","Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai","Gomati","Khowai","North Tripura","Sepahijala","South Tripura","Unakoti","West Tripura"],
  "Uttar Pradesh": ["Agra","Aligarh","Ambedkar Nagar","Amethi","Amroha","Auraiya","Ayodhya","Azamgarh","Baghpat","Bahraich","Ballia","Balrampur","Banda","Barabanki","Bareilly","Basti","Bhadohi","Bijnor","Budaun","Bulandshahr","Chandauli","Chitrakoot","Deoria","Etah","Etawah","Farrukhabad","Fatehpur","Firozabad","Gautam Buddha Nagar","Ghaziabad","Ghazipur","Gonda","Gorakhpur","Hamirpur","Hapur","Hardoi","Hathras","Jalaun","Jaunpur","Jhansi","Kannauj","Kanpur Dehat","Kanpur Nagar","Kasganj","Kaushambi","Kheri","Kushinagar","Lalitpur","Lucknow","Maharajganj","Mahoba","Mainpuri","Mathura","Mau","Meerut","Mirzapur","Moradabad","Muzaffarnagar","Pilibhit","Pratapgarh","Prayagraj","Rae Bareli","Rampur","Saharanpur","Sambhal","Sant Kabir Nagar","Shahjahanpur","Shamli","Shravasti","Siddharthnagar","Sitapur","Sonbhadra","Sultanpur","Unnao","Varanasi"],
  "Uttarakhand": ["Almora","Bageshwar","Chamoli","Champawat","Dehradun","Haridwar","Nainital","Pauri Garhwal","Pithoragarh","Rudraprayag","Tehri Garhwal","Udham Singh Nagar","Uttarkashi"],
  "West Bengal": ["Alipurduar","Bankura","Birbhum","Cooch Behar","Dakshin Dinajpur","Darjeeling","Hooghly","Howrah","Jalpaiguri","Jhargram","Kalimpong","Kolkata","Malda","Murshidabad","Nadia","North 24 Parganas","Paschim Bardhaman","Paschim Medinipur","Purba Bardhaman","Purba Medinipur","Purulia","South 24 Parganas","Uttar Dinajpur"],
  "Andaman and Nicobar Islands": ["Nicobar","North and Middle Andaman","South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli","Daman","Diu"],
  "Delhi": ["Central Delhi","East Delhi","New Delhi","North Delhi","North East Delhi","North West Delhi","Shahdara","South Delhi","South East Delhi","South West Delhi","West Delhi"],
  "Jammu and Kashmir": ["Anantnag","Bandipora","Baramulla","Budgam","Doda","Ganderbal","Jammu","Kathua","Kishtwar","Kulgam","Kupwara","Poonch","Pulwama","Rajouri","Ramban","Reasi","Samba","Shopian","Srinagar","Udhampur"],
  "Ladakh": ["Kargil","Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal","Mahe","Puducherry","Yanam"]
};

const Signup = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
    aadhaar: '', kisanId: '', state: '', district: '', village: '', pinCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "aadhaar") {
      const val = value.replace(/\D/g, "");
      if (val.length <= 12) setFormData({ ...formData, [name]: val });
      return;
    }
    if (name === "kisanId") {
      if (value.length <= 10) setFormData({ ...formData, [name]: value.toUpperCase() });
      return;
    }
    // RESET DISTRICT IF STATE CHANGES
    if (name === "state") {
      setFormData({ ...formData, state: value, district: "" });
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleFileClick = () => fileInputRef.current.click();
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => alert("Location Access Granted!"),
        () => alert("Location Denied.")
      );
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            aadhaar_number: formData.aadhaar,
            kisan_id: formData.kisanId,
            state: formData.state,
            district: formData.district,
            village: formData.village,
            pincode: formData.pinCode,
            is_verified: false
          }
        ]);

      if (profileError) throw new Error(`Profile Error: ${profileError.message}`);

      alert("Account created successfully ✅");
      navigate("/login");
    } catch (err) {
      alert(err.message);
    }
  };

  const currentDistricts = ALL_DISTRICTS[formData.state] || [];

  return (
    <div className="flex min-h-screen bg-white font-sans">
      {/* LEFT SIDE */}
      <div className="hidden lg:flex w-1/2 bg-[#006F1D] relative overflow-hidden">
        <img
          src="/signup-bg.png"
          alt="FarmEase Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2000&auto=format&fit=crop" }}
        />
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <div className="relative z-20 w-full h-full flex items-center justify-center p-20 text-center text-white">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-black leading-tight drop-shadow-xl">Empowering Digital <br/> Agriculture</h1>
            <p className="text-xl font-medium max-w-sm mx-auto opacity-90">Join thousands of farmers using smart technology to optimize yields.</p>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full lg:w-1/2 p-8 md:p-16 overflow-y-auto">
        <div className="max-w-xl mx-auto">
          <header className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black text-[#2D3432] mb-2">Create Your FarmEase Account</h2>
            <p className="text-[#59615F]">Provide your details to get started with smart farming solutions.</p>
          </header>

          <form className="space-y-8" onSubmit={handleSignupSubmit}>
            {/* Section 1: Basic Information */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#006F1D] font-bold">
                <span>👤</span><h3 className="text-[#2D3432]">Basic Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Full Name</label>
                  <input name="fullName" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="e.g. Ramesh Kumar" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Phone Number</label>
                  <input name="phone" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="+91 00000 00000" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Email Address</label>
                  <input name="email" type="email" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="ramesh@gmail.com" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Password</label>
                  <input type="password" name="password" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="********" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Confirm Password</label>
                  <input type="password" name="confirmPassword" onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="********" required />
                </div>
              </div>
            </div>

            {/* Section 2: Identity Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 text-[#006F1D] font-bold">
                <span>🆔</span><h3 className="text-[#2D3432]">Identity Details</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Aadhaar (12 Digits)</label>
                  <input name="aadhaar" value={formData.aadhaar} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="1234 5678 9012" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Kisan ID</label>
                  <input name="kisanId" value={formData.kisanId} onChange={handleChange} className="w-full bg-[#F1F4F2] border-none rounded-xl px-4 py-3 focus:ring-2 focus:ring-[#006F1D]" placeholder="KID-123456" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-[#2D3432] mb-1">Upload Aadhaar Card</label>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".jpg,.png,.pdf" />
                  <div onClick={handleFileClick} className="border-2 border-dashed border-[#DDE4E1] rounded-2xl p-6 text-center bg-[#F1F4F2]/50 hover:bg-[#F1F4F2] cursor-pointer transition-all">
                    {fileName ? <p className="text-[#006F1D] font-bold">✅ {fileName}</p> : <p className="text-sm text-[#59615F]">Drop files here or <span className="text-[#006F1D] font-bold underline">browse</span></p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Location Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-[#006F1D] font-bold"><span>📍</span><h3 className="text-[#2D3432]">Location Information</h3></div>
                <button type="button" onClick={handleLocation} className="text-[10px] font-bold text-[#006F1D] bg-[#006F1D]/10 px-3 py-1.5 rounded-full uppercase">Use Current Location</button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select name="state" value={formData.state} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" required>
                  <option value="">Select State</option>
                  {Object.keys(ALL_DISTRICTS).map(state => <option key={state} value={state}>{state}</option>)}
                </select>
                <select name="district" value={formData.district} onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" required disabled={!formData.state}>
                  <option value="">Select District</option>
                  {currentDistricts.map(dist => <option key={dist} value={dist}>{dist}</option>)}
                </select>
                <input name="village" onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" placeholder="Village / City" required />
                <input name="pinCode" onChange={handleChange} className="bg-[#F1F4F2] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#006F1D]" placeholder="PinCode" required />
              </div>
            </div>

            <div className="pt-4 space-y-4 text-center lg:text-left">
              <button type="submit" className="w-full bg-[#006F1D] hover:bg-green-800 text-white font-black py-4 rounded-full shadow-lg transition-all active:scale-95">
                Create Account
              </button>
              <p className="text-sm font-bold text-[#59615F]">
                Already have an account? <span onClick={() => navigate('/login')} className="text-[#006F1D] underline cursor-pointer font-bold">Login</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;