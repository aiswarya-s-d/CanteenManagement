import React,{useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { 
  LayoutDashboard, ShoppingBag, UtensilsCrossed, Users, 
  BarChart3, Ticket, Bell, Settings, LogOut, Search,
  ArrowUpRight, ArrowDownRight, TrendingUp, Calendar,Wallet,Clock3
} from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
  totalOrders: 0,
  totalRevenue: 0,
  activeUsers: 0,
  pendingOrders: 0});
  const [topItems, setTopItems] = useState([]);
  const [orderChart, setOrderChart] = useState({
  delivered: 0,
  pending: 0,
  preparing: 0,
  cancelled: 0
});
  const dashboardStats = [
  {
    label: "Total Orders",
    value: stats.totalOrders,
    bg: "from-blue-50 to-blue-100/40",
    border: "border-blue-100/80",
    text: "text-blue-600",
    iconBg: "bg-blue-500",
    icon: <ShoppingBag size={22} />
  },
  {
    label: "Revenue",
    value: `₹${stats.totalRevenue}`,
    bg: "from-emerald-50 to-emerald-100/40",
    border: "border-emerald-100/80",
    text: "text-emerald-600",
    iconBg: "bg-emerald-500",
    icon: <Wallet size={22} />
  },
  {
    label: "Active Users",
    value: stats.activeUsers,
    bg: "from-purple-50 to-purple-100/40",
    border: "border-purple-100/80",
    text: "text-purple-600",
    iconBg: "bg-purple-500",
    icon: <Users size={22} />
  },
  {
    label: "Pending Orders",
    value: stats.pendingOrders,
    bg: "from-amber-50 to-amber-100/40",
    border: "border-amber-100/80",
    text: "text-amber-600",
    iconBg: "bg-amber-500",
    icon: <Clock3 size={22} />
  }
];
  const topSellingItems = [
    { name: "Masala Dosa", count: "320 orders", img: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=80&auto=format&fit=crop&q=60" },
    { name: "Veg Biryani", count: "260 orders", img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=80&auto=format&fit=crop&q=60" },
    { name: "Paneer Butter Masala", count: "250 orders", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=80&auto=format&fit=crop&q=60" },
    { name: "Idli Sambar", count: "210 orders", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=80&auto=format&fit=crop&q=60" },
    { name: "Veg Meals", count: "180 orders", img: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=80&auto=format&fit=crop&q=60" }
  ];
  const fetchProfile = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(
      `http://localhost:5000/api/users/profile`,
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
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(
      `http://localhost:5000/api/users/admin/dashboard-stats`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    console.log(res.data);
    setStats(res.data);
  } catch (error) {
    console.error(error);
  }
  };
  const fetchTopItems = async () => {
  const res = await axios.get(
    "http://localhost:5000/api/orders/top-selling-items"
  );
  console.log(res.data);
  setTopItems(res.data);
};
const fetchOrderChart = async () => {
  try {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(
      "http://localhost:5000/api/orders/order-success-chart",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setOrderChart(res.data);
  } catch (err) {
    console.error(err);
  }
};
  useEffect(() => {
    fetchProfile();
    fetchDashboardStats();
    fetchTopItems();
    fetchOrderChart();
  }, []);
  const totalOrders =
  orderChart.delivered +
  orderChart.preparing +
  orderChart.pending +
  orderChart.cancelled;
const deliveredPercent =
  totalOrders > 0
    ? (orderChart.delivered / totalOrders) * 100
    : 0;
const preparingPercent =
  totalOrders > 0
    ? (orderChart.preparing / totalOrders) * 100
    : 0;
const cancelledPercent =
  totalOrders > 0
    ? (orderChart.cancelled / totalOrders) * 100
    : 0;
const successPercentage =
  totalOrders > 0
    ? Math.round(deliveredPercent)
    : 0;
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins',sans-serif] text-slate-800">
      <AdminSidebar />
      {/* 🚀 MAIN CONTENT FRAME WORKSPACE */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 w-full">
        <AdminNavbar user={user} title="Admin Dashboard" />
        {/* INNER ANALYTICS CANVAS AREA */}
        <div className="p-4  md:p-8 space-y-5 md:space-y-6 max-w-full box-border pb-24 md:pb-8">
          
          {/* WELCOME HERO LABEL BANNER TRACK */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-6 md:py-8 border-b border-slate-200/70">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">Welcome back, Admin! 👋</h2>
              <p className=" text-base font-medium text-slate-900">Stay on top of today's orders.</p>
            </div>
            <div className="flex items-center gap-1.5  border border-slate-300 shadow:2xl rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 self-start sm:self-auto" >
              <Calendar className="w-4 h-4 text-slate-900" />
              <span>
              {new Date().toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </span>
            </div>
          </div>
          {/* 📊 CORE STATISTICAL TRACK GRID OVERVIEW */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
            {dashboardStats.map((stat, idx) => (
              <div
                key={idx}
                className={`bg-gradient-to-br ${stat.bg} ${stat.border} border rounded-xl p-5 flex items-center justify-between shadow-sm`}
              >
                <div className="space-y-1">
                  <span
                    className={`text-[11px] font-semibold ${stat.text}/90 uppercase tracking-wider`}
                  >
                    {stat.label}
                  </span>
                  <p className="text-3xl font-semibold text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`p-3 ${stat.iconBg} text-white rounded-xl shadow-md`}
                >
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>

          {/* 🗂️ MAIN STRUCTURAL LAYOUT COMPONENT SPLIT SPLIT ROW */}
          <div className="flex flex-col lg:flex-row gap-5 items-start justify-start w-full max-w-4xl">
              {/* COLUMN MODULE 3 BOUNDS: TOP SELLING ITEMS CARD TRACK */}
              <div className="w-full md:max-w-md bg-white border border-slate-100 rounded-2xl p-4 md:p-5 shadow-sm space-y-3">
              {/* Header Section */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">Top Selling Items</h3>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
              {/* Product Content Rows */}
              <div className="divide-y divide-slate-100">
                {topItems.map((item, index) => {
                  // Dynamic style mapping for the ranking badges
                  const getRankStyle = (idx) => {
                    switch(idx) {
                      case 0: return 'bg-amber-50 text-amber-600 border border-amber-200'; // Gold style for #1
                      case 1: return 'bg-slate-100 text-slate-600 border border-slate-200'; // Silver style for #2
                      case 2: return 'bg-orange-50 text-orange-600 border border-orange-200'; // Bronze style for #3
                      default: return 'bg-slate-50 text-slate-600 border border-slate-200';
                    }
                  };

                  return (
                    <div key={index} className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Upscaled Product Image Layout */}
                        <img 
                          src={`http://localhost:5000/${item.food_image}`} 
                          alt={item.name} 
                          className="w-14 h-14 rounded-xl object-cover border border-slate-100 bg-slate-50 flex-shrink-0 shadow-2xs" 
                        />
                        <div className="min-w-0">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-tight block truncate">
                            {item.name}
                          </span>
                          <span className="text-[11px] font-bold text-slate-400 block mt-0.5">
                            {item.totalSold} Units Sold
                          </span>
                        </div>
                      </div>
                      
                      {/* Vibrant High-Contrast Ranking Badge */}
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-lg tracking-wide shrink-0 ${getRankStyle(index)}`}>
                        #{index + 1}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
             {/* ORDERS BY STATUS CARD (Width perfectly balanced to match left card with scaled up size) */}
              <div className="w-full lg:w-[380px] bg-white border border-slate-100 rounded-2xl p-5 md:p-6 shadow-sm space-y-5 flex-shrink-0 flex flex-col justify-between">
                <div>
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-sm md:text-base font-bold text-slate-900 tracking-tight">Orders by Status</h3>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-between py-6 px-1">
                    {/* 🚀 Scaled up Donut Chart Circle (w-24 -> w-32) */}
                    <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-full h-full transform -rotate-90"
                        viewBox="0 0 36 36">
                        {/* Background */}
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#F1F5F9"
                          strokeWidth="3.5"/>
                        {/* Delivered */}
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#10B981"
                          strokeWidth="4.0"
                          strokeDasharray={`${deliveredPercent} ${100 - deliveredPercent}`}
                          strokeDashoffset="0"/>
                        {/* Preparing */}
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#F59E0B"
                          strokeWidth="4.0"
                          strokeDasharray={`${preparingPercent} ${100 - preparingPercent}`}
                          strokeDashoffset={-deliveredPercent}/>
                        {/* Cancelled */}
                        <circle
                          cx="18"
                          cy="18"
                          r="15.915"
                          fill="none"
                          stroke="#EF4444"
                          strokeWidth="4.0"
                          strokeDasharray={`${cancelledPercent} ${100 - cancelledPercent}`}
                          strokeDashoffset={-(deliveredPercent + preparingPercent)}/>
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xl font-black text-slate-900 block leading-none">{successPercentage}%</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Success</span>
                      </div>
                    </div>
                    {/* 📊 High Contrast Status Rows with expanded text sizing gaps */}
                    <div className="space-y-3 text-xs font-semibold text-slate-500 flex-1 w-full sm:pl-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-2xs"></span>
                          <span className="text-slate-600 font-medium">Delivered</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderChart.delivered}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-amber-500 shadow-2xs"></span>
                          <span className="text-slate-600 font-medium">Preparing</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderChart.preparing}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-2xs"></span>
                          <span className="text-slate-600 font-medium">Cancelled</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderChart.cancelled}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="w-3 h-3 rounded-full bg-slate-300 shadow-2xs"></span>
                          <span className="text-slate-600 font-medium">Pending</span>
                        </div>
                        <span className="text-sm font-black text-slate-900">{orderChart.pending}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </div>
        </div>
        {/* 📱 MOBILE NAVIGATION BAR FOOTER FIXTURE - Hidden on Desktop */}
        <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 flex items-center justify-between z-30 shadow-lg">
          <button className="flex flex-col items-center gap-0.5 text-blue-600"><LayoutDashboard className="w-4 h-4" /><span className="text-[9px] font-bold">Dashboard</span></button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400"><ShoppingBag className="w-4 h-4" /><span className="text-[9px] font-bold">Orders</span></button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400"><UtensilsCrossed className="w-4 h-4" /><span className="text-[9px] font-bold">Menu</span></button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400"><Users className="w-4 h-4" /><span className="text-[9px] font-bold">Users</span></button>
          <button className="flex flex-col items-center gap-0.5 text-slate-400"><Settings className="w-4 h-4" /><span className="text-[9px] font-bold">More</span></button>
        </footer>

      </main>
    </div>
  );
}