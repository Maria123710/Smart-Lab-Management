import { useState } from "react";

import {
  Users, Shield, FileText, Download, TrendingDown, Scan, Settings, 
  UserPlus, Edit, Trash2, X, ArrowUpRight, ArrowDownLeft, Clock, 
  Search, Filter, ChevronRight
} from "lucide-react";


interface User {
  id: string;
  name: string;
  email: string;
  role: "Super Admin" | "Lab Assistant" | "Teacher" | "Student";
  department: string;
  status: "Active" | "Inactive";
  lastActive: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  category: "Access" | "Modification" | "Transaction" | "System";
}

interface StockPrediction {
  item: string;
  currentStock: number;
  predictedRunOut: string;
  avgUsagePerWeek: number;
  confidence: number;
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"users" | "audit" | "predictions" | "settings">("users");

  // --- Dynamic States ---
  const [users, setUsers] = useState<User[]>([
    { id: "U-001", name: "Dr. Rajesh Sharma", email: "rajesh.sharma@polytechnic.edu", role: "Super Admin", department: "CmT", status: "Active", lastActive: "2 hours ago" },
    { id: "U-002", name: "Suresh Kumar", email: "suresh.kumar@polytechnic.edu", role: "Lab Assistant", department: "CmT", status: "Active", lastActive: "10 min ago" },
    { id: "U-003", name: "Prof. Anjali Gupta", email: "anjali.gupta@polytechnic.edu", role: "Teacher", department: "EnT", status: "Active", lastActive: "1 hour ago" },
    { id: "U-004", name: "Rahul Sharma", email: "rahul.sharma@student.polytechnic.edu", role: "Student", department: "CmT", status: "Active", lastActive: "5 min ago" },
  ]);

  const [auditLogs] = useState<AuditLog[]>([
    { id: "A-001", timestamp: "Apr 28, 2026 2:45 PM", user: "Suresh Kumar (Lab Assistant)", action: "Equipment Check-out", details: "Arduino Uno R3 (EQ-001) issued to Rahul Sharma", category: "Transaction" },
    { id: "A-002", timestamp: "Apr 28, 2026 2:30 PM", user: "Priya Patel (Student)", action: "Equipment Check-in", details: "Returned Raspberry Pi 4B (EQ-102) - All components verified", category: "Transaction" },
    { id: "A-003", timestamp: "Apr 28, 2026 1:15 PM", user: "Dr. Rajesh Sharma", action: "User Modification", details: "Updated access permissions for Lab 302", category: "Modification" },
  ]);

  const [stockPredictions] = useState<StockPrediction[]>([
    { item: "Jumper Wires (M-M)", currentStock: 45, predictedRunOut: "May 05, 2026", avgUsagePerWeek: 15, confidence: 92 },
    { item: "330Ω Resistors", currentStock: 120, predictedRunOut: "May 15, 2026", avgUsagePerWeek: 35, confidence: 88 },
  ]);

  // UI States
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  const [notifs, setNotifs] = useState({ stock: true, overdue: true, maint: false });

  // --- User Management Handlers ---
  const handleUserDelete = (id: string) => {
    if (confirm("Permanently remove this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleUserSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      role: fd.get("role") as any,
      department: fd.get("dept") as string,
      status: "Active" as const,
      lastActive: "Just now",
    };

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
    } else {
      setUsers([...users, { id: `U-00${users.length + 1}`, ...data }]);
    }
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  // --- Audit & Reports Handlers ---
  const exportAuditLogs = () => {
    const csv = "Timestamp,User,Action,Details\n" + 
      auditLogs.map(l => `${l.timestamp},"${l.user}","${l.action}","${l.details}"`).join("\n");
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "Audit_Logs_Export.csv";
    a.click();
  };

  const downloadReport = (title: string) => {
    alert(`Generating dynamic ${title} PDF based on current database state...`);
  };

  // --- UI Helpers ---
  const getRoleStyle = (role: string) => {
    const map: any = {
      "Super Admin": "bg-purple-50 text-purple-700 border-purple-100",
      "Lab Assistant": "bg-blue-50 text-blue-700 border-blue-100",
      "Teacher": "bg-green-50 text-green-700 border-green-100",
      "Student": "bg-gray-50 text-gray-700 border-gray-100"
    };
    return map[role] || map["Student"];
  };

  const getLogIcon = (action: string) => {
    if (action.includes("Check-out")) return <ArrowUpRight className="w-4 h-4 text-orange-600" />;
    if (action.includes("Check-in")) return <ArrowDownLeft className="w-4 h-4 text-green-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-gray-50/30 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Admin Control Center</h1>
          <p className="text-gray-500 text-sm">Hardware lab management & system oversight</p>
        </div>
        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100">
          <Shield className="w-4 h-4 text-purple-600" />
          <span className="text-xs font-bold text-purple-700 uppercase">Super Admin</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50/50 overflow-x-auto">
          {[
            { id: "users", icon: Users, label: "Users" },
            { id: "audit", icon: FileText, label: "Audit Logs" },
            { id: "predictions", icon: TrendingDown, label: "Stock AI" },
            { id: "settings", icon: Settings, label: "Settings" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap ${
                activeTab === tab.id ? "bg-white border-b-2 border-blue-600 text-blue-600 shadow-[inset_0_-2px_0_0_#2563eb]" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100/50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "users" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                <h2 className="text-lg font-bold text-gray-900">User Maintenance</h2>
                <button 
                  onClick={() => { setEditingUser(null); setIsUserModalOpen(true); }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-95"
                >
                  <UserPlus size={18} /> <span className="text-sm font-bold">Add New User</span>
                </button>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80 text-gray-500 font-bold uppercase text-[10px] tracking-widest border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Identity</th>
                      <th className="px-6 py-4 text-left font-bold">Role & Dept</th>
                      <th className="px-6 py-4 text-left font-bold">Status</th>
                      <th className="px-6 py-4 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">{u.name}</div>
                          <div className="text-xs text-gray-400 font-medium">{u.email}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`inline-block px-2 py-0.5 rounded-md border text-[10px] font-black uppercase mb-1 ${getRoleStyle(u.role)}`}>{u.role}</div>
                          <div className="text-xs text-gray-500 font-semibold">{u.department} Dept.</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-1.5 text-xs font-bold ${u.status === "Active" ? "text-green-600" : "text-gray-400"}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${u.status === "Active" ? "bg-green-500" : "bg-gray-300"}`} />
                            {u.status}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingUser(u); setIsUserModalOpen(true); }} className="p-2 hover:bg-white rounded-lg text-blue-600 shadow-sm border border-transparent hover:border-blue-100"><Edit size={14} /></button>
                            <button onClick={() => handleUserDelete(u.id)} className="p-2 hover:bg-white rounded-lg text-red-600 shadow-sm border border-transparent hover:border-red-100"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "audit" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">Audit & Activity Log</h2>
                <button onClick={exportAuditLogs} className="flex items-center gap-2 px-4 py-2 border-2 border-gray-100 rounded-xl hover:border-blue-200 hover:text-blue-600 transition-all font-bold text-sm text-gray-600">
                  <Download size={16} /> Export CSV
                </button>
              </div>
              <div className="space-y-3">
                {auditLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/40 hover:bg-white hover:shadow-md transition-all flex gap-4">
                    <div className={`p-3 rounded-xl h-fit ${log.action.includes("Check-out") ? "bg-orange-50" : log.action.includes("Check-in") ? "bg-green-50" : "bg-blue-50"}`}>
                      {getLogIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-black text-gray-900">{log.action}</span>
                        <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-1 rounded-lg border border-gray-100">{log.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 font-medium">{log.details}</p>
                      <div className="flex items-center gap-2 text-[11px] font-bold text-gray-400">
                        <div className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] text-gray-600">{log.user[0]}</div>
                        {log.user}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "predictions" && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-gray-900">AI Stock Forecaster</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stockPredictions.map((s, i) => (
                  <div key={i} className="p-5 rounded-2xl border-2 border-orange-100 bg-white shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 -mr-8 -mt-8 rounded-full transition-transform group-hover:scale-110" />
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-black text-gray-900 text-base">{s.item}</h3>
                        <span className="text-xs font-black text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100">{s.confidence}% Match</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 p-2 rounded-xl border border-gray-100">
                          <p className="text-[10px] text-gray-400 uppercase font-black">Stock Status</p>
                          <p className="text-sm font-bold text-gray-700">{s.currentStock} Units</p>
                        </div>
                        <div className="bg-red-50 p-2 rounded-xl border border-red-100">
                          <p className="text-[10px] text-red-400 uppercase font-black">Depletion Date</p>
                          <p className="text-sm font-bold text-red-700">{s.predictedRunOut}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => alert(`Dynamic Procurement Order triggered for ${s.item}.`)}
                        className="w-full py-2.5 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 active:scale-95 transition-all"
                      >
                        Create Procurement Request
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8">
              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Inventory Verification</h3>
                <div className={`p-6 rounded-2xl border transition-all ${isAuditing ? "bg-red-50 border-red-200" : "bg-blue-50 border-blue-200"}`}>
                  <div className="flex items-start gap-4 mb-6">
                    <Scan className={`w-8 h-8 ${isAuditing ? "text-red-600" : "text-blue-600"}`} />
                    <div>
                      <h4 className="font-black text-gray-900">{isAuditing ? "LIVE AUDIT IN PROGRESS" : "Bulk Inventory Audit"}</h4>
                      <p className="text-sm text-gray-600 font-medium">Verify entire lab stock using quick-scan identification.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsAuditing(!isAuditing)}
                    className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${isAuditing ? "bg-red-600 text-white shadow-lg shadow-red-200" : "bg-blue-600 text-white shadow-lg shadow-blue-200"}`}
                  >
                    {isAuditing ? "Finalize & Sync Audit" : "Initialize Audit Session"}
                  </button>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Notifications</h3>
                <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
                  {[
                    { id: 'stock', t: 'Low Stock Alerts', d: 'Get notified when hardware units hit threshold', s: notifs.stock },
                    { id: 'overdue', t: 'Overdue Hardware', d: 'Alerts for items not returned on schedule', s: notifs.overdue },
                    { id: 'maint', t: 'Service Schedules', d: 'Weekly maintenance reminders for complex gear', s: notifs.maint }
                  ].map((n) => (
                    <div key={n.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{n.t}</p>
                        <p className="text-xs text-gray-500 font-medium">{n.d}</p>
                      </div>
                      <button 
                        onClick={() => setNotifs({...notifs, [n.id]: !n.s})}
                        className={`w-11 h-6 rounded-full relative transition-colors ${n.s ? "bg-green-500" : "bg-gray-300"}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${n.s ? "right-1" : "left-1"}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4">Official Documentation</h3>
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={() => downloadReport("Monthly Inventory Report")} className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-green-200 rounded-xl hover:shadow-md transition-all">
                      <Download className="w-4 h-4 text-green-600" /> <span className="text-xs font-black text-green-700 uppercase">Monthly Report</span>
                    </button>
                    <button onClick={() => downloadReport("Annual Stock Register")} className="flex items-center justify-center gap-3 px-4 py-3 bg-white border border-green-200 rounded-xl hover:shadow-md transition-all">
                      <Download className="w-4 h-4 text-green-600" /> <span className="text-xs font-black text-green-700 uppercase">Annual Register</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      {/* User Management Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-gray-900 tracking-tight">{editingUser ? "Modify User Profile" : "Create New Access"}</h2>
              <button onClick={() => setIsUserModalOpen(false)} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleUserSave} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Full Identity</label>
                <input name="name" defaultValue={editingUser?.name} placeholder="e.g. Maria Tajrin" required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-bold text-gray-700" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Contact Email</label>
                <input name="email" type="email" defaultValue={editingUser?.email} placeholder="name@polytechnic.edu" required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 font-bold text-gray-700" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Security Role</label>
                  <select name="role" defaultValue={editingUser?.role || "Student"} className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100">
                    <option value="Super Admin">Super Admin</option>
                    <option value="Lab Assistant">Lab Assistant</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Student">Student</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Academic Dept.</label>
                  <input name="dept" defaultValue={editingUser?.department} placeholder="e.g. CmT" required className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl font-bold text-gray-700 outline-none focus:ring-2 focus:ring-blue-100" />
                </div>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95 mt-4">
                {editingUser ? "Sync Profile Changes" : "Register User Access"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}