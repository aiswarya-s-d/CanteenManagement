import React, { useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, Plus } from 'lucide-react';
import Sidebar from "../components/Sidebar";
import UserNavbar from "../components/UserNavbar";
import MobileFooter from "../components/MobileFooter";
const BACKEND_URL = 'http://localhost:5000';
export default function MenuSection() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [foods, setFoods] = useState([]);
  const categories = ['All', 'Breakfast', 'Lunch', 'Snacks', 'Drinks'];
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem("cart")) || []);
  const firstCartItem =cart.length > 0 ? cart[0] : null;
  const fetchFoods = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_URL}/api/food/all`
    );
    setFoods(res.data);
  } catch (error) {
    console.error(error);
  }
};
const filteredFoods = foods.filter(food => {
    const matchesTab = activeCategory === 'All' || food.category === activeCategory.toLowerCase();
    const matchesSearch = 
      food.name.toLowerCase().includes(searchQuery) || 
      food.price.toString().includes(searchQuery.toLowerCase());
    const isAvailable = food.status === "available";
    return matchesTab && matchesSearch && isAvailable;
  });
const increaseQty = (food) => {
  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(
    item => item.id === food.id
  );
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      ...food,
      quantity: 1
    });
  }
  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
  setCart([...cart]); // IMPORTANT
};
const decreaseQty = (food) => {
  let cart =
    JSON.parse(localStorage.getItem("cart")) || [];
  const existing = cart.find(
    item => item.id === food.id
  );
  if (!existing) return;
  existing.quantity -= 1;
  cart = cart.filter(
    item => item.quantity > 0
  );
  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );
  setCart([...cart]); // IMPORTANT
};
const getQuantity = (foodId) => {
  const item = cart.find(
    item => item.id === foodId
  );
  return item ? item.quantity : 0;
};
  // Helper render component to keep individual food cards consistent
  const FoodCard = ({ item }) => (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="h-36 sm:h-40 w-full overflow-hidden bg-slate-100 relative">
        <img 
          src={`${BACKEND_URL}/${item.food_image}`} 
          alt={item.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-1.5">
        <h4 className="font-semibold text-slate-900 text-sm sm:text-base tracking-tight">{item.name}</h4>
        <div className="flex items-center justify-between pt-0.5">
          <span className="font-semibold text-slate-900 text-sm sm:text-base">₹{item.price}</span>
          {getQuantity(item.id) > 0 ? (
          <div className="flex items-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-xl px-2 py-1">
            <button
              onClick={() => decreaseQty(item)}
              className="font-medium text-black">
              -
            </button>
            <span className="font-semibold">
              {getQuantity(item.id)}
            </span>
            <button
              onClick={() => increaseQty(item)}
              className="font-medium text-black">
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => increaseQty(item)}
            className="p-1.5 sm:p-2 bg-slate-50 hover:bg-slate-100 border border-slate-300 text-black rounded-xl transition-colors">
            <Plus size={16} strokeWidth={3} />
          </button>
        )}
        </div>
      </div>
    </div>
  );
  useEffect(() => {
  fetchFoods();
}, []);
  return (
    <div className="min-h-screen flex bg-slate-50">
    <Sidebar />
    <main className="flex-1 md:ml-64 overflow-x-hidden">
      <UserNavbar user={user} title="Menu"/>
      {cart.length > 0 && (
      <div className="sticky top-16 z-40 bg-white border border-slate-200 rounded-xl py-1.5 px-2 shadow-[0_8px_20px_rgba(15,23,42,0.06)] mx-5 mt-3 mb-0 flex items-center justify-between gap-4 transition-all duration-300 animate-in fade-in slide-in-from-top-3">
        {/* Left Block: Image Thumbnail & Stacked Informational Text */}
        <div className="flex items-center gap-3.5 min-w-0">
          <img
            src={`http://localhost:5000/${firstCartItem?.food_image}`}
            alt={firstCartItem?.name}
            className="w-15 h-15 rounded-lg object-cover bg-slate-50 border border-slate-100  flex-shrink-0 shadow-sm"/>
          {/* Stacked Vertical Message Text Section */}
          <div className="flex flex-col min-w-0">
            <p className="text-medium font-extrabold text-slate-900 tracking-tight">
              ₹{cart.reduce((total, item) => total + item.price * item.quantity, 0)}
            </p>
            <p className="text-[11px] sm:text-xs font-semibold text-slate-600 mt-0.5">
              {cart.length} {cart.length === 1 ? 'Item' : 'Items'} added
            </p>
          </div>
        </div>
        {/* Right Block: Vibrant Blue Interactive CTA Button */}
        <button
          type="button"
          onClick={() => navigate("/cart")}
          className="px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 active:scale-[0.97] transition-all rounded-xl text-xs font-bold tracking-wide shadow-sm flex-shrink-0">
          View Cart
        </button>
      </div>
    )}
    <section className="p-4 md:p-8 pb-24 space-y-4 w-full overflow-x-hidden font-['Poppins',sans-serif]">
      {/* 🏷️ SECTION HEADER */}
      <div className="flex items-center justify-between md:hidden">
        <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Menu</h3>
      </div>
      {/* 🔍 SEARCH AND FILTER PANEL AREA */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search for food..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-slate-100 md:bg-white border border-transparent md:border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-all text-slate-700"
          />
        </div>
        <button className="p-2.5 bg-slate-100 md:bg-white border border-transparent md:border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
          <SlidersHorizontal size={20} strokeWidth={2} />
        </button>
      </div>

      {/* 💊 CATEGORY PILLS (Horizontal Scroll on Mobile) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
        {categories.map((category) => (
          <button 
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === category 
                ? 'bg-[#0B132B] text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* 🍱 CONDITIONAL CATEGORY SECTION CONTAINER */}
      <div className="space-y-8 pt-2">
        
        {/* 🍳 BREAKFAST SUBSECTION */}
        {(activeCategory === 'All' || activeCategory === 'Breakfast') && (
          <div className="space-y-4">
            {activeCategory === 'Breakfast' && (
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-1">
              Breakfast <span className="text-amber-700 text-sm sm:text-base">☀️</span>
            </h3>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredFoods.map((item) => <FoodCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {/* 🍛 LUNCH SUBSECTION */}
        {(activeCategory === 'Lunch') && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-1">
              Lunch <span className="text-amber-700 text-sm sm:text-base">🍛</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredFoods.map((item) => <FoodCard key={item.id} item={item} />)}
            </div>
          </div>
        )}

        {/* 🥪 SNACKS SUBSECTION */}
        {(activeCategory === 'Snacks') && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-1">
              Snacks <span className="text-amber-700 text-sm sm:text-base">🥪</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredFoods.map((item) => <FoodCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
        {/* 🥪 DRINKS  SUBSECTION */}
        {(activeCategory === 'Drinks') && (
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-slate-900 tracking-tight flex items-center gap-1">
              Drinks <span className="text-amber-700 text-sm sm:text-base">🥤</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {filteredFoods.map((item) => <FoodCard key={item.id} item={item} />)}
            </div>
          </div>
        )}
      </div>
    </section>
    </main>
  <MobileFooter />
</div>
  );
}