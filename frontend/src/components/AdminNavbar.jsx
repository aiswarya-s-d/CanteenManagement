import { Bell, User, ChevronDown, Menu } from "lucide-react";
export default function AdminNavbar({user, title = "Admin Dashboard" }) {
  return (
    <header className="bg-white border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button className="md:hidden p-1 text-slate-600 hover:bg-slate-100 rounded-lg">
          <Menu size={22} />
        </button>

        <h2 className="text-sm md:text-base font-semibold text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-slate-800 relative bg-slate-50 rounded-full transition-colors">
          <Bell size={18} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
        </button>

        <div className="flex items-center gap-2 cursor-pointer border-l pl-4 border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
            <User size={16} />
          </div>
          <span className="hidden sm:inline text-sm font-medium text-slate-900">
            {user?.name || "John Doe"}
          </span>
          <ChevronDown size={14} className="text-slate-400 hidden sm:inline" />
        </div>
      </div>
    </header>
  );
}