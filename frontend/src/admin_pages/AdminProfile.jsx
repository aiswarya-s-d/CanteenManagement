import React, { useState } from 'react';
import { User, Lock, Bell, HelpCircle, ChevronRight, Check } from 'lucide-react';
import AdminSidebar from "../components/AdminSidebar";
import AdminNavbar from "../components/AdminNavbar";
import MobileFooter from "../components/MobileFooter";
export default function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("admin")) || {
  name: "Admin",
  email: "admin@tce.edu",
  phone: "9876543210",
  role: "Admin"
};
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify(formData));
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };
  const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.href = "/";
};
  return (
    /* 🌐 GLOBAL OUTER CONTAINER: Native scrollbar moves to the rightmost edge of the entire screen on desktop */
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-['Poppins',sans-serif] relative overflow-x-hidden md:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      
      <AdminSidebar />

      {/* 🚀 MAIN CONTENT PANE */}
      <main className="flex-1 md:pl-64 flex flex-col min-w-0 w-full h-full overflow-x-hidden">
        <AdminNavbar user={user} title="Profile" />

        <section className="p-4 md:p-8 space-y-5 w-full max-w-5xl box-border overflow-x-hidden pb-24 md:pb-12 mx-auto">
          
          {/* ✨ TOAST NOTIFICATION */}
          {saveSuccess && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm p-3 rounded-xl max-w-full">
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* 🗂️ GRID WRAPPER FOR SEPARATED TOP SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start w-full">
            
            {/* 📋 SEPARATED PERSONAL INFORMATION CARD */}
            <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm md:col-span-2 w-full box-border">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                  Personal Information
                </h3>
                
                {!isEditing ? (
                  <button 
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => { setIsEditing(false); setFormData({ ...user }); }}
                      className="text-xs font-medium text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button"
                      onClick={handleSave}
                      className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* 📱 ENLARGED NESTED GRAY DEFAULT AVATAR BADGE FOR MOBILE ONLY */}
              <div className="flex md:hidden items-center gap-4 bg-slate-50/60 p-3 rounded-xl mb-4 border border-slate-100/60">
                <div className="w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex-shrink-0 flex items-center justify-center">
                  <User className="w-10 h-10 text-slate-400" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{formData.name}</h4>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">{formData.role}</p>
                  <p className="text-[10px] text-slate-400 font-medium truncate">Canteen Hub</p>
                </div>
              </div>

              {/* FORM FIELDS INNER LAYOUT CONTAINER */}
              <form className="w-full space-y-2">
                <div className="space-y-2 text-xs sm:text-sm">
                  {/* Full Name */}
                  <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-0.5 sm:gap-4">
                    <label className="sm:w-1/3 font-medium text-slate-600">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} className="flex-1 font-semibold text-slate-800 bg-transparent disabled:bg-transparent border-0 border-b border-transparent focus:border-blue-500 p-0 py-0.5 outline-none disabled:text-slate-800 transition-colors" />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-0.5 sm:gap-4 border-t border-slate-50 pt-2">
                    <label className="sm:w-1/3 font-medium text-slate-600">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} disabled={!isEditing} className="flex-1 font-semibold text-slate-800 bg-transparent disabled:bg-transparent border-0 border-b border-transparent focus:border-blue-500 p-0 py-0.5 outline-none disabled:text-slate-800 transition-colors" />
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-0.5 sm:gap-4 border-t border-slate-50 pt-2">
                    <label className="sm:w-1/3 font-medium text-slate-600">Phone</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} disabled={!isEditing} className="flex-1 font-semibold text-slate-800 bg-transparent disabled:bg-transparent border-0 border-b border-transparent focus:border-blue-500 p-0 py-0.5 outline-none disabled:text-slate-800 transition-colors" />
                  </div>

                  {/* Role */}
                  <div className="flex flex-col sm:flex-row sm:items-center py-1 gap-0.5 sm:gap-4 border-t border-slate-50 pt-2">
                    <label className="sm:w-1/3 font-medium text-slate-600">Role</label>
                    <input type="text" name="role" value={formData.role} onChange={handleChange} disabled={!isEditing} className="flex-1 font-semibold text-slate-800 bg-transparent disabled:bg-transparent border-0 border-b border-transparent focus:border-blue-500 p-0 py-0.5 outline-none disabled:text-slate-800 transition-colors" />
                  </div>
                </div>
              </form>
            </div>

            {/* 👤 ENLARGED SEPARATED DESKTOP AVATAR CARD */}
            <div className="hidden md:flex w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex-col items-center justify-center text-center box-border h-full min-h-[340px]">
              <div className="w-32 h-32 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner">
                <User className="w-16 h-16 text-slate-400" />
              </div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight mt-5">
                {formData.name}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {formData.role}
              </p>
              <p className="text-xs text-slate-600 font-semibold tracking-tight mt-4">
                Canteen Administrator
              </p>
            </div>

          </div>

          {/* 🛠️ SECTION 2: FULL WIDTH ACCOUNT SETTINGS PANEL */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 sm:p-6 shadow-sm w-full box-border">
            <div className="border-b border-slate-100 pb-2 mb-1">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                Account Settings
              </h3>
            </div>

            <div className="divide-y divide-slate-100/60">
              {/* Change Password */}
              <button type="button" className="w-full flex items-center justify-between py-3 group text-left">
                <div className="flex items-center gap-3">
                  <Lock className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Change Password</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              {/* Notification Settings */}
              <button type="button" className="w-full flex items-center justify-between py-3 group text-left">
                <div className="flex items-center gap-3">
                  <Bell className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Notification Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>

              {/* Help & Support */}
              <button type="button" className="w-full flex items-center justify-between py-3 group text-left">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  <span className="text-xs sm:text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">Help & Support</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
              </button>
            </div>

            {/* RED BORDERED LOGOUT STRIP BUTTON */}
            <div className="pt-3 mt-1">
              <button 
                type="button"
                onClick={handleLogout}
                className="w-full py-2.5 bg-white border border-rose-200 text-rose-500 rounded-xl text-xs sm:text-sm font-semibold tracking-wide hover:bg-rose-50 transition-colors text-center"
              >
                Logout
              </button>
            </div>
          </div>

        </section>
      </main>

      <MobileFooter />
    </div>
  );
}