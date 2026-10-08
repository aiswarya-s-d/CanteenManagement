import {
  Home,
  UtensilsCrossed,
  ShoppingBag,
  User
} from "lucide-react";

import {
  useNavigate,
  useLocation
} from "react-router-dom";

export default function MobileFooter() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <footer className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-2 py-2 flex justify-around items-center z-30 shadow-lg">

      <button
        onClick={() => navigate("/dashboard")}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
          location.pathname === "/dashboard"
            ? "text-[#0B132B] font-semibold"
            : "text-slate-400"
        }`}
      >
        <Home size={20} />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        onClick={() => navigate("/menu")}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
          location.pathname === "/menu"
            ? "text-[#0B132B] font-semibold"
            : "text-slate-400"
        }`}
      >
        <UtensilsCrossed size={20} />
        <span className="text-[10px]">Menu</span>
      </button>

      <button
        onClick={() => navigate("/orders")}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
          location.pathname === "/orders"
            ? "text-[#0B132B] font-semibold"
            : "text-slate-400"
        }`}
      >
        <ShoppingBag size={20} />
        <span className="text-[10px]">Orders</span>
      </button>

      <button
        onClick={() => navigate("/profile")}
        className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
          location.pathname === "/profile"
            ? "text-[#0B132B] font-semibold"
            : "text-slate-400"
        }`}
      >
        <User size={20} />
        <span className="text-[10px]">Profile</span>
      </button>

    </footer>
  );
}