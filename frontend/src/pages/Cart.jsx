import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { Trash2, Plus, Minus, Info } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import UserNavbar from "../components/UserNavbar";
import MobileFooter from "../components/MobileFooter";
export default function Cart() {
  const navigate = useNavigate();
  const user =JSON.parse(localStorage.getItem("user"));
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem("cart")) || [];
  });
  const [pickupTime, setPickupTime] = useState("");
  const today = new Date();
  const datePart =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");
  const pickupDateTime =
    `${datePart} ${pickupTime}:00`;
  const updateQuantity = (id, amount) => {
    const updatedCart = cartItems
      .map(item => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          if (newQty <= 0) {
            return null;
          }
          return {
            ...item,
            quantity: newQty
          };
        }
        return item;
      })
      .filter(Boolean);
    setCartItems(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
  };

  const totalItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const packagingCharges = cartItems.length === 0 ? 0 : 10; // Sets charges to 0 if cart is empty
  const grandTotal = totalAmount + packagingCharges;

  const handlePlaceOrder = async () => {
  try {
    const user =
      JSON.parse(localStorage.getItem("user"));
    const orderData = {
      user_id: user.id,
      pickup_time: pickupDateTime,
      payment_method: "Cash",
      items: cartItems.map(item => ({
        food_id: item.id,
        quantity: item.quantity
      }))
    };
    const response = await axios.post(
    "http://localhost:5000/api/orders/place",orderData);
    console.log(response.data);
    localStorage.removeItem("cart");
    setCartItems([]);
    navigate("/orders");
  } catch (error) {
     console.log(error.response?.data);
     console.error(error);}
};
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-['Poppins',sans-serif] relative overflow-x-hidden md:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <Sidebar />

      {/* 🚀 MAIN DATA CANVAS WRAPPER */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 w-full h-full overflow-x-hidden">
        <UserNavbar user={user} title="My Cart" />

        <section className="p-4 md:p-8 space-y-5 w-full max-w-full md:pr-12 box-border overflow-x-hidden pb-24 md:pb-12 mx-auto">
          
          {/* Mobile Only Header Track */}
          <h3 className="block md:hidden text-base font-bold text-slate-900 tracking-tight mb-2">
            My Cart
          </h3>
          
          {/* 🗂️ 50/50 BALANCED GRID SPLIT SYSTEM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start w-full">
            
            {/* 📋 SECTION 1: CART ITEMS */}
            {cartItems.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center shadow-sm w-full box-border">
                <h3 className="text-lg font-semibold text-slate-700">
                  Your Cart is Empty
                </h3>
                <p className="text-sm text-slate-400 mt-2">
                  Add some delicious food from the menu.
                </p>
              </div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-2xl p-4 pt-4 shadow-sm divide-y divide-slate-200 w-full box-border">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 w-full box-border py-3 first:pt-0 last:pb-0">                    
                    {/* Left Side: Premium Beautiful Food Image Thumbnail */}
                    <img 
                      src={`http://localhost:5000/${item.food_image}`}
                      alt={item.name} 
                      className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-50 border border-slate-100 flex-shrink-0 shadow-sm"
                    />
                    {/* Middle Side: Item Text Block */}
                    <div className="min-w-0 flex-1 pl-2">
                      <h4 className="text-sm sm:text-base font-bold text-slate-800 truncate tracking-tight">
                        {item.name}
                      </h4>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-600 mt-0.5">
                        ₹{item.price}
                      </p>
                    </div>
                    {/* Right Side: Colored Increment/Decrement Tray & Red Trash Action Badge */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {/* 🔹 Blue Styled Counter Container */}
                      <div className="flex items-center border border-slate-300 rounded-xl p-1">
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5 stroke-[3.5]" />
                        </button>
                        <span className="w-6 text-center text-sm font-extrabold text-blue-900">
                          {item.quantity}
                        </span>
                        <button 
                          type="button" 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3.5]" />
                        </button>
                      </div>

                      {/* 🛑 Red Styled Deletion Action Trigger Badge */}
                      <button 
                        type="button" 
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-rose-500 hover:text-rose-600 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 stroke-[2.2]" />
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* 🛠️ RIGHT COLUMN: ORDER SUMMARY & PAYMENT SUMMARY */}
            <div className="w-full space-y-6">
              
              {/* ORDER SUMMARY SIDEBAR CARD */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm w-full box-border space-y-5">
                <div className="space-y-5">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">
                    Order Summary
                  </h4>
                  {/* Detailed breakdown lines */}
                  <div className="space-y-3.5 text-xs sm:text-sm font-medium text-slate-600">
                    <div className="flex items-center justify-between">
                      <span>Items Subtotal ({totalItemsCount})</span>
                      <span className="font-bold text-slate-800">₹{totalAmount}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Packaging Charges</span>
                      <span className="font-bold text-slate-800">₹{packagingCharges}</span>
                    </div>
                  </div>
                </div>
                {/* Grand Total Row */}
                <div className="border-t border-slate-200 pt-4 flex items-center justify-between text-sm sm:text-base">
                  <span className="font-bold text-slate-800">Total Amount</span>
                  <span className="font-extrabold text-emerald-500 text-base sm:text-lg">₹{grandTotal}</span>
                </div>
              </div>

              {/* PAYMENT METHOD SECTION */}
              <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm w-full box-border space-y-5">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight border-b border-slate-200 pb-2">
                  Payment Method
                </h4>
                {/* Payment Option Selection Element Placeholder */}
                <div className="flex items-center gap-3 rounded-xl ">
                  <input 
                    type="radio" 
                    id="cod" 
                    name="payment" 
                    defaultChecked 
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="cash" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none">
                    Cash / Counter Payment
                  </label>
                </div>
                <div className="flex items-center gap-3 rounded-xl ">
                  <input 
                    type="radio" 
                    id="upi" 
                    name="payment" 
                    defaultChecked={false}
                    className="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <label htmlFor="upi" className="text-xs sm:text-sm font-medium text-slate-700 cursor-pointer select-none">
                    UPI
                  </label>
                </div>
                <div className="flex items-center gap-3 rounded-xl">
                  <label className="text-xs sm:text-sm font-medium text-slate-700">
                    Pickup Time
                  </label>
                  <input
                    type="time"
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="HH:MM"
                  />
                </div>
                  <div className="w-full rounded-xl px-16 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-semibold text-slate-500 leading-normal">
                      Select a pickup time 20–30 minutes from now
                    </p>
                  </div>
                {/* Core trigger button execution shifted here cleanly */}
                <button 
                  type="button" 
                  onClick={handlePlaceOrder}
                  disabled={cartItems.length === 0}
                  className="w-full py-3.5 bg-[#111827] text-white rounded-xl text-xs sm:text-sm font-semibold tracking-wide hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors text-center shadow-sm"
                >
                  Place Order
                </button>
              </div>

            </div>

          </div>
        </section>
      </main>

      <MobileFooter />
    </div>
  );
}