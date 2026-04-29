import { Outlet, NavLink, useNavigate, Navigate } from "react-router";
import { 
  LayoutDashboard, Package, RefreshCw, Wrench, 
  Settings, Menu, X, LogOut, User 
} from "lucide-react";
import { useState } from "react";

export function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Get user info from localStorage
  const role = localStorage.getItem("userRole");
  const subRole = localStorage.getItem("userSubRole") || "Guest";
  const userName = localStorage.getItem("userName") || "User";

  // Redirect to login if no role is found
  if (!role) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Define navigation based on user role
  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard, access: ["admin", "user"] },
    { path: "/equipment", label: "Equipment", icon: Package, access: ["admin", "user"] },
    { path: "/checkinout", label: "Check-In/Out", icon: RefreshCw, access: ["admin", "user"] },
    { path: "/maintenance", label: "Maintenance", icon: Wrench, access: ["admin"] },
    { path: "/admin", label: "Admin Panel", icon: Settings, access: ["admin"] },
  ].filter(item => item.access.includes(role));

  /**
   * Reusable Sidebar Content to avoid duplication between 
   * Desktop Sidebar and Mobile Drawer
   */
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white">
      {/* Branding Section */}
      <div className="p-8 flex justify-between items-center">
        <div>
          <h1 className="font-black text-2xl text-blue-600 tracking-tighter">SmartLab</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">System v2.0</p>
        </div>
        {/* Close button - visible on mobile drawer only */}
        <button 
          className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-full" 
          onClick={() => setMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "/"}
            onClick={() => setMobileMenuOpen(false)} // Auto-close on click
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold text-sm transition-all ${
                isActive 
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-100" 
                  : "text-gray-500 hover:bg-gray-50"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Profile/Logout Card */}
      <div className="p-6">
        <div className="bg-gray-50 p-4 rounded-3xl flex items-center gap-3 border border-gray-100">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${
            role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'
          }`}>
            <User size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black text-gray-900 truncate">{userName}</p>
            <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{subRole}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-[#F8FAFC] overflow-hidden">
      
      {/* --- MOBILE HEADER --- */}
      <header className="md:hidden flex items-center justify-between p-5 bg-white border-b border-gray-100 sticky top-0 z-40">
        <h1 className="font-black text-xl text-blue-600 tracking-tighter">SmartLab</h1>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="p-2 bg-gray-50 rounded-xl text-gray-600 active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>
      </header>

      {/* --- MOBILE DRAWER & OVERLAY --- */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop Blur/Darken */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
            onClick={() => setMobileMenuOpen(false)} 
          />
          
          {/* Animated Sidebar Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* --- DESKTOP PERMANENT SIDEBAR --- */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-white border-r border-gray-100 h-full">
        <SidebarContent />
      </aside>

      {/* --- MAIN PAGE CONTENT --- */}
      <main className="flex-1 overflow-auto relative">
        <Outlet />
      </main>
    </div>
  );
}