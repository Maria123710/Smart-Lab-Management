import { useState } from "react";
import { useNavigate } from "react-router";
import { LogIn, UserPlus } from "lucide-react";

export function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [subRole, setSubRole] = useState("Student");
  const [adminCode, setAdminCode] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  
  const navigate = useNavigate();
  const SECRET_CODE = "ADMIN123"; 

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // --- ADMIN LOGIC ---
    if (isAdmin) {
      if (adminCode === SECRET_CODE) {
        localStorage.setItem("userRole", "admin");
        localStorage.setItem("userName", "Admin User");
        navigate("/");
      } else {
        alert("Invalid Admin Secret Code!");
      }
      return;
    }

    // --- USER LOGIC (MOCK DATABASE) ---
    const users = JSON.parse(localStorage.getItem("registeredUsers") || "[]");

    if (isSignup) {
      // Check if user already exists
      const userExists = users.some((u: any) => u.email === formData.email);
      if (userExists) {
        alert("Email already registered. Please login.");
        setIsSignup(false);
        return;
      }

      // Add new user to "database"
      const newUser = { ...formData, subRole };
      localStorage.setItem("registeredUsers", JSON.stringify([...users, newUser]));
      alert("Registration successful! Now please login.");
      setIsSignup(false); // Move to login screen after signup
    } else {
      // Login validation
      const validUser = users.find(
        (u: any) => u.email === formData.email && u.password === formData.password
      );

      if (validUser) {
        localStorage.setItem("userRole", "user");
        localStorage.setItem("userSubRole", validUser.subRole);
        localStorage.setItem("userName", validUser.name);
        navigate("/");
      } else {
        alert("Invalid credentials! Please sign up first if you haven't.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full max-w-md border border-gray-100">
        <div className="flex justify-center mb-6">
          <div className={`${isAdmin ? 'bg-purple-600' : 'bg-blue-600'} p-5 rounded-3xl text-white shadow-xl transition-all`}>
            {isSignup ? <UserPlus size={28} /> : <LogIn size={28} />}
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">SmartLab SLMS</h2>
          <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">
            {isAdmin ? "Administrative Access" : isSignup ? "Create Account" : "Member Login"}
          </p>
        </div>

        {/* Admin/User Toggle */}
        <div className="flex p-1 bg-gray-100 rounded-2xl mb-8">
          <button type="button" onClick={() => {setIsAdmin(false); setIsSignup(false)}} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${!isAdmin ? "bg-white text-blue-600 shadow-sm" : "text-gray-400"}`}>User</button>
          <button type="button" onClick={() => {setIsAdmin(true); setIsSignup(false)}} className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase transition-all ${isAdmin ? "bg-white text-purple-600 shadow-sm" : "text-gray-400"}`}>Admin</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Always show Name field during Signup, hide it during Login */}
          {isSignup && !isAdmin && (
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              required 
            />
          )}

          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required 
          />

          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500" 
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required 
          />

          {!isAdmin ? (
            <select 
              value={subRole} 
              onChange={(e) => setSubRole(e.target.value)} 
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-sm text-gray-500 outline-none"
            >
              <option>Student</option>
              <option>Lab Assistant</option>
              <option>Teacher</option>
            </select>
          ) : (
            <input 
              type="password" 
              placeholder="Admin Secret Code" 
              className="w-full p-4 bg-purple-50 border border-purple-100 rounded-2xl font-bold text-sm text-purple-900 outline-none" 
              onChange={(e) => setAdminCode(e.target.value)} 
              required 
            />
          )}

          <button className={`w-full py-5 rounded-2xl font-black uppercase text-[10px] text-white shadow-xl transition-transform active:scale-95 ${isAdmin ? "bg-purple-600" : "bg-blue-600"}`}>
            {isSignup ? "Complete Registration" : "Sign In to Lab"}
          </button>
        </form>

        {!isAdmin && (
          <button onClick={() => setIsSignup(!isSignup)} className="w-full mt-8 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
            {isSignup ? "Already have an account? Login" : "New here? Create an account"}
          </button>
        )}
      </div>
    </div>
  );
}