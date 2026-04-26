  /*import { useState } from "react";
  import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

  import Hero from './components/Hero';
  import Features from './components/Features';
  import Vision from './components/Vision';
  import CTA from './components/CTA';
  import Footer from './components/Footer';

  import Signup from "./pages/Signup.jsx";
  import Login from "./pages/Login.jsx";
  import EquipmentPage from "./pages/EquipmentPage";

  import EquipmentDetailPage from "./EquipmentDetailPage.jsx";
  import PaymentPage from "./PaymentPage.jsx";
  import MyBookings from "./MyBookings.jsx";

  import Layout from "./components/Layout";

  import Profile from "./Profile";
  import Postingsuccessfulpage from "./Postingsuccessfulpage";
  import EquipmentPostingPage from "./EquipmentPostingPage";
  import Home from "./pages/Home.jsx";

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

  // ─── Equipment Detail + Payment Flow ──────────────────────────────────────────
  const EquipmentFlow = () => {
    const [page, setPage] = useState("equipment");
    return page === "equipment"
      ? <EquipmentDetailPage onBookNow={() => setPage("payment")} />
      : <PaymentPage onBack={() => setPage("equipment")} />;
  };

  // ─── Posting Flow (Profile → Post → Success) ──────────────────────────────────
  const PostingFlow = () => {
    const [screen, setScreen] = useState("profile");

    const navigate = (s) => {
      if (s === "home") return;
      setScreen(s);
    };

    if (screen === "profile")
      return <Profile screen="profile" onNavigate={navigate} />;

    if (screen === "success")
      return (
        <Postingsuccessfulpage
          screen="success"
          onNavigate={navigate}
          onEditListing={() => setScreen("post")}
          onPostAnother={() => setScreen("post")}
        />
      );

    if (screen === "post")
      return (
        <EquipmentPostingPage
          screen="post"
          onNavigate={navigate}
          onPost={() => setScreen("success")}
        />
      );

    return null;
  };

  // ─── Main App ─────────────────────────────────────────────────────────────────
  function App() {
    return (
      <Router>
        <Routes>

          <Route path="/" element={<LandingPage />} />

          
          <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

         
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    );
  }

  export default App;*/

import { BrowserRouter, Routes, Route } from "react-router-dom";

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
import Home from "./Pages/Home";
import SearchScreen from "./Pages/SearchScreen";
import Marketplace from "./Pages/Marketplace";
import EquipmentDetailPage from "./Pages/EquipmentDetailPage";
import PaymentPage from "./Pages/PaymentPage";
import ListEquipment from "./Pages/ListEquipment";
import PostSuccess from "./Pages/PostSuccess";
import Profile from "./Pages/Profile";
import Notifications from "./Pages/Notificatins";
import BookingSuccess from "./Pages/BookingSuccess";
import LanguagePage from "./Pages/LanguagePage";
import SavedEquipment from "./Pages/SavedEquipment";
import MyBookings from "./Pages/MyBookings";
import MyPostings from "./Pages/MyPostings";

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
  );
}