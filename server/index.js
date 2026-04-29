const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

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