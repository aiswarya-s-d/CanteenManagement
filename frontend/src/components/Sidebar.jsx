import { Home, UtensilsCrossed, ShoppingBag, User } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
     <aside className="hidden md:flex flex-col w-64 bg-[#020B19] text-slate-300 fixed h-full z-20 shadow-xl">
        <div className="p-6 flex items-center gap-2">
        <img 
          src={`http://localhost:5000/auth_images/logo.jpg`} 
          alt="Logo" 
          className="w-8 h-8 object-contain rounded-full mix-blend-lighten"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        {/* Text matched exactly to fss6.jpg */}
        <h1 className="text-[17px] font-semibold text-white tracking-wide font-['Poppins',sans-serif]">
          CanteenHub
        </h1>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => navigate('/dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-[#1C2541] text-white font-semibold' : 'hover:bg-[#1C2541]/50 text-slate-400'}`}
          >
            <Home size={18} /> Home
          </button>
          <button 
            onClick={() => navigate('/menu')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/menu' ? 'bg-[#1C2541] text-white font-semibold' : 'hover:bg-[#1C2541]/50 text-slate-400'}`}
          >
            <UtensilsCrossed size={18} /> Menu
          </button>
          <button 
            onClick={() => navigate('/orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/orders' ? 'bg-[#1C2541] text-white font-semibold' : 'hover:bg-[#1C2541]/50 text-slate-400'}`}
          >
            <ShoppingBag size={18} /> My Orders
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${location.pathname === '/  profile' ? 'bg-[#1C2541] text-white font-semibold' : 'hover:bg-[#1C2541]/50 text-slate-400'}`}
          >
            <User size={18} /> Profile
          </button>
        </nav>
      </aside>
  );
}