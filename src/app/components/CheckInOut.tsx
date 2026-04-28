import { useState, useEffect } from "react";
import { QrCode, Camera, CheckCircle, XCircle, Clock, User, ArrowRight, ShieldCheck, RefreshCw } from "lucide-react";

interface Transaction {
  id: string;
  studentName: string;
  studentId: string;
  equipment: string;
  equipmentId: string;
  action: "Check Out" | "Check In";
  date: string;
  dueDate?: string;
  status: "Pending" | "Approved" | "Rejected" | "Overdue";
}

export function CheckInOut() {
  // --- FIXED ROLE LOGIC ---
  const [userRole, setUserRole] = useState<"admin" | "user">(() => {
    const saved = localStorage.getItem("userRole");
    return (saved === "admin" || saved === "user") ? saved : "admin";
  });

  const currentUserName = localStorage.getItem("userName") || "";
  const [activeTab, setActiveTab] = useState<"scan" | "pending" | "history">("scan");
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  const [allTransactions, setAllTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("smartlab_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("smartlab_transactions", JSON.stringify(allTransactions));
  }, [allTransactions]);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem("smartlab_transactions");
      if (saved) setAllTransactions(JSON.parse(saved));
      
      const savedRole = localStorage.getItem("userRole");
      if (savedRole === "admin" || savedRole === "user") setUserRole(savedRole);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const toggleRole = () => {
    const newRole = userRole === "admin" ? "user" : "admin";
    localStorage.setItem("userRole", newRole);
    setUserRole(newRole);
  };

  const [formInput, setFormInput] = useState({
    studentName: currentUserName,
    studentId: "",
    action: "Check Out" as "Check Out" | "Check In",
  });

  const pendingList = allTransactions.filter(t => t.status === "Pending");
  const historyList = allTransactions.filter(t => t.status === "Approved");

  const filteredPending = userRole === "admin" 
    ? pendingList 
    : pendingList.filter(t => t.studentName === formInput.studentName);

  const filteredHistory = userRole === "admin" 
    ? historyList 
    : historyList.filter(t => t.studentName === formInput.studentName);

  const handleScan = () => {
    setShowScanner(true);
    setTimeout(() => {
      setScanResult("EQ-" + Math.floor(Math.random() * 900 + 100));
      setShowScanner(false);
    }, 1500);
  };

  const submitRequest = () => {
    if (!formInput.studentId || !formInput.studentName) return alert("Fill all fields");
    const newTxn: Transaction = {
      id: `TXN-${Math.floor(Math.random() * 10000)}`,
      studentName: formInput.studentName,
      studentId: formInput.studentId,
      equipment: scanResult || "Unknown",
      equipmentId: scanResult || "EQ-XXX",
      action: formInput.action,
      date: new Date().toLocaleDateString(),
      status: "Pending"
    };
    setAllTransactions([newTxn, ...allTransactions]);
    setScanResult(null);
    setActiveTab("pending");
  };

  const handleApprove = (id: string) => {
    setAllTransactions(allTransactions.map(t => t.id === id ? { ...t, status: "Approved" } : t));
  };

  const handleReject = (id: string) => {
    if (window.confirm("Reject this request?")) {
      setAllTransactions(allTransactions.filter(t => t.id !== id));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Lab Transactions</h1>
          <button 
            onClick={toggleRole}
            className="mt-2 flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-[10px] font-black uppercase tracking-tighter text-gray-600 transition-all"
          >
            <RefreshCw size={12} /> Switch to {userRole === "admin" ? "User" : "Admin"} View
          </button>
        </div>
        <div className="flex bg-gray-100 p-1.5 rounded-2xl">
          {(["scan", "pending", "history"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2.5 rounded-xl text-sm font-bold capitalize transition-all ${activeTab === tab ? "bg-white shadow-md text-blue-600" : "text-gray-500"}`}>
              {tab} {tab === "pending" && filteredPending.length > 0 && `(${filteredPending.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 min-h-[500px] shadow-xl overflow-hidden">
        {activeTab === "scan" && (
          <div className="p-12 flex flex-col items-center max-w-md mx-auto space-y-8">
            <div className={`w-28 h-28 rounded-[2.5rem] flex items-center justify-center transition-all ${showScanner ? 'bg-blue-600 animate-pulse' : 'bg-blue-50'}`}>
              <QrCode size={48} className={showScanner ? "text-white" : "text-blue-600"} />
            </div>
            {!scanResult ? (
              <button onClick={handleScan} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Launch Scanner</button>
            ) : (
              <div className="w-full space-y-4 p-6 bg-blue-50 rounded-[2rem]">
                <input className="w-full p-4 rounded-xl outline-none" placeholder="Student Name" value={formInput.studentName} onChange={(e) => setFormInput({...formInput, studentName: e.target.value})} />
                <input className="w-full p-4 rounded-xl outline-none" placeholder="Student ID" value={formInput.studentId} onChange={(e) => setFormInput({...formInput, studentId: e.target.value})} />
                <button onClick={submitRequest} className="w-full py-4 bg-blue-600 text-white rounded-xl font-black">SUBMIT REQUEST</button>
              </div>
            )}
          </div>
        )}

        {activeTab === "pending" && (
          <div className="p-8 space-y-4">
            {filteredPending.map(txn => (
              <div key={txn.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] flex justify-between items-center shadow-sm">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-black text-xs">REQ</div>
                  <div>
                    <h3 className="font-black text-gray-900">{txn.equipment}</h3>
                    <p className="text-xs font-bold text-gray-400 uppercase">{txn.studentName} • {txn.date}</p>
                  </div>
                </div>
                {userRole === "admin" ? (
                  <div className="flex gap-2">
                    <button onClick={() => handleApprove(txn.id)} className="px-6 py-2 bg-green-600 text-white rounded-xl font-black text-xs hover:bg-green-700 transition-colors">Approve</button>
                    <button onClick={() => handleReject(txn.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"><XCircle /></button>
                  </div>
                ) : (
                  <span className="px-4 py-2 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">Awaiting Admin...</span>
                )}
              </div>
            ))}
            {filteredPending.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-gray-300 italic">
                <Clock size={48} className="mb-2 opacity-20" />
                <p>No pending requests found</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "history" && (
          <div className="p-8 space-y-3">
            {filteredHistory.map(txn => (
              <div key={txn.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-[1.5rem]">
                <div className="flex items-center gap-4">
                  <ArrowRight className="text-green-500" />
                  <div>
                    <p className="font-black text-gray-900">{txn.equipment}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{txn.studentName} • {txn.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600">
                   <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
                   <ShieldCheck size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}