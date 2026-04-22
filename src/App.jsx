import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Hero from './components/Hero';
import Features from './components/Features';
import Vision from './components/Vision';
import CTA from './components/CTA';
import Footer from './components/Footer';

import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";

import Equipment_Feed_and_Home from './Dashboard/Equipment_Feed_and_Home.jsx';
import EquipmentDetailPage from "./EquipmentDetailPage.jsx";
import PaymentPage from "./PaymentPage.jsx";
import MyBookings from "./MyBookings.jsx";

import Layout from "./components/Layout";

import Profile from "./Profile";
import Postingsuccessfulpage from "./Postingsuccessfulpage";
import EquipmentPostingPage from "./EquipmentPostingPage";

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

        <Route
          path="/"
          element={<Layout><LandingPage /></Layout>}
        />

        <Route
          path="/signup"
          element={<Layout><Signup /></Layout>}
        />

        <Route
          path="/login"
          element={<Layout><Login /></Layout>}
        />

        <Route
          path="/equipments"
          element={<Layout><Equipment_Feed_and_Home /></Layout>}
        />

        <Route
          path="/equipment-detail"
          element={<Layout><EquipmentFlow /></Layout>}
        />

        <Route
          path="/my-bookings"
          element={<Layout><MyBookings /></Layout>}
        />

        <Route
          path="/profile"
          element={<PostingFlow />}
        />

      </Routes>
    </Router>
  );
}

export default App;