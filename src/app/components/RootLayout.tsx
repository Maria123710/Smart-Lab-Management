import { Outlet, NavLink, useNavigate, Navigate } from "react-router";
import { LayoutDashboard, Package, RefreshCw, Wrench, Settings, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";

export function RootLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const role = localStorage.getItem("userRole");
  const subRole = localStorage.getItem("userSubRole") || "Guest";
  const userName = localStorage.getItem("userName") || "User";

  if (!role) return <Navigate to="/login" replace />;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: LayoutDashboard, access: ["admin", "user"] },
    { path: "/equipment", label: "Equipment", icon: Package, access: ["admin", "user"] },
    { path: "/checkinout", label: "Check-In/Out", icon: RefreshCw, access: ["admin", "user"] },
    { path: "/maintenance", label: "Maintenance", icon: Wrench, access: ["admin"] },
    { path: "/admin", label: "Admin Panel", icon: Settings, access: ["admin"] },
  ].filter(item => item.access.includes(role));

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-72 bg-white border-r border-gray-100">
        <div className="p-8">
          <h1 className="font-black text-2xl text-blue-600 tracking-tighter">SmartLab</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">System v2.0</p>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-[1.25rem] font-bold text-sm transition-all ${
                  isActive ? "bg-blue-600 text-white shadow-xl shadow-blue-100" : "text-gray-500 hover:bg-gray-50"
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Profile Card at bottom */}
        <div className="p-6">
          <div className="bg-gray-50 p-4 rounded-3xl flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg ${role === 'admin' ? 'bg-purple-600' : 'bg-blue-600'}`}>
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-gray-900 truncate">{userName}</p>
              <p className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{subRole}</p>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}