import React, { useState,useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { 
  Menu, 
  ShoppingBag, 
  User, 
  ShieldAlert, 
  Bell, 
  ArrowLeft, 
  CheckCircle2, 
  Circle 
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import UserNavbar from '../components/UserNavbar';
export default function OrderDetailsPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState(null);
  const fetchOrderDetails = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:5000/api/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(res.data);
    setOrderInfo(res.data);
  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  fetchOrderDetails();
}, []);
if (!orderInfo) {
  return (
    <div className="p-10 text-center">
      Loading Order...
    </div>
  );
}
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins',sans-serif] text-slate-800 antialiased">
      <Sidebar />

      {/* 🚀 MAIN WORKSPACE INNER CONTAINER CONTAINER */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 w-full">
        <UserNavbar user={user} title="Order Details" />

        {/* PAGE BODY AREA SECTION */}
        <div className="p-4 md:p-8 space-y-6 max-w-5xl w-full mx-auto">
          

          {/* TWO-COLUMN GRID (Stacks on mobile, stays side-by-side on laptop viewports) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* LEFT SIDE BLOCK: INVOICE BREAKDOWN AND ORDER SUMMARY DETAILS */}
            <div className="md:col-span-7 space-y-4">
              <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-5">
                
                {/* Order Meta Header Row */}
                <div className="flex items-start justify-between border-b border-slate-100 pb-4 gap-2">
                  <div className="space-y-1">
                    <h3 className="text-base font-black text-slate-900 tracking-tight">Order #{orderInfo.order.id}</h3>
                    <p className="text-xs text-slate-400 font-semibold">{new Date(orderInfo.order.pickup_time).toLocaleDateString()} •
                        {" "}
                        {new Date(orderInfo.order.pickup_time).toLocaleTimeString()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="px-2.5 py-0.5 bg-orange-50 border border-orange-100/70 text-orange-600 text-[10px] font-bold uppercase rounded-md tracking-wider">
                      {orderInfo.order.status.toUpperCase()}
                    </span>
                    {orderInfo.order.status === "ready" && (
                        <div className="mt-2 bg-green-50 border border-green-200 rounded-lg p-2">
                            <p className="text-xs font-semibold text-green-700">
                            Pickup OTP
                            </p>
                            <p className="text-lg font-bold text-green-900">
                            {orderInfo.order.otp}
                            </p>
                        </div>
                        )}
                    <button className="px-3 py-1 bg-[#1E293B] text-white text-[11px] font-bold rounded-lg shadow-2xs hover:bg-slate-800 transition-colors">
                      Track Order
                    </button>
                  </div>
                </div>

                {/* Nested Item Records List Container */}
                <div className="space-y-3.5">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Items</h4>
                  <div className="space-y-3">
                    {orderInfo.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-700">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex-shrink-0 flex items-center justify-center font-bold text-amber-700 text-xs shadow-2xs">
                            image
                          </div>
                          <span className="font-bold text-slate-800 truncate">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-8 text-right shrink-0">
                          <span className="text-slate-500 font-medium">₹{item.price}</span>
                          <span className="text-slate-500 font-bold w-6">x{item.quantity}</span>
                          <span className="text-slate-500 font-bold w-6">={item.quantity*item.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pricing Calculation Invoice Summary Rows */}
                <div className="border-t border-b border-slate-100 py-3.5 space-y-2.5 text-xs sm:text-sm font-semibold text-slate-500">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-slate-800 font-bold">₹{orderInfo.order.subtotal}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Packaging Charges</span>
                    <span className="text-slate-800 font-bold">₹10</span>
                  </div>
                </div>

                {/* Final Net Total Due Row */}
                <div className="flex justify-between items-center text-sm sm:text-base font-black text-slate-900 tracking-tight">
                  <span>Total Amount</span>
                  <span className="text-emerald-600 font-black">₹{orderInfo.order.total_amount}</span>
                </div>

              </div>

              {/* LOWER ROW META SUMMARY METRICS BLOCK */}
              <div className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-xs grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1 border-l border-slate-100 pl-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Payment Method</span>
                  <span className="font-extrabold text-slate-700 block text-xs sm:text-sm">{orderInfo.order.payment_method}</span>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE BLOCK: ORDER LIFECYCLE LIVE STEP PROGRESS TRACKER */}
            <div className="md:col-span-5 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs">
              <div className="relative space-y-6 pl-2 py-1">
                
                {/* Background Connecting Timeline Line Trace String */}
                <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-100 z-0"></div>

                {/* Step 1: Placed */}
                <div className="relative flex gap-4 items-start z-10">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-emerald-500 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 fill-white" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">Order Placed</h4>
                    <p className="text-[10px] font-semibold text-slate-400">20 May 2024 • 01:15 PM</p>
                  </div>
                </div>

                {/* Step 2: Confirmed */}
                <div className="relative flex gap-4 items-start z-10">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-emerald-500 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 fill-white" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight">Confirmed</h4>
                    <p className="text-[10px] font-semibold text-slate-400">20 May 2024 • 01:16 PM</p>
                  </div>
                </div>

                {/* Step 3: Preparing (Active State Context Highlight) */}
                <div className="relative flex gap-4 items-start z-10">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-blue-600 mt-0.5">
                    <CheckCircle2 className="w-4 h-4 fill-white" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-extrabold text-blue-600 tracking-tight">Preparing</h4>
                    <p className="text-[10px] font-semibold text-blue-400">20 May 2024 • 01:20 PM</p>
                  </div>
                </div>

                {/* Step 4: Ready For Pickup (Inactive Future Sequence) */}
                <div className="relative flex gap-4 items-start z-10 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-slate-300 mt-0.5">
                    <Circle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">Ready for Pickup</h4>
                    <p className="text-[10px] font-semibold text-slate-400">Not ready yet</p>
                  </div>
                </div>

                {/* Step 5: Picked Up (Inactive Future Sequence) */}
                <div className="relative flex gap-4 items-start z-10 opacity-40">
                  <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-slate-300 mt-0.5">
                    <Circle className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-700 tracking-tight">Picked Up</h4>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}