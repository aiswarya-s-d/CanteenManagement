import React, { useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Lock, Eye, EyeOff, User, Mail, Building, Calendar, Upload } from 'lucide-react';
// Change this to match your actual backend server URL/port
const BACKEND_URL = 'http://localhost:5000'; 
export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    department: '',
    year: '',
    gender: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/signup",
      {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
        year: formData.year,
        gender: formData.gender
      }
    );
    navigate("/");
  } catch (error) {
    console.error(error);
    alert(
      error.response?.data?.message ||
      "Registration Failed"
    );
  }
};
  return (
    <div className="flex min-h-screen w-full bg-[#F4F7FA] items-center justify-center p-0 sm:p-6 md:p-10 antialiased">
      {/* Main Container Card */}
      <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white sm:rounded-[24px] shadow-md border border-gray-100 overflow-hidden min-h-screen sm:min-h-[640px]">
        
       {/* LEFT SIDE: Hero Brand Section (Dark Navy matched to Biryani image) */}
        <div className="w-full md:w-[40%] bg-[#020B19] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden h-[300px] sm:h-[340px] md:h-auto">
          
          {/* Brand Header */}
          <div className="flex items-center gap-2.5 z-10">
            <img 
              src={`${BACKEND_URL}/auth_images/logo.jpg`} 
              alt="CanteenHub Logo" 
              className="w-8 h-8 object-contain rounded-full mix-blend-lighten"
              onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <span className="font-semibold text-lg tracking-wide">CanteenHub</span>
          </div>

          {/* Welcome/Action Text Block */}
          <div className="mt-6 md:mt-12 mb-auto max-w-xs z-10">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2 sm:mb-3">Create your account</h1>
            <p className="text-gray-200 text-xs sm:text-sm leading-relaxed font-light">
              Join CanteenHub and enjoy easy ordering, fast pickup and delicious meals.
            </p>
          </div>

          {/* 💻 LAPTOP/DESKTOP ONLY: Background Horizon Fit Plate */}
          <div className="absolute bottom-[-11px] md:bottom-23  left-0 right-0 w-full overflow-hidden justify-center items-end pointer-events-none select-none h-[47.9%] z-10">
            <img 
              src={`${BACKEND_URL}/auth_images/login_food.png`} 
              alt="Delicious Biryani Platter" 
              className="w-full h-full object-cover object-center scale-105 origin-bottom"
              style={{
                WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)',
                maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 70%, rgba(0,0,0,0) 100%)'
              }}           
            />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#020B19] via-[#020B19]/60 via-[#020B19]/20 to-transparent"></div>
          </div>
          {/* Desktop Absolute bottom gradient shadow fade */}
          <div className="hidden md:block absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#020B19] via-[#020B19]/70 via-[#020B19]/20 to-transparent z-10"></div>
        </div>
        {/* RIGHT SIDE: Account Registration Form Workspace */}
        <div className="w-full md:w-[60%] p-6 sm:p-12 md:p-14 flex flex-col justify-center bg-white rounded-t-[24px] sm:rounded-t-none -translate-y-6 sm:translate-y-0 z-20 relative">
          
          {/* Section Title */}
          <div className="mb-6">
            <h2 className="text-2xl sm:text-[26px] font-bold text-gray-900 tracking-tight mb-1">Create your account</h2>
            <p className="text-sm text-gray-700 font-normal">Get started by creating your new account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Row 1: Full Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><User size={16} /></span>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-700"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Mail size={16} /></span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-700"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Row 2: Department & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Department</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Building size={16} /></span>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white text-gray-700"
                    required={formData.role !== 'admin'} // Department is required for students and staff
                  >
                    <option value="" disabled hidden>Select your department</option>
                    <option value="CS">CSE</option>
                    <option value="AIML">AIML</option>
                    <option value="CSBS">CSBS</option>
                    <option value="DS">DS</option>
                    <option value="IT">IT</option>
                    <option value="ECE">ECE</option>
                    <option value="EEE">EEE</option>
                    <option value="MECH">MECH</option>
                    <option value="MECT">MECT</option>
                    <option value="CIVIL">CIVIL</option>
                    <option value="ARCH">ARCH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Year</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Calendar size={16} /></span>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white text-gray-700"
                    required={formData.role === 'student'} // Year is required only for students
                  >
                    <option value="" disabled hidden>Select your year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                  </select>
                </div>
              </div>
            </div>
           {/* Row 3: Gender & Role Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Gender</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><User size={16} /></span>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white text-gray-700"
                    required={formData.role !== 'admin'} // Gender is required for students
                  >
                    <option value="" disabled hidden>Select your gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Role</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                    <User size={16} />
                  </span>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all bg-white text-gray-700"
                    required
                  >
                    <option value="" disabled hidden>Select your role</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Row 4: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Lock size={16} /></span>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-700"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400"><Lock size={16} /></span>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all placeholder:text-gray-700"
                    required/>
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>
            {/* Terms and Conditions Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-500 select-none">
                <input 
                  type="checkbox" 
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500/40" 
                  required
                />
                <span className="leading-normal">
                  I agree to the <a href="#terms" className="font-medium text-blue-600 hover:underline">Terms & Conditions</a> and <a href="#privacy" className="font-medium text-blue-600 hover:underline">Privacy Policy</a>
                </span>
              </label>
            </div>
            {/* Primary Sign Up Trigger Button */}
            <button 
              type="submit" 
              className="w-full bg-[#020B19] hover:bg-[#071733] text-white text-sm font-medium py-3 rounded-lg transition-all shadow-sm tracking-wide"
            >
              Sign Up
            </button>
    </form>
          {/* Social Splitter Label */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-xs text-gray-400 font-normal">or continue with</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>
          {/* Alternative OAuth Connectors */}
          <div className="grid grid-cols-2 gap-3.5">
            <button type="button" className="flex items-center justify-center gap-2.5 px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <img src={`${BACKEND_URL}/auth_images/google.svg`} alt="Google" className="w-4 h-4 object-contain" />
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2.5 px-3 py-2.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-all">
              <img src={`${BACKEND_URL}/auth_images/microsoft.svg`} alt="Microsoft" className="w-4 h-4 object-contain" />
              Microsoft
            </button>
          </div>
          {/* Context Switching Prompt */}
          <p className="text-center text-xs text-gray-400 mt-6 font-normal">
            Already have an account? {' '}
            <span onClick={() => navigate("/")} className="font-semibold text-blue-600 hover:underline">
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}