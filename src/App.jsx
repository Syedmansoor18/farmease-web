import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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



// This component represents your full Landing Page
const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <Vision />
    <CTA />
    <Footer />
  </>
);

// Equipment Detail + Payment flow (state-based navigation)
const EquipmentFlow = () => {
  const [page, setPage] = useState("equipment");

  return page === "equipment"
    ? <EquipmentDetailPage onBookNow={() => setPage("payment")} />
    : <PaymentPage onBack={() => setPage("equipment")} />;
};


function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home/Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Route for the other Page */}
        <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/equipments" element={<Equipment_Feed_and_Home />} />
          <Route path="/equipment-detail" element={<EquipmentFlow />} />
      </Routes>
    </Router>
  );
}

export default App;