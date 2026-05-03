import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./Context/LanguageContext"; // 🚨 Fixed capital 'C'

// ─── Landing Page Components ──────────────────────────────────────────────────
import Hero from "./components/Hero";
import Features from "./components/Features";
import Vision from "./components/Vision";
import CTA from "./components/CTA";
import Footer from "./components/Footer";

// ─── Auth Pages ───────────────────────────────────────────────────────────────
import Signup from "./pages/Signup";
import Login from "./pages/Login";

// ─── Main App Pages ───────────────────────────────────────────────────────────
// 🚨 Fixed all capital 'P's to lowercase 'p's for the pages folder
import Home from "./pages/Home";
import SearchScreen from "./pages/SearchScreen";
import Marketplace from "./pages/Marketplace";
import EquipmentDetailPage from "./pages/EquipmentDetailPage";
import PaymentPage from "./pages/PaymentPage";
import ListEquipment from "./pages/ListEquipment";
import PostSuccess from "./pages/PostSuccess";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notificatins"; // (Note: typo in your file name 'Notificatins', left as is to not break it!)
import BookingSuccess from "./pages/BookingSuccess";
import LanguagePage from "./pages/LanguagePage";
import SavedEquipment from "./pages/SavedEquipment";
import MyBookings from "./pages/MyBookings";
import MyPostings from "./pages/MyPostings";

// ─── Landing Page ─────────────────────────────────────────────────────────────
const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <Vision />
    <CTA />
    <Footer />
  </>
);

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    // ✅ PERFECTLY WRAPPED! This fixes the SearchScreen crash.
    <LanguageProvider>
      <BrowserRouter>
        <Routes>

          {/* Landing & Auth */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Main App */}
          <Route path="/home" element={<Home />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/search" element={<SearchScreen />} />
          <Route path="/equipment-detail" element={<EquipmentDetailPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/list-equipment" element={<ListEquipment />} />
          <Route path="/post-success" element={<PostSuccess />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/booking-success" element={<BookingSuccess />} />
          <Route path="/language" element={<LanguagePage />} />
          <Route path="/saved-equipment" element={<SavedEquipment />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/my-postings" element={<MyPostings />} />
          <Route path="/hero" element={<Hero />} />

        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}