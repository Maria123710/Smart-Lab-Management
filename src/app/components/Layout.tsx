import { useAuth } from '../context/AuthContext';
import { LogOut, Shield, User } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { role, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Shield size={20} />
          </div>
          <h1 className="font-black text-gray-900 tracking-tight">SMARTLAB</h1>
          <span className="ml-4 px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500 border border-gray-200">
            {role} mode
          </span>
        </div>
        
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-xs font-black text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
        >
          <LogOut size={16} /> LOGOUT
        </button>
      </nav>
      <main>{children}</main>
    </div>
  );
}