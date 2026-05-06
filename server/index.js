require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Supabase Admin (Backend Only)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─── TEST ROUTE ───
app.get('/', (req, res) => {
  res.send('FarmEase Backend is Running Safely!');
});

// ─── API ROUTE: GET ALL EQUIPMENT (Securely) ───
app.get('/api/equipment', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('equipment_list')
      .select('*')
      .eq('is_available', true);

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// ─── API ROUTE: SEARCH EQUIPMENT (With Filters) ───
app.get('/api/search', async (req, res) => {
  const { query, mode, state, category } = req.query;

  try {
    let dbQuery = supabase
      .from('equipment_list')
      .select('*')
      .eq('is_available', true);

    // Filter by Rent/Buy logic based on the description string
    if (mode === "rent") dbQuery = dbQuery.ilike('description', '%Listing Intent: Rent%');
    if (mode === "buy") dbQuery = dbQuery.ilike('description', '%Listing Intent: Sell%');

    if (state && state !== "All States") dbQuery = dbQuery.eq('state', state);
    if (category && category !== "all") dbQuery = dbQuery.ilike('type', `%${category}%`);

    if (query) {
      dbQuery = dbQuery.or(`name.ilike.%${query}%,type.ilike.%${query}%,description.ilike.%${query}%`);
    }

    const { data, error } = await dbQuery;

    if (error) throw error;

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: GET USER'S POSTINGS ───
app.get('/api/my-postings', async (req, res) => {
  // 1. The frontend passes the auth user ID
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    // 2. Server securely looks up the Farmer Profile ID
    const { data: farmerData, error: farmerError } = await supabase
      .from('farmers')
      .select('id')
      .eq('profile_id', user_id)
      .single();

    if (farmerError || !farmerData) throw new Error("Farmer profile not found");

    // 3. Server fetches their equipment
    const { data: equipmentData, error: equipError } = await supabase
      .from('equipment_list')
      .select('*')
      .eq('owner_id', farmerData.id)
      .order('created_at', { ascending: false });

    if (equipError) throw equipError;

    // 4. Send it back to React
    res.json(equipmentData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: MARKETPLACE (Grouped & Formatted) ───
app.get('/api/marketplace', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('equipment_list')
      .select('*')
      .eq('is_available', true);

    if (error) throw error;

    // 🚨 NEW: Format the raw database rows to perfectly match the React UI
    const formattedData = data.map(item => ({
      ...item, 
      image: item.image_url, // Maps DB image_url to UI image
      price: `₹ ${item.price_per_day} / day`, // Formats the price nicely
      location: item.location || item.district, // Grabs the best location
      tag: Math.random() > 0.7 ? "HIGH_DEMAND" : null // Randomly tags some as high demand for the UI
    }));

    // Group the newly formatted data
    const marketplaceData = {
      tractors: formattedData.filter(item => item.type.toLowerCase().includes('tractor')),
      harvesting: formattedData.filter(item => item.type.toLowerCase().includes('harvester')),
      irrigation: formattedData.filter(item => item.type.toLowerCase().includes('pump') || item.type.toLowerCase().includes('irrigation')),
      others: formattedData.filter(item => {
        const type = item.type.toLowerCase();
        return !type.includes('tractor') && 
               !type.includes('harvester') && 
               !type.includes('pump') && 
               !type.includes('irrigation');
      })
    };

    res.json(marketplaceData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: POST/UPDATE EQUIPMENT ───
app.post('/api/equipment', async (req, res) => {
  try {
    const { recordId, user_id, ...equipmentData } = req.body;

    // 1. Securely find the Farmer ID using the Auth Token
    const { data: farmerData, error: farmerError } = await supabase
      .from('farmers')
      .select('id')
      .eq('profile_id', user_id)
      .single();

    if (farmerError || !farmerData) throw new Error("Farmer profile not found");

    equipmentData.owner_id = farmerData.id;

    let dbResponse;

    // 2. Upsert Logic (Update if ID exists, Insert if it doesn't)
    if (recordId) {
      dbResponse = await supabase
        .from('equipment_list')
        .update(equipmentData)
        .eq('id', recordId)
        .select()
        .single();
    } else {
      dbResponse = await supabase
        .from('equipment_list')
        .insert([equipmentData])
        .select()
        .single();
    }

    if (dbResponse.error) throw dbResponse.error;
    
    res.status(201).json({ data: dbResponse.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: DELETE EQUIPMENT ───
app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('equipment_list')
      .delete()
      .eq('id', id);

    if (error) throw error;
    
    res.status(200).json({ message: "Equipment deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: err.message });
  }
});


// ─── API ROUTE: SAVE A NEW BOOKING ───
app.post('/api/bookings', async (req, res) => {
  try {
    const b = req.body;
    
    // 🚨 STEP 1: Look up the real Farmer ID using profile_id
    const { data: farmerData, error: farmerError } = await supabase
      .from('farmers')
      .select('id') 
      .eq('profile_id', b.userId) // Looking at the correct column!
      .single();

    if (farmerError || !farmerData) {
      console.log("Lookup failed for Auth ID:", b.userId);
      return res.status(404).json({ error: "Could not find a registered farmer profile for this login." });
    }

    const realFarmerId = farmerData.id;

    // STEP 2: Calculate Dates
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + (b.rentalDays || 1));

    // STEP 3: Pack the extra UI data
    const extraNotes = JSON.stringify({
      equipmentName: b.equipmentName,
      imageUrl: b.imageUrl,
      transactionId: b.transactionId,
      deliveryMode: b.deliveryMode,
      isSelling: b.isSelling
    });

    // STEP 4: Save using the REAL Farmer ID
    const dbPayload = {
      farmer_id: realFarmerId, 
      equipment_id: b.equipmentId,
      total_price: b.totalAmount,
      start_date: startDate.toISOString(),
      end_date: endDate.toISOString(),
      status: b.status,
      notes: extraNotes 
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([dbPayload])
      .select();

    if (error) throw error;
    res.status(201).json({ message: "Booking saved successfully", data });
  } catch (err) {
    console.error("Error saving booking:", err);
    res.status(500).json({ error: err.message });
  }
});


// ─── API ROUTE: FETCH SAVED EQUIPMENT ───
app.get('/api/saved', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "User ID is required" });

    // This fetches the saved records AND joins the equipment data perfectly!
    const { data, error } = await supabase
      .from('saved_equipment')
      .select(`
        equipment_id,
        equipment_list (*)
      `)
      .eq('user_id', user_id);

    if (error) throw error;

    // Clean up the data so the frontend just gets a normal list of equipment
    const savedItems = data.map(item => item.equipment_list).filter(Boolean);
    
    res.status(200).json(savedItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: TOGGLE SAVED EQUIPMENT ───
app.post('/api/saved/toggle', async (req, res) => {
  try {
    const { user_id, equipment_id } = req.body;
    if (!user_id || !equipment_id) return res.status(400).json({ error: "Missing IDs" });

    // 1. Check if the user already saved this item
    const { data: existing, error: checkError } = await supabase
      .from('saved_equipment')
      .select('id')
      .eq('user_id', user_id)
      .eq('equipment_id', equipment_id)
      .maybeSingle(); // maybeSingle allows returning null without throwing an error

    if (checkError) throw checkError;

    if (existing) {
      // 2. It exists! That means the user clicked a RED heart to un-save it.
      const { error: deleteError } = await supabase
        .from('saved_equipment')
        .delete()
        .eq('id', existing.id);
        
      if (deleteError) throw deleteError;
      return res.status(200).json({ action: 'removed' });
      
    } else {
      // 3. It doesn't exist! The user clicked an EMPTY heart to save it.
      const { error: insertError } = await supabase
        .from('saved_equipment')
        .insert([{ user_id, equipment_id }]);
        
      if (insertError) throw insertError;
      return res.status(200).json({ action: 'added' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: FETCH USER PROFILE ───
app.get('/api/profile', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "User ID is required" });

    // Fetch the custom profile data for this user
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user_id)
      .single(); // Grab the one specific row

    // If the user exists in Auth but doesn't have a profile row yet, just return an empty object
    if (error && error.code === 'PGRST116') {
      return res.status(200).json({});
    }
    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: SAVE/UPDATE USER PROFILE ───
app.post('/api/profile', async (req, res) => {
  try {
    const { 
      id, 
      full_name, 
      phone, 
      location, 
      aadhaar_number, 
      kisan_id, 
      aadhaar_verified, 
      kisan_verified 
    } = req.body;

    if (!id) return res.status(400).json({ error: "User ID is required" });

    // 'upsert' will create a new row if the ID doesn't exist, or update it if it does!
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id, // This is the user.id from Supabase Auth
        full_name,
        phone,
        location,
        aadhaar_number,
        kisan_id,
        aadhaar_verified,
        kisan_verified
      })
      .select();

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: FETCH A USER'S BOOKINGS ───
app.get('/api/bookings', async (req, res) => {
  try {
    const { user_id } = req.query;
    if (!user_id) return res.status(400).json({ error: "User Auth ID is required" });

    // 1. Get Farmer ID
    const { data: farmerData } = await supabase
      .from('farmers')
      .select('id')
      .eq('profile_id', user_id)
      .single();

    if (!farmerData) return res.status(200).json([]);

    // 2. Fetch Bookings
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('farmer_id', farmerData.id)
      .order('created_at', { ascending: false });

    if (bookingsError) throw bookingsError;

    // 3. Staple Equipment Data (Images/Names)
    const equipmentIds = bookingsData.map(b => b.equipment_id);
    const { data: equipmentData } = await supabase
      .from('equipment_list')
      .select('*')
      .in('id', equipmentIds);

    const eqMap = {};
    if (equipmentData) {
      equipmentData.forEach(eq => { eqMap[eq.id] = eq; });
    }

    // 4. Return standard object for Frontend[cite: 2]
    const result = bookingsData.map(row => {
      const eq = eqMap[row.equipment_id] || {};
      return {
        id: row.id,
        status: row.status,
        totalAmount: row.total_price,
        createdAt: row.created_at,
        equipmentName: eq.name || "Equipment",
        imageUrl: eq.image_url || "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400",
        fullEquipment: eq
      };
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── API ROUTE: CREATE BOOKING (Fixed ID return for Notification) ───
app.post('/api/bookings/create', async (req, res) => {
  try {
    const { renter_id, renter_name, equipment_id, total_amount, start_date, end_date, image_url } = req.body;

    const { data: farmerRecord } = await supabase.from('farmers').select('id').eq('profile_id', renter_id).single();
    if (!farmerRecord) throw new Error("Farmer profile not found.");

    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        farmer_id: farmerRecord.id,
        equipment_id,
        total_price: total_amount,
        start_date,
        end_date,
        status: 'pending',
        image_url 
      }])
      .select('id') // 🚨 Returns the ID immediately
      .single();

    if (bookingError) throw bookingError;

    const { data: equipment } = await supabase.from('equipment_list').select('name, owner_id').eq('id', equipment_id).single();
    const { data: ownerRecord } = await supabase.from('farmers').select('profile_id').eq('id', equipment.owner_id).single();

    // Create Notification using the correct type 'request' to match your UI
    await supabase.from('notifications').insert([{
      user_id: ownerRecord.profile_id,
      type: 'request', // 🚨 Must be 'request' for Accept/Reject buttons to show
      title: 'New Rental Request!',
      message: `${renter_name} wants to rent your ${equipment.name}.`,
      booking_id: newBooking.id
    }]);

    res.status(200).json({ success: true, booking_id: newBooking.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});