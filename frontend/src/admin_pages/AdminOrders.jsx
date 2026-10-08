import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar';

export default function AdminOrdersManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
 const subTabs = [
  "All",
  "Pending",
  "Accepted",
  "Preparing",
  "Ready",
  "Delivered",
  "Cancelled"
];
  // 1. Fetch Admin Profile Context Data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`http://localhost:5000/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  // 2. Fetch Live Dashboard Orders State Array
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log(res.data);
      setOrders(res.data);
    } catch (error) {
      console.error("Orders fetch error:", error);
      // Fallback mock dataset for visual consistency (all structural entities normalized to takeaway)
      setOrders([
        { id: 1081, customer: "Rahul Kumar", items: "Chicken Biryani x2, Thums Up x1", total: 320, time: "10 mins ago", status: "pending" },
        { id: 1080, customer: "Anjali Sharma", items: "Masala Dosa x1, Filter Coffee x1", total: 75, time: "18 mins ago", status: "preparing" },
        { id: 1079, customer: "Vikram Singh", items: "Paneer Butter Masala x1, Butter Naan x3", total: 220, time: "45 mins ago", status: "completed" },
        { id: 1078, customer: "Siddharth Jain", items: "Veg Fried Rice x1, Manchurian x1", total: 160, time: "1 hour ago", status: "cancelled" }
      ]);
    }
  };

  // 3. Mutate Order Lifecycle Status
  const handleUpdateStatus = async (orderId, nextStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, 
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status: nextStatus }));
      }
      fetchOrders();
    } catch (error) {
      console.error("Failed to update status:", error);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchOrders();
  }, []);

  // Filter Pipeline Engine
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeSubTab === 'All' || order.status === activeSubTab.toLowerCase();
    const matchesSearch = 
      order.id.toString().includes(searchQuery) || 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Dynamic status design configuration layout utilities
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': 
        return 'bg-amber-50 text-amber-600 border-amber-100/80';
      case 'accepted':
        return 'bg-blue-50 text-blue-600 border-blue-100/80';
      case 'preparing': 
        return 'bg-orange-50 text-blue-600 border-orange-100/80';
      case 'ready':
        return 'bg-amber-50 text-amber-600 border-amber-100/80';
      case 'delivered': 
        return 'bg-emerald-50 text-emerald-600 border-emerald-100/80';
      case 'cancelled': 
        return 'bg-rose-50 text-rose-600 border-rose-100/80';
      default: 
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins',sans-serif] text-slate-800">
      
      {/* 💻 FIXED LEFT DESKTOP SIDEBAR LINK */}
      <AdminSidebar />

      {/* 🚀 WORKSPACE INNER TRACK CONTAINER */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 w-full">
        
        {/* GLOBAL HEADER ADMIN NAVBAR */}
        <AdminNavbar user={user} title="Orders Management" />

        {/* PAGE CONTENT CONTAINER BLOCK */}
        <div className="p-8 py-3 space-y-4 md:space-y-5 max-w-full box-border pb-24 md:pb-8">
        
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

          {/* 🔍 SEARCH AND FILTER CONTROL PANEL */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search by Order ID, customer, or food item..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 md:bg-white border border-transparent md:border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-all text-slate-700 font-medium"
              />
            </div>
            <button className="p-2.5 bg-slate-100 md:bg-white border border-transparent md:border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors flex-shrink-0">
              <SlidersHorizontal size={20} strokeWidth={2} />
            </button>
          </div>

          {/* 💻 DESKTOP LAYOUT DATATABLE (Fulfill details columns clean removed) */}
          <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Order Info</th>
                  <th className="py-3.5 px-6">Items Summary</th>
                  <th className="py-3.5 px-6">Total Bill</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                {filteredOrders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      {/* Order Info Column */}
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-slate-900 tracking-tight">#{order.id}</span>
                          <span className="text-xs text-slate-800 font-semibold mt-0.5">{order.customer}</span>
                        </div>
                      </td>
                      {/* Items Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                            <img
                            src={`http://localhost:5000/${order.food_images?.split(",")[0]}`}
                            alt="Food"
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                            />
                            <div>
                            <span className="text-slate-800 font-semibold line-clamp-1 truncate block">
                                {order.items}
                            </span>
                            <span className="text-[11px] text-slate-600">
                                {new Date(order.pickup_time).toLocaleString()}
                            </span>
                            </div>
                        </div>
                        </td>
                      {/* Pricing Column */}
                      <td className="py-4 px-6 font-extrabold text-slate-900">
                        ₹{order.total_amount}
                      </td>
                      {/* Status Column */}
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getStatusStyle(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      {/* Actions Column */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                            className={`p-1.5 rounded-lg transition-colors ${selectedOrder?.id === order.id ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                          >
                            <Eye className="w-4 h-4 stroke-[2.2]" />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Inline Status Action Control Panel */}
                        {selectedOrder && selectedOrder.id === order.id && (
                        <tr>
                            <td colSpan={5} className="py-3 px-6 bg-slate-50/40">
                            <div className="w-full mt-2 bg-white border border-slate-200 rounded-xl p-5 transition-all animate-fadeIn shadow-xs">
                                
                                {/* Main Content Layout Wrapper */}
                                <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                                
                                {/* LEFT SIDE: Items Breakdown and OTP Block */}
                                <div className="flex-1 space-y-3 w-full">
                                    <div className="text-xs font-semibold text-slate-700 leading-relaxed">
                                    <span className="font-bold text-slate-900 block mb-1">Full Items Stack Breakdown:</span>
                                    <p className="bg-white  p-2.5 text-slate-800 font-medium">
                                        {order.items}
                                    </p>
                                    </div>

                                    {order.status === "ready" && (
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 max-w-xs transition-all animate-fadeIn">
                                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                                        Pickup OTP
                                        </p>
                                        <p className="text-xl font-extrabold text-emerald-700 tracking-widest mt-0.5">
                                        {order.otp || "----"}
                                        </p>
                                    </div>
                                    )}
                                </div>

                                {/* RIGHT SIDE: Action Triggers Panel */}
                                <div className="flex flex-col items-end gap-2 flex-shrink-0 w-full md:w-auto">
                                    <span className="text-[10px] font-bold text-slate-900 uppercase tracking-wider block mb-1 md:text-right">
                                    Workflow Status Operations
                                    </span>
                                    <div className="flex flex-wrap gap-2 justify-start md:justify-end">
                                    {order.status === "pending" && (
                                        <button
                                        onClick={() => handleUpdateStatus(order.id, "accepted")}
                                        className="px-3 py-1.5 text-[11px] font-bold bg-blue-50 text-blue-600 border border-blue-100 rounded-md hover:bg-blue-100/50 transition-colors"
                                        >
                                        Accept Order
                                        </button>
                                    )}
                                    
                                    {order.status === "accepted" && (
                                        <button
                                        onClick={() => handleUpdateStatus(order.id, "preparing")}
                                        className="px-3 py-1.5 text-[11px] font-bold bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md hover:bg-indigo-100/50 transition-colors"
                                        >
                                        Start Preparing
                                        </button>
                                    )}
                                    
                                    {order.status === "preparing" && (
                                        <button
                                        onClick={() => handleUpdateStatus(order.id, "ready")}
                                        className="px-3 py-1.5 text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-100 rounded-md hover:bg-amber-100/50 transition-colors"
                                        >
                                        Mark Ready
                                        </button>
                                    )}
                                    
                                    {order.status === "ready" && (
                                        <button
                                        onClick={() => handleUpdateStatus(order.id, "delivered")}
                                        className="px-3 py-1.5 text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md hover:bg-emerald-100/50 transition-colors"
                                        >
                                        Deliver Order
                                        </button>
                                    )}
                                    
                                    {(order.status === "pending" || order.status === "ready") && (
                                        <button
                                        onClick={() => handleUpdateStatus(order.id, "cancelled")}
                                        className="px-3 py-1.5 text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-100 rounded-md hover:bg-rose-100/50 transition-colors"
                                        >
                                        Cancel Order
                                        </button>
                                    )}
                                    </div>
                                </div>

                                </div>

                            </div>
                            </td>
                        </tr>
                        )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* 📱 MOBILE CARDS VIEW STACK CONTAINER (Fulfill track footprint cleaned out completely) */}
          <div className="block md:hidden space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col gap-3 shadow-xs">
                {/* Header Row: ID, Time, Status Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-extrabold text-slate-900 tracking-tight">#{order.id}</span>
                    <span className="text-xs text-slate-400 font-semibold mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {order.pickup_time}
                    </span>
                  </div>
                  <span className={`inline-block px-1.5 py-0.2 border text-[9px] font-bold uppercase rounded-md tracking-wider ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Body Row: Customer Name & Full Items List String */}
                <div className="bg-slate-50/60 rounded-xl p-2.5 text-xs flex gap-3">
                    <img
                        src={`http://localhost:5000/${order.food_images?.split(",")[0]}`}
                        alt="Food"
                        className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div>
                        <div className="font-bold text-slate-800">
                        {order.customer}
                        </div>
                        <div className="font-semibold text-slate-500">
                        {order.items}
                        </div>
                    </div>
                    </div>
                {/* Footer Row: Price, Action Row Trigger */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="text-sm font-extrabold text-slate-900">₹{order.total_amount}</span>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'preparing')} 
                      className="p-1 text-blue-500 hover:bg-blue-50 rounded-md"
                      title="Prepare"
                    >
                      <Clock className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'completed')} 
                      className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-md"
                      title="Complete"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(order.id, 'cancelled')} 
                      className="p-1 text-rose-500 hover:bg-rose-50 rounded-md"
                      title="Cancel"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}

            {filteredOrders.length === 0 && (
              <div className="text-center bg-white border border-slate-100 rounded-2xl p-8 text-slate-400 text-xs font-semibold">
                No current orders found matching your filtered dashboard selection criteria.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}