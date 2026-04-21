import { useState } from "react";

import img1 from "../public/T1.jpeg";
import img2 from "../public/T2.jpeg";
import img3 from "../public/T3.jpeg";
import img4 from "../public/T4.jpeg";
import img5 from "../public/T5.jpeg";

const IMAGES = [img1, img2, img3, img4, img5];

const SPECS = [
  { label: "Horsepower",   value: "57 HP" },
  { label: "Engine Hours", value: "1,200 hrs" },
  { label: "Model Year",   value: "2021" },
  { label: "Fuel Type",    value: "Diesel" },
];

export default function EquipmentDetailPage({ onBookNow }) {
  const [activeImg, setActiveImg] = useState(0);
  const [wishlist, setWishlist] = useState(false);

  return (
    <div >

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <span
          className="text-gray-600 cursor-pointer hover:underline"
          onClick={() => alert("Go to Tractors")}
        >
          &gt; Tractors
        </span>
        <span className="mx-1">&gt;</span>
        <span className="text-blue-500">Mahindra NOVO 605 DI</span>
      </nav>

      {/* Main Body */}
      <div className="flex flex-col md:flex-row gap-8">

        {/* LEFT — Image Gallery */}
        <div className="w-full md:w-80 shrink-0">
          <div className="rounded-xl overflow-hidden border border-gray-200 mb-3">
            <img
              src={IMAGES[activeImg]}
              alt="Equipment"
              className="w-full h-56 object-cover transition-opacity duration-200"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {IMAGES.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-14 h-12 rounded-md overflow-hidden border-2 transition-all duration-150 cursor-pointer
                  ${activeImg === i
                    ? "border-green-600 shadow-md"
                    : "border-gray-200 hover:border-green-400"
                  }`}
              >
                <img src={src} alt={`thumb-${i}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT — Details */}
        <div className="flex-1">

          <div className="flex gap-2 mb-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800 tracking-wide">
              RENT &amp; SELL
            </span>
            <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-800 tracking-wide">
              GOOD CONDITION
            </span>
          </div>

          <div className="flex items-start justify-between mb-1">
            <h1 className="text-2xl font-bold leading-tight">Mahindra Novo 605 DI</h1>
            <button
              onClick={() => setWishlist(!wishlist)}
              className="p-1 mt-1 cursor-pointer bg-transparent border-none"
              aria-label="Toggle wishlist"
            >
              <svg width="22" height="22" viewBox="0 0 24 24"
                fill={wishlist ? "#e53e3e" : "none"}
                stroke={wishlist ? "#e53e3e" : "#aaa"}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>

          <div className="flex items-center text-sm text-gray-500 mb-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#6b7280" className="mr-1">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Tumkur, Karnataka
          </div>

          <div className="flex items-baseline gap-5 mb-5">
            <span className="text-2xl font-bold text-gray-900">
              ₹800 <span className="text-sm font-normal text-gray-500">/day</span>
            </span>
            <span className="text-xl font-semibold text-gray-800">₹15,000</span>
          </div>

          <div className="flex gap-7 mb-6">
            <div>
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Owner</p>
              <p className="text-sm font-semibold text-gray-700">Ramesh Kumar</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Posted</p>
              <p className="text-sm font-semibold text-gray-700">2 days ago</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-400 tracking-widest uppercase">Status</p>
              <p className="text-sm font-semibold text-green-600">Available</p>
            </div>
          </div>

          {/* Contact Owner Button */}
          <button
            onClick={() => alert("Contact Owner clicked")}
            className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 rounded-lg mb-3 transition-colors duration-200 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
            Contact Owner
          </button>

          {/* Book Now Button — navigates to Payment page */}
          <button
            onClick={onBookNow}
            className="w-full flex items-center justify-center gap-2 border-2 border-green-700 text-green-700 hover:bg-green-700 hover:text-white font-semibold py-3 rounded-lg mb-6 transition-colors duration-200 cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
            </svg>
            Book Now
          </button>

          {/* Specs Card */}
          <div className="border border-gray-200 rounded-xl overflow-hidden">
            <h3 className="text-sm font-bold px-4 py-3 border-b border-gray-200 bg-white">
              Equipment Specifications
            </h3>
            {SPECS.map((s, i) => (
              <div
                key={i}
                className={`flex justify-between px-4 py-3 text-sm ${
                  i % 2 === 0 ? "bg-gray-50" : "bg-white"
                }`}
              >
                <span className="text-gray-500">{s.label}</span>
                <span className="font-semibold text-gray-800">{s.value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
