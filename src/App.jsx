import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import Vision from './components/Vision';
import CTA from './components/CTA';
import Footer from './components/Footer';
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Equipment_Feed_and_Home from './Dashboard/Equipment_Feed_and_Home.jsx';


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
          <Route path="/equipments" element={<Equipment_Feed_and_Home />} />
      </Routes>
    </Router>
  );
}

export default App;