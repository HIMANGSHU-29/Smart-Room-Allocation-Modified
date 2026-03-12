import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, DoorOpen, Zap, FileBarChart, Settings, LogOut, ChevronRight, Menu, X as CloseIcon, Calendar } from "lucide-react";
import logo from "../assets/logo.svg";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Overview", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { name: "Students", icon: <Users size={18} />, path: "/dashboard/students" },
    { name: "Exam Halls", icon: <DoorOpen size={18} />, path: "/dashboard/rooms" },
    { name: "Exams", icon: <Calendar size={18} />, path: "/dashboard/exams" },
    { name: "Seating Plan", icon: <Zap size={18} />, path: "/dashboard/allocation" },
    { name: "Reports", icon: <FileBarChart size={18} />, path: "/dashboard/reports" },
    { name: "Settings", icon: <Settings size={18} />, path: "/dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-[#FFFAF0] font-sans text-slate-900 relative">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-64 sidebar-gradient text-slate-400 flex flex-col fixed inset-y-0 z-[60] shadow-2xl transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center justify-between border-b border-white/5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center text-white overflow-hidden p-0.5">
              <img src={logo} alt="AllocateU Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-lg tracking-widest font-black tracking-tight text-white font-agraham"><b>AllocateU</b></span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white transition-all">
            <CloseIcon size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] px-4 mb-4">Core Management</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === "/dashboard" && location.pathname === "/dashboard/");
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl font-semibold transition-all group ${isActive
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/10"
                  : "hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} className="text-white/50" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-4">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1">System Status</p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white/60">All Modules Active</span>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-white/40 font-bold hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm"
          >
            <LogOut size={18} />
            Termination Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen transition-all">
        <header className="h-16 border-b border-slate-200 bg-[#FFFAF0] sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="text-[10px] lg:text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span className="text-slate-900">{menuItems.find(i => i.path === location.pathname)?.name || "Dashboard"}</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 shadow-sm overflow-hidden flex items-center justify-center p-1">
              <div className="w-full h-full bg-white rounded-full"></div>
            </div>
          </div>
        </header>
        <div className="p-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
