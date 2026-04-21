import React from "react";

const bookings = [
    {
        id: 1,
        name: "John Deere 5075E Tractor",
        price: "₹ 800 / hour",
        date: "Booked on 10 May 2024",
        image: "https://assets.tractorguru.in/tractor-guru/tractors/john-deere-5075e.webp",
        status: "View Booking",
    },
    {
        id: 2,
        name: "Water Pump 5 HP",
        price: "₹ 300 / day",
        date: "Booked on 08 May 2024",
        image: "https://static1.industrybuying.com/products/pumps/water-pumps/domestic-monoblock-pump/PUM.DOM.77583173_1671019951530.webp",
        status: "View Booking",
    },
    {
        id: 3,
        name: "Combine Harvester",
        price: "₹ 4,500 / day",
        date: "Booked on 01 May 2024",
        image: "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRPOaQ51XzSpw2-eQ3qtNCV8e46lPHRwpTpRIXYUc-KRl1wra83",
        status: "Rented",
    },
    {
        id: 4,
        name: "Rotavator Machine",
        price: "₹ 1,200 / day",
        date: "Booked on 20 Apr 2024",
        image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcSlAVq1ASeKKep4eXt_TIEHFF76VSDBm5OIvk4Zx6p_M3azPJdAQLjIZ1mTk5fSAHQ1PwRgRia6K8GsUFE0IHZiUkfVYJL73ci6B8qVVrQGA5xh20RwW1He",
        status: "View Booking",
    },
    {
        id: 5,
        name: "Seed Drill",
        price: "₹ 900 / day",
        date: "Booked on 15 Apr 2024",
        image: "https://5.imimg.com/data5/SELLER/Default/2022/12/WI/HO/QO/98465654/mild-steel-seed-drill.jpeg",
        status: "Rented",
    },
    {
        id: 6,
        name: "Sprayer Machine",
        price: "₹ 400 / day",
        date: "Booked on 10 Apr 2024",
        image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTC8CtmxnknaHKJXlscRmRnkoBskdR03hS8srm7rLsuAeNr4WAlP8LhFy78jP_w-RF0SCfVoMXGcHXVgpjEXrEvh4e46b0ZnQzrPN58oLXL4AgJY-IEM7X1ud_P",
        status: "View Booking",
    },
];

const MyBookings = () => {
    const [selectedBooking, setSelectedBooking] = React.useState(null);
    return (
        <div className="bg-gray-100 min-h-screen px-10 py-6">

            {/* Breadcrumb */}
            <div className="text-sm text-gray-500 mb-4">
                &gt; Profile &gt; <span className="text-blue-500">My Bookings</span>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-semibold">My Bookings</h2>
                <p className="text-gray-500 mb-5">
                    Manage your equipment bookings
                </p>

                {/* ❌ Removed scroll container */}
                <div className="space-y-5">
                    {bookings.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-5 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                        >
                            {/* Image */}
                            <img
                                src={item.image}
                                alt="equipment"
                                className="w-[140px] h-[100px] object-cover rounded-lg"
                            />

                            {/* Details */}
                            <div>
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="font-bold text-gray-800">{item.price}</p>
                                <p className="text-gray-400 text-sm">{item.date}</p>

                                <button
                                    onClick={() => setSelectedBooking(item)}
                                    className={`mt-2 px-4 py-2 rounded-md text-white cursor-pointer text-sm font-medium ${item.status === "Rented"
                                        ? "bg-green-500"
                                        : "bg-green-700 hover:bg-green-800"
                                        }`}
                                >
                                    {item.status}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {selectedBooking && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

                    <div className="bg-white rounded-2xl w-[400px] p-6 shadow-xl relative">

                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="absolute top-3 right-3 bg-white shadow-md rounded-full w-8 h-8 flex items-center cursor-pointer justify-center text-gray-600 hover:text-red-700 hover:scale-110 transition"
                        >
                            ✕
                        </button>

                        {/* Image */}
                        <img
                            src={selectedBooking.image}
                            className="w-full max-h-52 object-contain rounded-lg mb-4 bg-gray-100"
                        />

                        {/* Title */}
                        <h2 className="text-lg font-semibold">
                            {selectedBooking.name}
                        </h2>

                        <p className="text-sm text-gray-500 mb-4">
                            Booking ID: #{selectedBooking.id}
                        </p>

                        {/* Info */}
                        <div className="space-y-2 text-sm mb-4">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price</span>
                                <span className="font-medium">{selectedBooking.price}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Booked On</span>
                                <span className="font-medium">{selectedBooking.date}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Status</span>
                                <span className="font-medium text-green-600">
                                    {selectedBooking.status === "Rented" ? "Completed" : "Active"}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-500">Payment</span>
                                <span className="font-medium text-blue-600">Paid</span>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-t my-3"></div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => alert("Cancel booking feature coming soon")}
                                className="flex-1 border border-red-500 text-red-500 cursor-pointer py-2 rounded-lg hover:bg-red-50"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBookings;