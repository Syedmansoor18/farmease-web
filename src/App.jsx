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

// Landing Page
const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <Vision />
    <CTA />
    <Footer />
  </>
);

// Equipment Flow
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

        <Route
          path="/"
          element={
            <Layout>
              <LandingPage />
            </Layout>
          }
        />
        <Route
          path="/signup"
          element={
            <Layout>
              <Signup />
            </Layout>
          }
        />
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/equipments"
          element={
            <Layout>
              <Equipment_Feed_and_Home />
            </Layout>
          }
        />

        <Route
          path="/equipment-detail"
          element={
            <Layout>
              <EquipmentFlow />
            </Layout>
          }
        />

        <Route
          path="/my-bookings"
          element={
            <Layout>
              <MyBookings />
            </Layout>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;