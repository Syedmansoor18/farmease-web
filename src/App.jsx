  import { useState } from "react";
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

          {/* Route for the Signup Page */}
          <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            {/* Route for equipment Page */}
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    );
  }

  export default App;