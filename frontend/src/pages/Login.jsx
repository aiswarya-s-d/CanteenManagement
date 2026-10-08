import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, User } from 'lucide-react';

// Change this to match your actual backend server URL/port
const BACKEND_URL = 'http://localhost:5000'; 
export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    emailOrPhone: '',
    password: '',
    rememberMe: false
  });
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/login",
      {
        email: formData.email,
        password: formData.password
      }
    );
    const user = response.data.user;
    localStorage.setItem("token",response.data.token);
    localStorage.setItem("user",JSON.stringify(response.data.user));
    console.log("Token Saved");
    if (user.role === "admin") {
       localStorage.setItem(
        "adminToken",
        response.data.token
      );
      localStorage.setItem(
      "admin",
      JSON.stringify(user)
    );
      navigate("/admin/dashboard");
    } else {
       localStorage.setItem(
        "token",
        response.data.token
      );
       navigate("/dashboard");
    }
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.message ||"Login Failed");}
};
  return (
    <div className="flex min-h-screen w-full bg-[#F4F7FA] items-center justify-center p-0 sm:p-6 md:p-10 antialiased">
      {/* Main Container Card */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white sm:rounded-[24px] shadow-md border border-gray-100 overflow-hidden min-h-screen sm:min-h-[640px]">
        
        {/* HERO BRAND SECTION (Dark Navy matched to Biryani image) */}
        {/* On mobile: full width, fixed layout height. On desktop: fixed 40% width sidebar */}
        <div className="w-full md:w-[40%] bg-[#020B19] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden h-[320px] sm:h-[360px] md:h-auto">
          
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 z-10">
            <img 
              src={`${BACKEND_URL}/auth_images/logo.jpg`} 
              alt="CanteenHub Logo" 
              className="w-8 h-8 object-contain rounded-full mix-blend-lighten"
              onError={(e) => { 
                e.target.style.display = 'none';
              }} 
            />
            <span className="font-semibold text-lg tracking-wide">CanteenHub</span>
          </div>

          {/* Welcome Text Block */}
          <div className="mt-6 md:mt-12 mb-auto max-w-xs z-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-3">Welcome Back!</h1>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed font-light">
              Login to your account and continue ordering your favorite meals.
            </p>
          </div>

          {/* Biryani Dish Placement - Horizon Fit */}
          <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden flex justify-center items-end pointer-events-none select-none h-[50%] md:h-[55%]">
            <img 
              src={`${BACKEND_URL}/auth_images/login_food.png`} 
              alt="Delicious Biryani Platter" 
              className="w-full h-full object-cover object-center scale-105 origin-bottom"
            />
            {/* Top Vignette Layer to seamlessly fade the image background into the solid container top */}
            <div className="absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-[#020B19] to-transparent"></div>
          </div>
        </div>

        {/* RIGHT SIDE / LOWER SIDE: Authentication Form Workspace */}
        <div className="w-full md:w-[60%] p-6 sm:p-14 md:p-16 flex flex-col justify-center bg-white rounded-t-[24px] sm:rounded-t-none -translate-y-6 sm:translate-y-0 z-20 relative">
          
          {/* Section Title */}
          <div className="mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight mb-1">Login to your account</h2>
            <p className="text-sm text-gray-700 font-normal">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Identity Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-500"
                  required
                />
              </div>
            </div>
            {/* Credential Field */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Utility Options */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-gray-500 select-none">
                <input 
                  type="checkbox" 
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/40 transition-all" 
                />
                Remember me
              </label>
              <a href="#forgot" className="font-medium text-blue-600 hover:underline">
                Forgot Password?
              </a>
            </div>

            {/* Action Trigger Button */}
            <button 
              type="submit" 
              className="w-full bg-[#020B19] hover:bg-[#071733] text-white text-sm font-medium py-3 rounded-lg transition-all shadow-sm mt-2 tracking-wide"
            >
              Login
            </button>
          </form>

          {/* Decorative Divider */}
          <div className="relative flex py-5 sm:py-6 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-600 font-normal">or continue with</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Social Platforms */}
          <div className="grid grid-cols-2 gap-3.5">
            <button className="flex items-center justify-center gap-2.5 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <img src={`${BACKEND_URL}/auth_images/google.svg`} alt="Google" className="w-4 h-4 object-contain" />
              <span className="hidden xs:inline">Continue with </span>Google
            </button>
            <button className="flex items-center justify-center gap-2.5 px-3 sm:px-4 py-2.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <img src={`${BACKEND_URL}/auth_images/microsoft.svg`} alt="Microsoft" className="w-4 h-4 object-contain" />
              <span className="hidden xs:inline">Continue with </span>Microsoft
            </button>
          </div>

          {/* Footer Registration Link */}
          <p className="text-center text-xs text-gray-600 mt-6 sm:mt-8 font-normal">
            Don't have an account? {' '}
            <span onClick={() => navigate("/signup")} className="font-semibold text-blue-600 hover:underline">
              Sign Up
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}