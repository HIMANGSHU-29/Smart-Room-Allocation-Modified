import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight, Layers, Users, Zap } from "lucide-react";
import logo from "../assets/logo.svg";
import heroVideo from "../assets/2trwfyayb5rmy0cwxcmbd4rzfr_result_.mp4";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div 
      className="min-h-screen flex flex-col text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden bg-[#fffaf0]"
    >
      {/* Navigation */}
      <div className="px-4 md:px-6 pt-4 md:pt-6 sticky top-0 z-50">
        <nav className="bg-[#fffaf0] px-6 md:px-12 h-16 md:h-20 flex items-center justify-between border border-slate-200 rounded-[1.5rem] shadow-xl shadow-slate-200/50 backdrop-blur-md">
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
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20 text-center relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-400/5 blur-[120px] rounded-full -z-10" />

        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center text-left">
          
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center lg:items-start text-center lg:text-left z-10 px-2 sm:px-0"
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full luxury-border text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8 sm:mb-10 shadow-sm"
            >
              <Zap size={12} fill="currentColor" /> Smart Room Allocation
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] font-serif-luxury italic mb-6 sm:mb-8 tracking-tighter leading-[1.1] text-slate-950"
            >
              Smart Classroom <br /> <span className="text-blue-600">Allocation System</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-slate-500 text-base sm:text-lg md:text-xl lg:text-2xl mb-10 sm:mb-12 max-w-xl leading-relaxed font-medium"
            >
              Automated exam seating and classroom distribution system designed to manage students efficiently and eliminate manual errors.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto max-w-[280px] sm:max-w-none"
            >
              <Link
                to="/search"
                className="bg-white text-slate-900 px-8 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-3 border border-slate-200 hover:bg-slate-50 transition-all shadow-xl shadow-slate-200/50 hover:-translate-y-1"
              >
                Student Portal <ArrowRight size={16} />
              </Link>

              <Link
                to="/login"
                className="bg-white text-slate-800 px-8 py-4 sm:py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] sm:text-xs flex items-center justify-center gap-3 border border-slate-100 hover:bg-slate-50 transition-all shadow-sm hover:-translate-y-1"
              >
                Admin Interface
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.9, x: 40 }}
             animate={{ opacity: 1, scale: 1, x: 0 }}
             transition={{ delay: 0.3, duration: 0.8, type: "spring", stiffness: 50 }}
             className="w-full flex justify-center lg:justify-end px-4 sm:px-8 lg:px-0 relative"
          >
             {/* Fancy backdrop for the video */}
             <div className="absolute inset-0 bg-gradient-to-tr from-blue-200/40 to-indigo-100/40 rounded-[3rem] -z-10 rotate-3 scale-105 transition-transform duration-700 hover:rotate-6 hover:scale-110 blur-xl"></div>
             <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl rounded-[3rem] -z-10 border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)]"></div>
             
             {/* Responsive Video Container */}
             <div className="relative w-full max-w-lg lg:max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border-4 border-white/80 transform transition-transform hover:scale-[1.02] duration-500">
                <video 
                  src={heroVideo} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover scale-[1.01]"
                />
                
                {/* Subtle gradient overlay to make it look premium */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent mix-blend-overlay pointer-events-none"></div>
             </div>
          </motion.div>

        </div>

        {/* Floating Features */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 md:mt-32 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-7xl w-full px-4 md:px-0"
        >
          <div className="p-8 lg:p-10 glass rounded-[2rem] lg:rounded-[2.5rem] luxury-border text-left hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-indigo-50 text-indigo-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
              <Layers size={24} />
            </div>
            <h3 className="text-xl lg:text-2xl font-serif-luxury italic mb-4">Shuffle Matrix</h3>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed font-medium">Advanced randomization protocols to eliminate internal collusion and ensure institutional integrity.</p>
          </div>
          <div className="p-8 lg:p-10 glass rounded-[2rem] lg:rounded-[2.5rem] luxury-border text-left hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-emerald-50 text-emerald-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
              <Users size={24} />
            </div>
            <h3 className="text-xl lg:text-2xl font-serif-luxury italic mb-4">Registry Logic</h3>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed font-medium">Coordinate thousands of candidate profiles via streamlined CSV normalization with zero-latency validation.</p>
          </div>
          <div className="p-8 lg:p-10 glass rounded-[2rem] lg:rounded-[2.5rem] luxury-border text-left hover:scale-[1.02] transition-all duration-500 hover:-translate-y-2">
            <div className="w-12 h-12 lg:w-14 lg:h-14 bg-amber-50 text-amber-600 rounded-2xl lg:rounded-3xl flex items-center justify-center mb-6 lg:mb-8 shadow-sm">
              <Zap size={24} />
            </div>
            <h3 className="text-xl lg:text-2xl font-serif-luxury italic mb-4">Live Analytics</h3>
            <p className="text-slate-500 text-xs lg:text-sm leading-relaxed font-medium">Export high-fidelity hall mappings and student directives in standardized PDF formats with instant generation.</p>
          </div>
        </motion.div>
      </main>

      <footer className="px-8 py-12 border-t border-slate-200 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
          © 2026 Smart Room Allocation Systems • InfernoX
        </p>
      </footer>
    </div>
  );
}
