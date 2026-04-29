import { useState } from "react";
import { 
  Package, AlertTriangle, CheckCircle, Clock, 
  CalendarCheck, Trash2, Send 
} from "lucide-react";

export function Dashboard() {
  // --- AUTH/ROLE STATE ---
  const role = localStorage.getItem("userRole") || "user"; 

  // --- DYNAMIC STATE ---
  const [scheduledItems, setScheduledItems] = useState<string[]>([]);

  const stats = [
    { label: "Total Equipment", value: "247", icon: Package, color: "bg-blue-500", trend: "+12 this month" },
    { label: "Checked Out", value: "34", icon: Clock, color: "bg-yellow-500", trend: "18 due today" },
    { label: "Available", value: "198", icon: CheckCircle, color: "bg-green-500", trend: "80% in stock" },
    { label: "Under Repair", value: "15", icon: AlertTriangle, color: "bg-red-500", trend: "3 critical" },
  ];

  const recentActivity = [
    { student: "Rahul Sharma", action: "Checked out", item: "Arduino Uno R3", time: "2 min ago", status: "success" },
    { student: "Priya Patel", action: "Returned", item: "Oscilloscope DSO-X 3024T", time: "15 min ago", status: "success" },
    { student: "Amit Kumar", action: "Reported damage", item: "Raspberry Pi 4B", time: "1 hour ago", status: "warning" },
    { student: "Sneha Reddy", action: "Checked out", item: "Multimeter Fluke 87V", time: "2 hours ago", status: "success" },
  ];

  const lowStockItems = [
    { name: "Jumper Wires (M-M)", current: 45, threshold: 100, category: "Consumable" },
    { name: "330Ω Resistors", current: 120, threshold: 200, category: "Consumable" },
    { name: "Breadboards", current: 8, threshold: 15, category: "Non-Consumable" },
    { name: "USB-C Cables", current: 12, threshold: 20, category: "Consumable" },
  ];

  const upcomingMaintenance = [
    { equipment: "3D Printer Ender 3", nextService: "Apr 25, 2026", hoursUsed: 480 },
    { equipment: "CNC Router", nextService: "Apr 28, 2026", hoursUsed: 320 },
    { equipment: "Soldering Station", nextService: "May 02, 2026", hoursUsed: 210 },
  ];

  const handleSchedule = (equipmentName: string) => {
    if (!scheduledItems.includes(equipmentName)) {
      setScheduledItems([...scheduledItems, equipmentName]);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-700">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm font-medium">Monitoring SmartLab SLMS operations</p>
        </div>
        <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl shadow-sm self-start sm:self-auto">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Current Date</p>
          <p className="text-sm font-bold text-gray-900 whitespace-nowrap">April 28, 2026 • 9:08 PM</p>
        </div>
      </div>

      {/* --- Stats Grid: Responsive Columns --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[1.5rem] p-5 md:p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-[10px] md:text-[11px] font-black uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl md:text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                <p className="text-[10px] text-blue-500 mt-2 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded-full">{stat.trend}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-2xl shadow-lg shadow-gray-100 group-hover:scale-110 transition-transform shrink-0`}>
                <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- Main Two-Column Content: Stacks on Mobile/Tablet --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Activity */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 md:p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <h2 className="font-black text-gray-900 text-xs md:text-sm uppercase tracking-widest">Recent Activity</h2>
            <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All</button>
          </div>
          <div className="divide-y divide-gray-50">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${activity.status === "success" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-yellow-500"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 leading-snug">
                      <span className="font-bold">{activity.student}</span> 
                      <span className="text-gray-500 mx-1">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-600 font-bold mt-1 tracking-tight italic">{activity.item}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 md:p-6 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
            <h2 className="font-black text-gray-900 text-xs md:text-sm uppercase tracking-widest">Low Stock Alerts</h2>
            <span className="bg-red-50 text-red-600 text-[10px] font-black uppercase px-2 py-1 rounded-full border border-red-100">
              {lowStockItems.length} Critical
            </span>
          </div>
          <div className="p-5 md:p-6 space-y-6">
            {lowStockItems.map((item, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{item.category}</p>
                  </div>
                  <span className="text-[10px] font-black text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg shrink-0">
                    {item.current} / {item.threshold}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 md:h-2 overflow-hidden shadow-inner">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${ (item.current / item.threshold) * 100 < 40 ? "bg-red-500" : "bg-amber-500" }`}
                    style={{ width: `${(item.current / item.threshold) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- Upcoming Maintenance (Admin Only) --- */}
      {role === "admin" && (
        <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-5 md:p-6 border-b border-gray-50 bg-gray-50/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <CalendarCheck size={18} className="text-blue-500" />
              <h2 className="font-black text-gray-900 text-xs md:text-sm uppercase tracking-widest">Upcoming Maintenance</h2>
            </div>
            <span className="text-[9px] md:text-[10px] font-black text-gray-400 uppercase tracking-widest">Admin View</span>
          </div>
          
          {/* Table Container for Mobile Scrolling */}
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Equipment</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Next Service</th>
                  <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Usage</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {upcomingMaintenance.map((item, idx) => {
                  const isScheduled = scheduledItems.includes(item.equipment);
                  return (
                    <tr key={idx} className="group hover:bg-gray-50/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">{item.equipment}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-bold">{item.nextService}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 font-bold">{item.hoursUsed}h</td>
                      <td className="px-6 py-4 text-right">
                        {isScheduled ? (
                          <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-green-100">
                            <CheckCircle size={12} /> Scheduled
                          </span>
                        ) : (
                          <button 
                            onClick={() => handleSchedule(item.equipment)}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:bg-blue-600 hover:text-white bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 transition-all"
                          >
                            Schedule
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}