import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, SlidersHorizontal, Plus, Edit3, Trash2 } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNavbar from '../components/AdminNavbar'; 
export default function AdminMenuManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');
  // State keys updated to match database table structure requirements
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    refill_threshold: 20,
    refill_quantity: 20,
    status: "available",
    food_image: ""
  });
  const [foodItems, setFoodItems] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const categories = ["All", "Breakfast", "Lunch", "Snacks", "Drinks"];

  // Filter items logic
  const filteredItems = foodItems.filter(item => {
    const matchesTab = activeCategory === "All" || item.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesTab;
  });

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`http://localhost:5000/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/food/all");
      setFoodItems(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddItem = async () => {
    try {
      await axios.post("http://localhost:5000/api/food/add", {
        name: newItem.name,
        category: newItem.category,
        price: Number(newItem.price),
        quantity: Number(newItem.quantity),
        refill_threshold: Number(newItem.refill_threshold),
        refill_quantity: Number(newItem.refill_quantity),
        status: newItem.status,
        food_image: newItem.food_image
      });
      alert("Food item added successfully");
      fetchFoods(); // Fixed function execution name bug here
      setNewItem({
        name: "",
        category: "",
        price: "",
        quantity: "",
        refill_threshold: 20,
        refill_quantity: 20,
        status: "available",
        food_image: ""
      });
      setShowAddForm(false);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to add food item");
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/food/update/${editingItem.id}`, editingItem);
      setEditingItem(null);
      fetchFoods();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/food/delete/${id}`);
      fetchFoods();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchFoods();
    // Removed unintended immediate trigger calls to handleAddItem, handleUpdate, and handleDelete from here
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-['Poppins',sans-serif] text-slate-800">
      
      {/* 💻 FIXED LEFT DESKTOP SIDEBAR LINK */}
      <AdminSidebar currentActive="Menu Management" />

      {/* 🚀 WORKSPACE INNER TRACK CONTAINER */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 w-full">
        
        {/* GLOBAL HEADER ADMIN NAVBAR */}
        <AdminNavbar user={user} title="Menu Management" />
        
        {/* PAGE CONTENT CONTAINER BLOCK */}
        <div className="p-4 md:p-8 space-y-4 md:space-y-5 max-w-full box-border pb-24 md:pb-8">
          
                    {/* 🏷️ Categories */}
          <div className="w-full  px-4 md:px-0 py-0 space-y-1">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {categories?.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                      activeCategory === category
                        ? "bg-[#0B132B] text-white"
                        : "bg-white border border-slate-200 text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center justify-center gap-1.5 bg-[#020B19] hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-colors shadow-xs">
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
                Add Item
              </button>
            </div>
          </div>

          {/* 📍 ADD FOOD ITEM FORM CONTAINER (Injected smoothly below categories and above search block) */}
          {showAddForm && (
            <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs space-y-4 animate-fadeIn">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Adding Food Item
                </h3>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* name */}
                <div>
                  <label className="text-xs font-bold text-slate-900">Food Name</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400"
                    placeholder="Veg Biriyani"
                  />
                </div>

                {/* category -> enum values match database scheme */}
                <div>
                  <label className="text-xs font-bold text-slate-900">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:border-slate-400"
                  >
                    <option value="">Select Category</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="snacks">Snacks</option>
                    <option value="drinks">Drinks</option>
                  </select>
                </div>

                {/* price */}
                <div>
                  <label className="text-xs font-bold text-slate-900">Price (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.price}
                    onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-400"
                    placeholder="50"
                  />
                </div>

                {/* quantity */}
                <div>
                  <label className="text-xs font-bold text-slate-900">Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400"
                    placeholder="100"
                  />
                </div>

                {/* refill_threshold */}
                <div>
                  <label className="text-xs font-bold text-slate-900">Refill Threshold</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.refill_threshold}
                    onChange={(e) => setNewItem({ ...newItem, refill_threshold: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                {/* refill_quantity */}
                <div>
                  <label className="text-xs font-bold text-slate-900">Refill Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={newItem.refill_quantity}
                    onChange={(e) => setNewItem({ ...newItem, refill_quantity: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400"
                  />
                </div>

                {/* status */}
                <div>
                  <label className="text-xs font-bold text-slate-900">Status</label>
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 focus:outline-none focus:border-slate-400"
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>

                {/* food_image */}
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-900">Food Image Path</label>
                  <input
                    type="text"
                    maxLength={255}
                    value={newItem.food_image}
                    onChange={(e) => setNewItem({ ...newItem, food_image: e.target.value })}
                    className="w-full mt-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:outline-none focus:border-slate-400"
                    placeholder="food_images/biryani.jpg"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleAddItem}
                  className="bg-[#020B19] hover:bg-slate-800 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Save Item
                </button>
              </div>
            </div>
          )}

          {/* 🔍 SEARCH AND FILTER PANEL AREA */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search for food..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 md:bg-white border border-transparent md:border-slate-200 rounded-xl text-sm focus:outline-none focus:border-slate-400 transition-all text-slate-700"
              />
            </div>
            <button className="p-2.5 bg-slate-100 md:bg-white border border-transparent md:border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors">
              <SlidersHorizontal size={20} strokeWidth={2} />
            </button>
          </div>

          {/* 💻 LAPTOP/DESKTOP DATATABLE LAYOUT VIEWPORT */}
          <div className="hidden md:block bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Item</th>
                  <th className="py-3.5 px-6">Category</th>
                  <th className="py-3.5 px-6">Price</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm font-medium text-slate-700">
                {filteredItems.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-6 flex items-center gap-3">
                        <img src={`http://localhost:5000/${item.food_image}`} alt={item.name} className="w-10 h-10 rounded-xl object-cover bg-slate-50 border border-slate-100 shadow-xs" />
                        <span className="font-bold text-slate-800 tracking-tight">{item.name}</span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-900 font-semibold capitalize">{item.category}</td>
                      <td className="py-3.5 px-6 font-extrabold text-slate-900">₹{item.price}</td>
                      <td className="py-3.5 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide border ${
                          item.status === 'available' 
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                            : 'bg-rose-50 text-rose-600 border-rose-100'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => setEditingItem(item)} className="p-1.5 text-slate-600 hover:text-slate-700 transition-colors">
                            <Edit3 className="w-4 h-4 stroke-[2.2]" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 text-rose-600 hover:text-rose-700 transition-colors">
                            <Trash2 className="w-4 h-4 stroke-[2.2]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Inline Row Editor for Desktop View */}
                    {editingItem && editingItem.id === item.id && (
                      <tr>
                        <td colSpan={5} className="py-3 px-6 bg-slate-50/40">
                          <div className="w-full mt-3 bg-slate-50/80 border border-slate-300 rounded-xl p-4 transition-all animate-fadeIn">
                            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider mb-3">
                              Editing Menu Item
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                              <div>
                                <label className="text-[11px] font-bold text-slate-800">Item Name</label>
                                <input
                                  type="text"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 shadow-xs"
                                  value={editingItem.name}
                                  onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-800">Price (₹)</label>
                                <input
                                  type="number"
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-400 shadow-xs"
                                  value={editingItem.price}
                                  onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                                />
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-800">Category</label>
                                <select
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 shadow-xs"
                                  value={editingItem.category || "breakfast"}
                                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                                >
                                  <option value="breakfast">Breakfast</option>
                                  <option value="lunch">Lunch</option>
                                  <option value="snacks">Snacks</option>
                                  <option value="drinks">Drinks</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-[11px] font-bold text-slate-800">Status</label>
                                <select
                                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:outline-none focus:border-slate-400 shadow-xs"
                                  value={editingItem.status || "Available"}
                                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value })}
                                >
                                  <option value="available">Available</option>
                                  <option value="unavailable">Unavailable</option>
                                </select>
                              </div>
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-slate-200/60">
                              <button onClick={() => setEditingItem(null)} className="px-3 py-1.5 border border-slate-200 text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-bold transition-colors">
                                Cancel
                              </button>
                              <button onClick={handleUpdate} className="px-4 py-1.5 bg-[#020B19] hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs transition-colors">
                                Save Changes
                              </button>
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

          {/* 📱 MOBILE CARDS VIEW STACK CONTAINER */}
          <div className="block md:hidden space-y-3">
            {filteredItems.map((item) => (
              <div key={item.id} className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={`http://localhost:5000/${item.food_image}`} alt={item.name} className="w-14 h-14 rounded-xl object-cover bg-slate-50 border border-slate-100 shadow-xs" />
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-800 truncate tracking-tight">{item.name}</h4>
                    <p className="text-[11px] font-semibold text-slate-400 mt-0.5 capitalize">{item.category}</p>
                    <span className={`inline-block px-1.5 py-0.2 border text-[9px] font-bold rounded-md mt-1 ${
                      item.status === 'available'
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        : 'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 flex flex-col items-end justify-between h-14">
                  <span className="text-sm font-extrabold text-slate-900">₹{item.price}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => setEditingItem(item)} className="p-1 text-slate-400 hover:text-slate-600">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1 text-rose-400 hover:text-rose-600">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredItems.length === 0 && (
              <div className="text-center bg-white border border-slate-100 rounded-2xl p-8 text-slate-400 text-xs font-semibold">
                No items match your selected filter or search criteria.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}