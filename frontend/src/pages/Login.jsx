import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();

      // Store token for backend compatibility if needed
      localStorage.setItem("token", token);

      login(); // Redirects to dashboard
      toast.success("Login successful!");
    } catch (err) {
      const errorMessage = err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
        ? "Invalid email or password"
        : "Authentication failed. Please check your credentials.";
      toast.error(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative p-4">
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold transition-all group"
      >
        <div className="w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center transition-transform group-hover:-translate-x-1">
          <ArrowLeft size={16} />
        </div>
        Back to Home
      </Link>

      <div className="bg-white p-10 rounded-3xl shadow-2xl shadow-slate-200/50 w-full max-w-md border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Admin Portal</h2>
          <p className="text-slate-500 mt-2 font-medium">Secure access to allocation engine</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              Credential: Identity
            </label>
            <input
              type="email"
              placeholder="admin@institution.edu"
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
              Credential: Secret
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-5 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
          >
            {loading ? "Authenticating..." : "Establish Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
