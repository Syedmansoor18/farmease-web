import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    identifier: '', // Phone or Email
    password: ''
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // --- NEW BACKEND CONNECTION LOGIC ---
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (data.success) {
        // Display the congratulations message from the backend
        alert(data.message);
        // In the next step, we will navigate to the real dashboard
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error connecting to backend:", error);
      alert("Backend server is not running! Make sure to run 'npm run dev' in your farmease-backend folder.");
    }
  };
  // ------------------------------------

  return (
    <div className="flex min-h-screen bg-white font-sans">

      {/* LEFT SIDE: Light Sage Background with Features Checklist */}
      <div className="hidden lg:flex w-1/2 bg-[#E9F0EC] flex-col justify-center p-20">
        <div className="max-w-md">
          <h1 className="text-[#1A4D2E] text-5xl font-bold mb-6">Welcome Back</h1>
          <p className="text-[#59615F] text-xl mb-12 leading-relaxed">
            Login to access your farming dashboard and manage equipment rentals efficiently.
          </p>

          <ul className="space-y-6">
            {[
              "Browse equipment by category",
              "Affordable rental with flexible duration",
              "Verified farmers & trusted service",
              "Easy booking and secure payments"
            ].map((item, index) => (
              <li key={index} className="flex items-center space-x-4 text-[#2D3432] font-semibold text-lg">
                <span className="text-[#1A4D2E] text-2xl font-bold">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="max-w-md w-full">
          <header className="text-center mb-12">
            <h2 className="text-[#1A4D2E] text-4xl font-black mb-3">Login To FarmEase</h2>
            <p className="text-[#59615F] font-medium">Enter your credentials to get started.</p>
          </header>

          {/* ADDED handleLoginSubmit HERE */}
          <form className="space-y-8" onSubmit={handleLoginSubmit}>

            {/* Identifier Input */}
            <div>
              <label className="block text-sm font-bold text-[#2D3432] mb-3">Phone Number / Email Address</label>
              <input
                name="identifier"
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="+91 00000 00000"
                required
              />
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-bold text-[#2D3432] mb-3">Password</label>
              <input
                type="password"
                name="password"
                onChange={handleChange}
                className="w-full bg-[#E9F0EC]/60 border-none rounded-xl px-5 py-4 focus:ring-2 focus:ring-[#1A4D2E] outline-none placeholder:text-gray-400"
                placeholder="********"
                required
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input type="checkbox" className="accent-[#1A4D2E] w-4 h-4" />
                <span className="text-sm font-bold text-[#1A4D2E]">Remember Me</span>
              </label>
              <span className="text-sm font-bold text-[#1A4D2E] hover:underline cursor-pointer">
                Forgot Password?
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#1A4D2E] hover:bg-[#143B23] text-white font-black py-4 rounded-full shadow-lg shadow-[#1A4D2E]/20 transition-all active:scale-95 text-lg"
            >
              Login
            </button>

            {/* Switch to Signup */}
            <p className="text-center text-sm font-bold text-[#59615F] pt-4">
              Don’t have an account? <span onClick={() => navigate('/signup')} className="text-[#1A4D2E] underline cursor-pointer hover:text-green-800">Sign Up</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;