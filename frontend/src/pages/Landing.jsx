import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Layers, Users, Zap } from "lucide-react";
import logo from "../assets/logo.svg";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#FFFAF0] flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Navigation */}
      <div className="px-4 md:px-6 pt-4 md:pt-6 sticky top-0 z-50">
        <nav className="px-6 md:px-12 h-16 md:h-20 flex items-center justify-between border border-slate-200 rounded-[1.5rem] shadow-xl shadow-slate-200/50 backdrop-blur-md">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-900/20 overflow-hidden p-1.5">
              <img src={logo} alt="AllocateU Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-sm md:text-lg font-agraham tracking-tight "><b>AllocateU</b></span>
          </div>
          <div className="flex items-center gap-4 md:gap-8 text-[10px] md:text-sm font-bold text-slate-500">
            <Link to="/login" className="bg-slate-900 text-white px-4 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl hover:bg-slate-800 transition-all">Admin Access</Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/5 blur-[120px] rounded-full -z-10" />

        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full luxury-border text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-10 shadow-sm">
          <Zap size={12} fill="currentColor" /> Smart Room Allocation
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[10rem] font-serif-luxury italic mb-8 tracking-tighter max-w-6xl leading-[1.1] lg:leading-[0.85] text-slate-950 px-2 lg:px-4">
          Precision Seating <br /> <span className="text-blue-600">Automated</span>
        </h1>

        <p className="text-slate-500 text-lg md:text-xl lg:text-2xl mb-12 lg:mb-16 max-w-2xl lg:max-w-3xl leading-relaxed font-medium px-6">
          The next generation of examination hall architecture
          Deploy randomized seating protocols in seconds
        </p>

        <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 relative z-10 w-full max-w-[280px] sm:max-w-2xl px-0 sm:px-6">
          <Link
            to="/search"
            className="flex-1 bg-white text-slate-900 px-8 lg:px-10 py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] font-black uppercase tracking-widest text-[10px] lg:text-xs flex items-center justify-center gap-3 border border-slate-200 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50"
          >
            Student Portal <ArrowRight size={16} />
          </Link>

          <Link
            to="/login"
            className="flex-1 bg-white text-slate-800 px-6 sm:px-8 lg:px-10 py-4 lg:py-5 rounded-2xl lg:rounded-[2rem] font-black uppercase tracking-widest text-[10px] lg:text-xs flex items-center justify-center gap-3 border border-slate-100 hover:bg-slate-50 transition-all shadow-sm"
          >
            Admin Interface
          </Link>
        </div>

        {/* Floating Features */}
        <div className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-7xl w-full px-4 md:px-0">
          <div className="p-8 lg:p-10 glass rounded-[2rem] lg:rounded-[2.5rem] luxury-border text-left hover:scale-[1.02] transition-all duration-500">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-indigo-50 text-indigo-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
              <Layers size={24} />
            </div>
            <h3 className="text-xl lg:text-2xl font-serif-luxury italic mb-4">Shuffle Matrix</h3>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed font-medium">Advanced randomization protocols to eliminate internal collusion and ensure institutional integrity.</p>
          </div>
          <div className="p-8 lg:p-10 glass rounded-[2rem] lg:rounded-[2.5rem] luxury-border text-left hover:scale-[1.02] transition-all duration-500">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-emerald-50 text-emerald-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
              <Users size={24} />
            </div>
            <h3 className="text-xl lg:text-2xl font-serif-luxury italic mb-4">Registry Logic</h3>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed font-medium">Coordinate thousands of candidate profiles via streamlined CSV normalization with zero-latency validation.</p>
          </div>
          <div className="p-8 lg:p-10 glass rounded-[2rem] lg:rounded-[2.5rem] luxury-border text-left hover:scale-[1.02] transition-all duration-500">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-amber-50 text-amber-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
              <Zap size={24} />
            </div>
            <h3 className="text-xl lg:text-2xl font-serif-luxury italic mb-4">Live Analytics</h3>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed font-medium">Export high-fidelity hall mappings and student directives in standardized PDF formats with instant generation.</p>
          </div>
        </div>
      </main>

      <footer className="px-8 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © 2026 Smart Room Allocation Systems • InfernoX
        </p>
      </footer>
    </div>
  );
}
