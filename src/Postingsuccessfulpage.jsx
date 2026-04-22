import H1 from "/H1.jpg";

const Postingsuccessfulpage = ({
  onViewPostings,
  onEditListing,
  onPostAnother,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 font-sans py-6 px-8">
      {/* Breadcrumb */}
      <div className="mb-3">
        <span className="text-sm text-green-700 font-medium cursor-pointer hover:underline flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
          </svg>
          Posting Successful
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden">

        {/* Success Banner */}
        <div className="bg-green-100 px-6 py-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mb-4 shadow-md">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-white fill-current">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Equipment Posted Successfully!
          </h2>
          <p className="text-base text-gray-500 mt-2">
            Your equipment is now live and visible to other farmers.
          </p>
        </div>

        {/* Equipment Card */}
        <div className="px-8 py-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Your Posted Equipment
          </h3>

          <div className="border border-gray-200 rounded-xl overflow-hidden flex shadow-sm">
            {/* Image */}
            <div className="relative w-72 flex-shrink-0 bg-white">
              <img
                src={H1}
                alt="KS 9300 Combine Harvester"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-green-700 text-white text-sm font-bold px-3 py-1 rounded">
                RENT
              </span>
              <div className="absolute bottom-3 left-3 bg-white/90 text-gray-700 text-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block" />
                Available Now
              </div>
            </div>

            {/* Details */}
            <div className="flex-1 px-8 py-6">
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                KS 9300 Combine Harvester
              </h4>

              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current text-gray-400 flex-shrink-0">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Pimpalgaon, Nashik, Maharashtra
              </p>

              {/* Grid */}
              <div className="grid grid-cols-4 gap-6 mb-5">
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Type</p>
                  <p className="text-base font-semibold text-gray-700">Combine Harvester</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Brand</p>
                  <p className="text-base font-semibold text-gray-700">Kfoo</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Model Year</p>
                  <p className="text-base font-semibold text-gray-700">2022</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 uppercase tracking-wide mb-1">Condition</p>
                  <p className="text-base font-semibold text-gray-700">Good</p>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Rent Price (Per Day)</p>
                  <p className="text-3xl font-bold text-gray-800">₹ 8,500</p>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <p>Pickup Fee: ₹400</p>
                  <p>Provider: ₹0.00</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 italic leading-relaxed">
                Well-maintained KS 9300 Combine Harvester. High performance and fuel efficient. Suitable for wheat, rice, and grain harvesting.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="mx-8 mb-6 bg-gray-50 rounded-xl px-6 py-4">
          <p className="text-base font-semibold text-gray-700 mb-1">What's Next?</p>
          <p className="text-sm text-gray-500">
            Interested renters will contact you soon. Stay active and respond quickly.
          </p>
        </div>

        {/* Buttons */}
        <div className="px-8 pb-8">
          <button
            onClick={onViewPostings}
            className="w-full bg-green-700 hover:bg-green-800 text-white font-semibold rounded-xl py-4 text-base transition-colors mb-3"
          >
            View My Postings
          </button>
          <div className="flex gap-4">
            <button
              onClick={onEditListing}
              className="flex-1 border border-gray-300 text-gray-700 font-medium rounded-xl py-3.5 text-base hover:bg-gray-50"
            >
              Edit Listing
            </button>
            <button
              onClick={onPostAnother}
              className="flex-1 border border-gray-300 text-gray-700 font-medium rounded-xl py-3.5 text-base hover:bg-gray-50"
            >
              Post Another
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Postingsuccessfulpage;