import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import Vision from './components/Vision';
<<<<<<< Updated upstream
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
=======
import CTA from './components/CTA';     // Import the banner
import Footer from './components/Footer'; // Import the footer
import Equipment_Feed_and_Home from './Pages/Equipment_Feed_and_Home.jsx';

function App() {
  return (
    <div className="w-full min-h-screen bg-[#F1F4F2] font-sans antialiased overflow-x-hidden">
      <Hero/>
      {/* <Equipment_Feed_and_Home /> */}
      <Features />
      <Vision />
      <CTA />     Add it here
      <Footer />  {/* Add it here */}
    </div>
>>>>>>> Stashed changes
  );
}

export default App;