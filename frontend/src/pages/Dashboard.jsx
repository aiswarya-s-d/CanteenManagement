import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { 
  Home,
  UtensilsCrossed, 
  ShoppingBag, 
  User, 
  Bell, 
  ChevronDown, 
  ClipboardList, 
  KeyRound, 
  Wallet, 
  Plus,
  Menu
} from 'lucide-react';
import Sidebar from "../components/Sidebar";
import UserNavbar from "../components/UserNavbar";
import MobileFooter from "../components/MobileFooter";
const BACKEND_URL = 'http://localhost:5000'; 
export default function CanteenDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
  ordersToday: 0,
  pickupOtp: "----",
  todaysSpend: 0
  });
  const [foods, setFoods] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [activeCategory, setActiveCategory] = useState('Breakfast');
  const categories = ['Breakfast', 'Lunch', 'Snacks', 'Drinks'];
  const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour>=5 && hour < 12) {
    return "Good Morning";
  }
  if (hour>=12 && hour < 17) {
    return "Good Afternoon";
  }
  if (hour>=17 && hour < 21) {
    return "Good Evening";
  }
  return "Good Night";
  };
  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${BACKEND_URL}/api/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setUser(res.data);
  } catch (error) {
    console.error(error);
  }
  };
  const fetchDashboardStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `${BACKEND_URL}/api/users/dashboard-stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setStats(res.data);
  } catch (error) {
    console.error(error);
  }
  };
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
  const filteredFoods = foods.filter(
  food => food.category === activeCategory.toLowerCase());
  useEffect(() => {
    fetchProfile();
    fetchDashboardStats();
    fetchFoods();
  }, []);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-['Poppins',sans-serif] flex pb-16 md:pb-0">
      
      {/* Google Fonts Pre-requisite injection for Poppins */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
      `}</style>
     <Sidebar />
      {/* ========================================== */}
      {/* 🚀 MAIN CONTENT CONTAINER                 */}
      {/* ========================================== */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0">
        
        <UserNavbar user={user} title="User Dashboard" />
        {/* 📦 DASHBOARD SCROLL CONTAINER */}
        <div className="p-4 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          
          {/* 👋 EXPANDED GREETING SECTION WITH BOTTOM LINE */}
          <section className="flex items-center justify-between gap-6 py-4 border-b border-slate-200/70">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
                {getGreeting()},  {user?.name || "User"}!<span>👋</span>
              </h1>
              <p className="text-slate-900 text-base font-medium tracking-tight">
                Have a great day ahead!
              </p>
            </div>
            {/* Sized illustration area */}
            <div className="hidden sm:block w-32 h-32 opacity-90 transition-transform">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                <circle cx="60" cy="60" r="50" fill="#F1F5F9"/>
                <path d="M35 85 C 45 60, 75 60, 85 85" stroke="#94A3B8" strokeWidth="3.5" strokeLinecap="round"/>
                <circle cx="60" cy="45" r="14" fill="#94A3B8"/>
                <circle cx="85" cy="40" r="3" fill="#E2E8F0"/>
                <circle cx="35" cy="45" r="4" fill="#E2E8F0"/>
              </svg>
            </div>
          </section>

          {/* 📊 COLORFUL METRICS & SNAPSHOT CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Active Orders */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100/40 border border-blue-100/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-blue-600/90 uppercase tracking-wider">Active Orders</span>
                <p className="text-3xl font-semibold text-slate-900">{stats.ordersToday}</p>
              </div>
              <div className="p-3 bg-blue-500 text-white rounded-xl shadow-md shadow-blue-500/20">
                <ClipboardList size={22} />
              </div>
            </div>

            {/* Recent Pickup OTP - Featuring Upgraded KeyRound Icon */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100/40 border border-purple-100/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-purple-600/90 uppercase tracking-wider">Recent Pickup OTP</span>
                <p className="text-3xl font-semibold text-slate-900 tracking-wide">{stats.pickupOtp}</p>
              </div>
              <div className="p-3 bg-purple-500 text-white rounded-xl shadow-md shadow-purple-500/20">
                <KeyRound size={22} />
              </div>
            </div>

            {/* Wallet Balance */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/40 border border-emerald-100/80 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-emerald-600/90 uppercase tracking-wider">Wallet Balance</span>
                <p className="text-3xl font-semibold text-slate-900">₹{stats.todaysSpend}</p>
              </div>
              <div className="p-3 bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-500/20">
                <Wallet size={22} />
              </div>
            </div>
          </section>

          {/* 🍽️ TODAY'S MENU SECTION */}
          <section className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900 tracking-tight">Today's Menu</h3>
                <p className="text-sm text-slate-700 font-medium">Delicious food curated for you</p>
              </div>
              <button onClick={() => navigate('/menu')} className="text-sm font-medium text-blue-600 hover:underline">View All</button>
            </div>

            {/* Category Filter Pills - Sized down slightly for a clean, compact layout */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
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
            {/* Menu Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredFoods.map((item) => (
                <div key={item.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img 
                      src={`${BACKEND_URL}/${item.food_image}`}
                      alt={item.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1 justify-between gap-4">
                    <h4 className="font-semibold text-slate-900 text-base tracking-tight">{item.name}</h4>
                    <div className="flex items-center justify-between pt-0.5">
                      <span className="font-semibold text-slate-900 text-base">₹{item.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
      {<MobileFooter />}
    </div>
  );
}