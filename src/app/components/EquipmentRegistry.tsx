import { useState, useEffect } from "react";
import { Plus, Scan, Edit2, Trash2, Send, QrCode, CheckCircle, XCircle } from "lucide-react";

export function EquipmentRegistry() {
  const role = localStorage.getItem("userRole") || "user";
  
  // 1. Move equipment to STATE and Load from LocalStorage
  const [equipment, setEquipment] = useState<any[]>(() => {
    const saved = localStorage.getItem("lab_inventory");
    return saved ? JSON.parse(saved) : [
      { id: "EQ-101", name: "Arduino Uno", category: "Microcontroller", room: "Lab-301", stock: 15, status: "In Lab" },
      { id: "EQ-102", name: "Raspberry Pi 4", category: "SBC", room: "Lab-302", stock: 8, status: "In Lab" },
    ];
  });

  const [requestedIds, setRequestedIds] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [newItem, setNewItem] = useState({ name: "", category: "", stock: 0, room: "Lab-301" });

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem("lab_inventory", JSON.stringify(equipment));
  }, [equipment]);

  // --- ADMIN ACTIONS ---
  
  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      // UPDATE Logic
      setEquipment(equipment.map(item => 
        item.id === editingItem.id ? { ...editingItem, ...newItem } : item
      ));
      setEditingItem(null);
    } else {
      // ADD Logic
      const newEntry = {
        ...newItem,
        id: `EQ-${Math.floor(Math.random() * 900 + 100)}`,
        status: "In Lab"
      };
      setEquipment([...equipment, newEntry]);
    }
    setNewItem({ name: "", category: "", stock: 0, room: "Lab-301" });
    setShowAddModal(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setEquipment(equipment.filter(item => item.id !== id));
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setNewItem({ name: item.name, category: item.category, stock: item.stock, room: item.room });
    setShowAddModal(true);
  };

  // --- USER ACTIONS ---
  const handleRequest = (item: any) => {
    if (requestedIds.includes(item.id)) return;
    const existing = JSON.parse(localStorage.getItem("labRequests") || "[]");
    localStorage.setItem("labRequests", JSON.stringify([...existing, {
      id: Date.now(),
      itemName: item.name,
      requestedBy: localStorage.getItem("userName"),
      status: "Pending",
      date: new Date().toLocaleDateString()
    }]));
    setRequestedIds([...requestedIds, item.id]);
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Inventory</h2>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-2xl font-bold text-sm shadow-sm hover:bg-gray-50 transition-all">
            <Scan size={18} /> Scan
          </button>
          {role === "admin" && (
            <button 
              onClick={() => { setEditingItem(null); setShowAddModal(true); }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-blue-100 hover:bg-blue-700"
            >
              <Plus size={18} /> Add New
            </button>
          )}
        </div>
      </div>

      {/* MODAL (FOR ADD & EDIT) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-md shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black">{editingItem ? "Edit Item" : "Add Equipment"}</h3>
              <button onClick={() => setShowAddModal(false)}><XCircle className="text-gray-300" /></button>
            </div>
            <form onSubmit={handleAddOrUpdate} className="space-y-4">
              <input type="text" placeholder="Item Name" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" value={newItem.name} onChange={(e) => setNewItem({...newItem, name: e.target.value})} required />
              <input type="text" placeholder="Category" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" value={newItem.category} onChange={(e) => setNewItem({...newItem, category: e.target.value})} required />
              <input type="number" placeholder="Stock Quantity" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm" value={newItem.stock} onChange={(e) => setNewItem({...newItem, stock: parseInt(e.target.value)})} required />
              <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest">{editingItem ? "Save Changes" : "Create Item"}</button>
            </form>
          </div>
        </div>
      )}

      {/* EQUIPMENT GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {equipment.map((item) => {
          const isRequested = requestedIds.includes(item.id);
          return (
            <div key={item.id} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm relative group hover:shadow-md transition-all">
              {role === "admin" && (
                <div className="absolute top-8 right-8 flex gap-2">
                  <button onClick={() => startEdit(item)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-xl transition-colors"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-xl transition-colors"><Trash2 size={16}/></button>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                <span className="mt-2 inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{item.id}</span>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm"><span className="text-gray-400 font-bold">Category</span><span className="text-gray-900 font-black">{item.category}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-400 font-bold">Stock</span><span className="text-blue-600 font-black">{item.stock}</span></div>
              </div>

              {role === "user" ? (
                <button 
                  onClick={() => handleRequest(item)} 
                  disabled={isRequested}
                  className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
                    isRequested ? "bg-green-100 text-green-600" : "bg-gray-900 text-white hover:bg-blue-600 shadow-lg shadow-gray-200"
                  }`}
                >
                  {isRequested ? <><CheckCircle size={14} /> Request Sent</> : <><Send size={14} /> Request Item</>}
                </button>
              ) : (
                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-xs font-black text-green-500 uppercase tracking-widest">• {item.status}</span>
                  <QrCode className="text-gray-200" size={20} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}