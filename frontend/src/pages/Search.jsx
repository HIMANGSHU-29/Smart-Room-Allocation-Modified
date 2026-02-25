import { useState } from "react";
import { toast } from "react-toastify";
import { Search as SearchIcon, MapPin, User, Home, ArrowRight, BookOpen, Zap } from "lucide-react";
import logo from "../assets/logo.svg";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Search() {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!rollNo.trim()) return;
    try {
      setLoading(true);
      const res = await API.get(`/students/${rollNo.trim()}`);
      setStudent(res.data);
    } catch {
      alert("Student identification failed. Please verify credentials.");
      setStudent(null); // Clear previous student data on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFAF0] font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="px-4 md:px-6 pt-4 md:pt-6 sticky top-0 z-50">
        <nav className="px-6 md:px-12 h-16 md:h-20 flex items-center justify-between border border-slate-200 bg-[#FFF8E7] rounded-[1.5rem] shadow-xl shadow-slate-200/50 backdrop-blur-md">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-white overflow-hidden p-0.5">
              <img src={logo} alt="AllocateU Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm md:text-lg font-agraham tracking-tight">AllocateU</span>
          </div>
          <Link to="/" className="flex items-center gap-2 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-all">
            <Home size={14} className="md:w-4 md:h-4" /> <span className="hidden sm:inline">Registry Hub</span>
          </Link>
        </nav>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="text-center mb-10 md:mb-16">
          <h1 className="text-4xl sm:text-7xl font-serif-luxury italic text-slate-950 mb-6 tracking-tight px-4">Candidate Verification</h1>
          <p className="text-slate-500 text-sm md:text-xl font-medium max-w-2xl mx-auto leading-relaxed px-6">
            Enter your institutional roll number to retrieve authorized venue deployment and seating directives.
          </p>
        </div>

        <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 luxury-border shadow-2xl mb-12 mx-4 md:mx-0">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 md:w-6 md:h-6" />
              <input
                type="text"
                placeholder="Roll Number..."
                className="w-full pl-14 md:pl-16 pr-6 md:pr-8 py-4 md:py-6 rounded-xl md:rounded-[2rem] bg-slate-50 border border-slate-100 focus:bg-white focus:ring-[8px] md:focus:ring-[12px] focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all text-base md:text-lg font-bold placeholder:text-slate-300"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !rollNo}
              className="bg-slate-950 text-white px-8 md:px-12 py-4 md:py-6 rounded-xl md:rounded-[2rem] font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-slate-800 transition-all shadow-2xl shadow-slate-950/20 disabled:opacity-30 flex items-center justify-center gap-3"
            >
              {loading ? "querying..." : <>verify registry <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        {student && (
          <div className="glass rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 luxury-border shadow-2xl animate-in slide-in-from-bottom-5 duration-700 mx-4 md:mx-0">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center text-center lg:text-left">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl md:rounded-[2rem] bg-slate-950 text-white flex items-center justify-center text-3xl md:text-4xl font-serif-luxury italic shadow-2xl">
                {student.name.substring(0, 1)}
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 text-[10px] font-black uppercase tracking-widest mb-4">
                  Verified Identity
                </div>
                <h2 className="text-3xl md:text-4xl font-serif-luxury italic text-slate-900 mb-2">{student.name}</h2>
                <div className="flex flex-wrap gap-4 text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest justify-center lg:justify-start">
                  <span className="flex items-center gap-2"><User size={14} className="text-blue-500" /> <span className="number-solid">{student.rollNumber}</span></span>
                  <span className="flex items-center gap-2 underline underline-offset-4 decoration-blue-200 decoration-2">{student.department} Cycle</span>
                </div>
              </div>
              <div className="w-full lg:w-auto px-10 py-8 bg-blue-50 rounded-[2rem] md:rounded-[2.5rem] border border-blue-100 flex flex-col items-center justify-center">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-3">Venue Assigned</p>
                <div className="flex items-center gap-3">
                  <MapPin size={24} className="text-blue-600" />
                  <span className="text-4xl md:text-5xl font-serif-luxury text-blue-900 number-solid">{student.roomNumber || "Pending"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-24 flex justify-center gap-12 items-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all duration-700">
          <BookOpen size={40} />
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Institutional Examination Interface</p>
          <Zap size={40} />
        </div>
      </div>
    </div>
  );
}