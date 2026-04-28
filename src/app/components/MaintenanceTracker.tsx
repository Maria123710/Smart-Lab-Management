import { useState } from "react";
import { Wrench, AlertTriangle, CheckCircle, Clock, Camera, FileText, Calendar, X, Save } from "lucide-react";

interface MaintenanceRecord {
  id: string;
  equipmentName: string;
  equipmentId: string;
  status: "Good" | "Needs Service" | "Under Repair" | "Critical";
  lastService: string;
  nextService: string;
  hoursUsed: number;
  maintenanceScore: number;
  serviceHistory: {
    date: string;
    type: string;
    technician: string;
    notes: string;
  }[];
  reportedIssues: {
    date: string;
    reporter: string;
    issue: string;
    severity: "Low" | "Medium" | "High";
  }[];
}

export function MaintenanceTracker() {
  const [viewHistoryItem, setViewHistoryItem] = useState<MaintenanceRecord | null>(null);
  const [schedulingItem, setSchedulingItem] = useState<MaintenanceRecord | null>(null);
  const [isReportingIssue, setIsReportingIssue] = useState(false);
  const [newServiceDate, setNewServiceDate] = useState("");

  // Issue Reporting Form State
  const [reportForm, setReportForm] = useState({
    equipmentId: "",
    issue: "",
    severity: "Medium" as "Low" | "Medium" | "High"
  });

  const [records, setRecords] = useState<MaintenanceRecord[]>([
    {
      id: "EQ-004",
      equipmentName: "3D Printer Ender 3 Pro",
      equipmentId: "3DP-END-2024-004",
      status: "Under Repair",
      lastService: "Mar 15, 2026",
      nextService: "Apr 25, 2026",
      hoursUsed: 480,
      maintenanceScore: 65,
      serviceHistory: [
        { date: "Mar 15, 2026", type: "Routine Maintenance", technician: "Suresh Kumar", notes: "Cleaned nozzle, lubricated rails, calibrated bed" },
        { date: "Feb 10, 2026", type: "Repair", technician: "Ramesh Patel", notes: "Replaced hotend assembly due to clog" },
      ],
      reportedIssues: [
        { date: "Apr 18, 2026", reporter: "Rahul Sharma (CST-2024-101)", issue: "Extruder motor making grinding noise", severity: "High" },
      ],
    },
    {
      id: "EQ-006",
      equipmentName: "Soldering Station Hakko FX-888D",
      equipmentId: "SOL-HAK-2023-006",
      status: "Needs Service",
      lastService: "Jan 20, 2026",
      nextService: "May 02, 2026",
      hoursUsed: 210,
      maintenanceScore: 75,
      serviceHistory: [{ date: "Jan 20, 2026", type: "Routine Maintenance", technician: "Suresh Kumar", notes: "Replaced tip, cleaned station, tested temperature accuracy" }],
      reportedIssues: [],
    },
    {
      id: "EQ-003",
      equipmentName: "Oscilloscope DSO-X 3024T",
      equipmentId: "OSC-DSO-2023-003",
      status: "Good",
      lastService: "Feb 28, 2026",
      nextService: "Aug 28, 2026",
      hoursUsed: 150,
      maintenanceScore: 95,
      serviceHistory: [{ date: "Feb 28, 2026", type: "Calibration", technician: "Dr. Sharma", notes: "Full calibration completed, all channels verified" }],
      reportedIssues: [],
    },
    {
      id: "EQ-008",
      equipmentName: "Power Supply 0-30V 0-5A",
      equipmentId: "PWR-SUP-2024-008",
      status: "Good",
      lastService: "Mar 10, 2026",
      nextService: "Jun 10, 2026",
      hoursUsed: 95,
      maintenanceScore: 90,
      serviceHistory: [{ date: "Mar 10, 2026", type: "Routine Check", technician: "Suresh Kumar", notes: "Voltage accuracy verified, cleaned cooling fan" }],
      reportedIssues: [],
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Good": return "bg-green-100 text-green-700 border-green-200";
      case "Needs Service": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Under Repair": return "bg-orange-100 text-orange-700 border-orange-200";
      case "Critical": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low": return "bg-blue-100 text-blue-700";
      case "Medium": return "bg-yellow-100 text-yellow-700";
      case "High": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!schedulingItem) return;
    const updatedRecords = records.map((item) => {
      if (item.id === schedulingItem.id) {
        return {
          ...item,
          status: "Under Repair" as const,
          nextService: newServiceDate,
          serviceHistory: [
            { date: new Date().toLocaleDateString(), type: "Scheduled Repair", technician: "System Admin", notes: `Maintenance scheduled for ${newServiceDate}` },
            ...item.serviceHistory,
          ],
        };
      }
      return item;
    });
    setRecords(updatedRecords);
    setSchedulingItem(null);
  };

  const handleIssueSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedRecords = records.map((item) => {
      if (item.id === reportForm.equipmentId) {
        return {
          ...item,
          status: reportForm.severity === "High" ? ("Critical" as const) : ("Needs Service" as const),
          reportedIssues: [
            {
              date: new Date().toLocaleDateString(),
              reporter: "Current User",
              issue: reportForm.issue,
              severity: reportForm.severity
            },
            ...item.reportedIssues
          ]
        };
      }
      return item;
    });
    setRecords(updatedRecords);
    setIsReportingIssue(false);
    setReportForm({ equipmentId: "", issue: "", severity: "Medium" });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Maintenance Tracker</h1>
          <p className="text-gray-500 mt-1">Monitor equipment health and service schedules</p>
        </div>
        <button 
          onClick={() => setIsReportingIssue(true)}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <AlertTriangle className="w-4 h-4" />
          <span className="text-sm">Report Issue</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status cards remain the same, calculating from records state */}
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'Good').length}</p><p className="text-sm text-gray-500">Good Condition</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center"><Clock className="w-6 h-6 text-yellow-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'Needs Service').length}</p><p className="text-sm text-gray-500">Needs Service</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center"><Wrench className="w-6 h-6 text-orange-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'Under Repair').length}</p><p className="text-sm text-gray-500">Under Repair</p></div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-red-600" /></div>
            <div><p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'Critical').length}</p><p className="text-sm text-gray-500">Critical</p></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {records.map((equipment) => (
          <div key={equipment.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className={`p-5 border-b-2 ${getStatusColor(equipment.status)}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900">{equipment.equipmentName}</h3>
                  <p className="text-sm text-gray-500 mt-1">{equipment.equipmentId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(equipment.status)}`}>{equipment.status}</span>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Health Score</span>
                  <span className={`text-lg font-bold ${getScoreColor(equipment.maintenanceScore)}`}>{equipment.maintenanceScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`h-2 rounded-full ${equipment.maintenanceScore >= 85 ? "bg-green-500" : equipment.maintenanceScore >= 70 ? "bg-yellow-500" : "bg-red-500"}`} style={{ width: `${equipment.maintenanceScore}%` }} />
                </div>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-gray-500">Last Service</p><p className="text-gray-900 font-medium mt-1">{equipment.lastService}</p></div>
                <div><p className="text-gray-500">Next Service</p><p className="text-gray-900 font-medium mt-1">{equipment.nextService}</p></div>
                <div><p className="text-gray-500">Hours Used</p><p className="text-gray-900 font-medium mt-1">{equipment.hoursUsed}h</p></div>
                <div><p className="text-gray-500">Service Records</p><p className="text-gray-900 font-medium mt-1">{equipment.serviceHistory.length}</p></div>
              </div>

              {equipment.reportedIssues.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-red-900">Active Issues</p>
                      {equipment.reportedIssues.map((issue, idx) => (
                        <div key={idx} className="mt-2 text-xs text-red-700">
                          <div className="flex justify-between font-bold mb-1">
                            <span className={`px-2 py-0.5 rounded ${getSeverityColor(issue.severity)}`}>{issue.severity}</span>
                            <span className="text-gray-500">{issue.date}</span>
                          </div>
                          <p className="mt-1">{issue.issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Service History</h4>
                <div className="space-y-2">
                  {equipment.serviceHistory.slice(0, 2).map((service, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900">{service.type}</span>
                        <span className="text-gray-500">{service.date}</span>
                      </div>
                      <p className="text-gray-600 mb-1">{service.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => setSchedulingItem(equipment)}
                  disabled={equipment.status === "Under Repair"}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{equipment.status === "Under Repair" ? "In Repair" : "Schedule Service"}</span>
                </button>
                <button 
                  onClick={() => setViewHistoryItem(equipment)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>History</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FOR REPORTING ISSUE --- */}
      {isReportingIssue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Report Equipment Issue</h2>
              <button onClick={() => setIsReportingIssue(false)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleIssueSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Select Equipment</label>
                <select 
                  required
                  className="w-full p-3 border rounded-xl"
                  value={reportForm.equipmentId}
                  onChange={(e) => setReportForm({...reportForm, equipmentId: e.target.value})}
                >
                  <option value="">Choose equipment...</option>
                  {records.map(r => <option key={r.id} value={r.id}>{r.equipmentName}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Issue Description</label>
                <textarea 
                  required
                  className="w-full p-3 border rounded-xl h-24"
                  placeholder="What's wrong with the equipment?"
                  value={reportForm.issue}
                  onChange={(e) => setReportForm({...reportForm, issue: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Severity</label>
                <select 
                  className="w-full p-3 border rounded-xl"
                  value={reportForm.severity}
                  onChange={(e) => setReportForm({...reportForm, severity: e.target.value as any})}
                >
                  <option value="Low">Low - Minor issue</option>
                  <option value="Medium">Medium - Affects performance</option>
                  <option value="High">High - Breakdown / Safety risk</option>
                </select>
              </div>
              <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                <AlertTriangle size={18}/> Submit Report
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Existing History and Schedule Modals... */}
      {viewHistoryItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">History: {viewHistoryItem.equipmentName}</h2>
              <button onClick={() => setViewHistoryItem(null)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              {viewHistoryItem.serviceHistory.map((h, i) => (
                <div key={i} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded-r-lg">
                  <div className="flex justify-between text-sm mb-1"><span className="font-bold text-blue-700">{h.type}</span><span className="text-gray-500">{h.date}</span></div>
                  <p className="text-sm text-gray-700">{h.notes}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {schedulingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Schedule Repair</h2>
              <button onClick={() => setSchedulingItem(null)} className="p-2 bg-gray-100 rounded-full"><X size={20}/></button>
            </div>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <p className="text-sm text-gray-600">Scheduling for: <strong>{schedulingItem.equipmentName}</strong></p>
              <input type="date" required className="w-full p-3 border rounded-xl" onChange={(e) => setNewServiceDate(e.target.value)} />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                <Save size={18}/> Confirm & Start Repair
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}