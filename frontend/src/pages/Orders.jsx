import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ShoppingBag } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import UserNavbar from "../components/UserNavbar";
import MobileFooter from "../components/MobileFooter";
export default function MyOrders() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [activeSubTab, setActiveSubTab] = useState('All Orders');
  // Track which order details are currently clicked/active in mobile view
  const [activeDetailsId, setActiveDetailsId] = useState(null);
  const subTabs = ['All Orders', 'Ongoing', 'Completed', 'Cancelled'];
  const [orders, setOrders] = useState([]);
  const fetchOrders = async () => {
  try {
    const user =JSON.parse(localStorage.getItem("user"));
    const token =
      localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/orders/user/${user.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(res.data);
    setOrders(res.data);
  } catch (err) {
    console.error(err);
  }
};
  const getOrderCategory = (status) => {
  switch (status) {
    case "pending":
    case "accepted":
    case "preparing":
    case "ready":
      return "Ongoing";
    case "delivered":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    default:
      return "Ongoing";
  }
};
  const filteredOrders = orders.filter(order => {
  if (activeSubTab === "All Orders") return true;
  return (
    getOrderCategory(order.status) === activeSubTab
  );
});
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-amber-100 text-amber-700';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };
  const formatPickupTime = (time) => {
  const date = new Date(time);
  const datePart = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const timePart = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
  return `${datePart} • ${timePart}`;
};
useEffect(() => {
  fetchOrders();
  const interval = setInterval(() => {
    fetchOrders();
  }, 10000); // 10 seconds
  return () => clearInterval(interval);
}, []);
  return (
    <div className="h-screen bg-slate-50 flex flex-col md:flex-row overflow-hidden font-['Poppins',sans-serif]">
      
      <Sidebar />

      <main className="flex-1 md:pl-64 flex flex-col min-w-0 w-full overflow-hidden">
        <UserNavbar user={user} title="My Orders" />

        <section className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 pt-2 md:pt-3 space-y-4 w-full pb-24">
          
          {/* 🏷️ MOBILE HEADER */}
          <div className="flex items-center justify-between md:hidden mt-1">
            <h3 className="text-xl font-semibold text-slate-900 tracking-tight">My Orders</h3>
          </div>

          {/* 🗂️ SUB-NAV FILTER CAPSULES */}
          <div className="flex gap-2 border-b border-slate-200/60 pb-px overflow-x-auto scrollbar-none">
            {subTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveSubTab(tab)}
                className={`py-2 px-3 text-xs sm:text-sm font-medium transition-all border-b-2 whitespace-nowrap ${
                  activeSubTab === tab
                    ? 'border-[#0B132B] text-[#0B132B] font-semibold'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* 📦 ORDERS LIST INTERFACE PANEL */}
          <div className="space-y-3 w-full">
            {filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8">
                <ShoppingBag className="mx-auto text-slate-300 w-12 h-12 mb-2" />
                <h4 className="text-sm font-medium text-slate-700">No orders here yet</h4>
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="bg-white border border-slate-100 rounded-xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all w-full overflow-hidden"
                >
                  {/* Food Left Thumbnail */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                    <img 
                      src={`http://localhost:5000/${order.food_image}`}
                      alt="Order Thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* 📱 MOBILE VIEW ONLY CONTAINER */}
                  <div className="flex sm:hidden flex-1 justify-between items-stretch gap-2 w-full min-h-[80px]">
                    {/* Mobile Details (Left Side) */}
                    <div className="space-y-0.5 min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900 tracking-tight">
                          Order #{order.id}
                        </h4>
                        <p className="text-[11px] text-slate-800 font-medium">
                          {formatPickupTime(order.pickup_time)}
                        </p>
                        <p className="text-xs text-slate-800 font-normal truncate pt-0.5">
                          {order.itemsText}
                        </p>
                        {order.status?.toLowerCase() === "ready" && (
                        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2">
                          <p className="text-[10px] font-semibold text-green-700">
                            Pickup OTP
                          </p>
                          <p className="text-base font-bold text-green-900">
                            {order.otp}
                          </p>
                        </div>
                      )}
                      </div>
                      {/* Price row perfectly aligned at the bottom with the button level */}
                      <div className="pt-1">
                        <span className="text-sm font-semibold text-slate-900">₹{order.total_amount}</span>
                      </div>
                    </div>

                    {/* Mobile Status Label & Dynamic Action Button Panel */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0">
                      {/* Label stays at the top-right position */}
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${getStatusBadgeClass(getOrderCategory(order.status))}`}>
                        {order.status}
                      </span>
                      
                      {/* Action Button shifted down to the same line level as the price amount */}
                      {getOrderCategory(order.status) === 'Ongoing' ? (
                        <button className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-[#0B132B] text-white">
                          Track
                        </button>
                      ) : (
                        <button 
                          onClick={() => setActiveDetailsId(activeDetailsId === order.id ? null : order.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                            activeDetailsId === order.id 
                              ? 'bg-[#0B132B] text-white border-transparent' 
                              : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          Details
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 💻 LAPTOP VIEW ONLY CONTAINER */}
                  <div className="hidden sm:flex flex-1 items-center justify-between gap-4">
                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${getStatusBadgeClass(getOrderCategory(order.status))}`} >
                          {order.status}
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-slate-900 tracking-tight">
                        Order #{order.id}
                      </h4>
                      <p className="text-[11px] text-slate-800 font-medium">
                        {formatPickupTime(order.pickup_time)}
                      </p>
                      <p className="text-sm text-slate-800 font-normal truncate pt-1">
                        {order.itemsText}
                      </p>
                    </div>

                    {/* Aligned with the layout flow, using identical dynamic button states as the mobile layout */}
                    <div className="flex flex-col items-end justify-between h-20 sm:h-24 flex-shrink-0">
                      <span className="text-base font-semibold text-slate-900">₹{order.total_amount}</span>
                      {order.status.toLowerCase() === "ready" && (
                          <p className="text-xs bg-green-50 border border-green-200 rounded-lg font-semibold text-green-700 px-3 py-1 w-fit shadow-2xs tracking-wide">
                          Pickup OTP: <span className="font-extrabold">{order.otp}</span>
                        </p>
                      )}
                      {getOrderCategory(order.status) === 'Ongoing' ? (
                        <button onClick={() =>navigate(`/order-details/${order.id}`)} className="px-4 py-1.5 rounded-lg text-xs font-medium tracking-tight shadow-sm transition-colors bg-[#0B132B] text-white hover:bg-[#1C2541]">
                          Track Order
                        </button>
                      ) : (
                        <button 
                          onClick={() =>navigate(`/order-details/${order.id}`)}
                          className={`px-4 py-1.5 rounded-lg text-xs font-medium tracking-tight shadow-sm transition-colors border ${
                            activeDetailsId === order.id 
                              ? 'bg-[#0B132B] text-white border-transparent' 
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          View Details
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </section>
        <MobileFooter />
      </main>
    </div>
  );
}