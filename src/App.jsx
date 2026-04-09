import Hero from './components/Hero';
import Features from './components/Features';
import Vision from './components/Vision';
import CTA from './components/CTA';     // Import the banner
import Footer from './components/Footer'; // Import the footer

function App() {
  return (
    <div className="w-full min-h-screen bg-[#F1F4F2] font-sans antialiased overflow-x-hidden">
      <Hero />
      <Features />
      <Vision />
      <CTA />     {/* Add it here */}
      <Footer />  {/* Add it here */}
    </div>
  );
}

export default App;