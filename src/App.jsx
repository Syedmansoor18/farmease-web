import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import Vision from './components/Vision';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";

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

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Home/Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Route for the Signup Page */}
        <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;