import { useState } from "react";
import { toast } from "react-toastify";
import { Play, RotateCcw, Users, ClipboardList, AlertCircle, FileText, Zap, X } from "lucide-react";
import logo from "../assets/logo.svg";
import API from "../services/api";

const Allocation = () => {
  const [loading, setLoading] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [stats, setStats] = useState(null);
  
  // Wizard state
  const [showWizardModal, setShowWizardModal] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [allocationType, setAllocationType] = useState(""); // "exam" or "class"

  const handleRunSeating = async (mixingType = "random") => {
    try {
      setLoading(true);
      setShowWizardModal(false);
      setWizardStep(1);
      const { data } = await API.post("/allocation/run", { mixingType });
      setStats(data);
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Seating arrangement failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetSeating = async () => {
    if (!window.confirm("WARNING: This will clear all hall assignments for the current session. Continue?")) return;

    try {
      setResetting(true);
      const { data } = await API.post("/allocation/reset");
      setStats(null);
      toast.success(data.message);
    } catch {
      toast.error("Reset failed");
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-5xl mx-auto">
      <div className="mb-12 md:mb-16 text-center">
        <h1 className="text-3xl md:text-6xl font-serif-luxury text-slate-900 italic mb-4 tracking-tight">Seating Allocations</h1>
        <p className="text-slate-400 font-bold text-[9px] tracking-[0.4em] uppercase flex items-center justify-center gap-4">
          <div className="w-8 md:w-12 h-px bg-blue-100" /> Automated Allocation Intelligence
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="glass rounded-[2.5rem] p-12 luxury-border flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500">
          <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-blue-100 group-hover:scale-110 transition-all duration-700">
            <ClipboardList size={42} />
          </div>
          <h2 className="text-3xl font-serif-luxury text-slate-900 italic mb-4">Generate Allocations</h2>
          <p className="text-sm text-slate-400 mb-12 leading-relaxed font-medium px-6">
            Execute randomized shuffle protocols across candidate sectors to ensure peak institutional integrity.
          </p>
          <button
            onClick={() => { setShowWizardModal(true); setWizardStep(1); setAllocationType(""); }}

            disabled={loading || resetting}
            className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-30"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Play size={18} fill="currentColor" /> Initialize Protocol</>}
          </button>
        </div>

        <div className="glass rounded-[2.5rem] p-12 luxury-border flex flex-col items-center text-center group hover:shadow-2xl transition-all duration-500">
          <div className="w-24 h-24 bg-rose-50 text-rose-600 rounded-3xl flex items-center justify-center mb-10 shadow-lg shadow-rose-100 group-hover:rotate-12 transition-all duration-700">
            <RotateCcw size={42} />
          </div>
          <h2 className="text-3xl font-serif-luxury text-slate-900 italic mb-4">Remove Allocations</h2>
          <p className="text-sm text-slate-400 mb-12 leading-relaxed font-medium px-6">
            Eliminate all current hall assignments to prepare core infrastructure for subsequent shifts.
          </p>
          <button
            onClick={handleResetSeating}
            disabled={loading || resetting}
            className="w-full py-5 bg-white text-slate-400 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] border border-slate-100 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all disabled:opacity-30"
          >
            {resetting ? "Resetting..." : "Remove Allocations"}
          </button>
        </div>
      </div>

      {stats && (
        <div className="bg-slate-900 text-white rounded-[2rem] p-10 border border-white/5 shadow-2xl animate-in zoom-in-95 duration-700 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 opacity-5"><Zap size={200} /></div>
          <div className="flex items-center gap-4 mb-10 relative z-10">
            <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 overflow-hidden">
              <img src={logo} alt="AllocateU Logo icon" className="w-5 h-5 object-contain invert grayscale" />
            </div>
            <h3 className="text-xl font-black uppercase tracking-tight">Execution Analytics</h3>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 relative z-10">
            <div className="p-6 md:p-10 bg-white/5 rounded-[2rem] border border-white/5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Matrix Assigned</p>
              <p className="text-4xl md:text-6xl font-serif-luxury text-emerald-400 number-solid">{stats.allocated}</p>
            </div>
            <div className="p-6 md:p-10 bg-white/5 rounded-[2rem] border border-white/5">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">Candidate Overflow</p>
              <p className="text-4xl md:text-6xl font-serif-luxury text-amber-400 number-solid">{stats.totalPending}</p>
            </div>
          </div>

          <div className="mt-10 flex gap-4 relative z-10">
            <button className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-100 transition-all shadow-xl">
              <FileText size={16} /> Export Master Chart
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 p-8 bg-blue-50/50 rounded-[2rem] border border-blue-100 flex items-start gap-6 backdrop-blur-sm">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600"><AlertCircle size={24} /></div>
        <div>
          <p className="text-xs font-black text-blue-900 uppercase tracking-widest mb-2 italic">Operation Directives</p>
          <p className="text-xs text-blue-700/70 leading-relaxed font-medium">
            The system randomly assigns students to different rooms to reduce the chance of cheating.
            If too many students are left unassigned, more exam halls should be added or extra rooms should be used.
          </p>
        </div>
      </div>

      {showWizardModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">
                {wizardStep === 1 ? "Select Allocation Type" : "Select Routine Mixing"}
              </h3>
              <button onClick={() => { setShowWizardModal(false); setWizardStep(1); }} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900"><X size={20} /></button>
            </div>
            
            <div className="p-8 space-y-4">
              {wizardStep === 1 && (
                <>
                  <MixingOption
                    title="Exam Seating"
                    desc="Allocate students with specific gap requirements for examinations."
                    icon={<ClipboardList size={20} />}
                    onClick={() => {
                      setAllocationType("exam");
                      setWizardStep(2);
                    }}
                  />
                  <MixingOption
                    title="Class Routine"
                    desc="Allocate students (and teachers) to maximum capacity for daily classes."
                    icon={<Users size={20} />}
                    onClick={() => {
                      setAllocationType("class");
                      setWizardStep(2); // In the future, this might redirect to a timetable UI instead
                    }}
                  />
                </>
              )}

              {wizardStep === 2 && allocationType === "exam" && (
                <>
                  <MixingOption
                    title="Random Shuffle"
                    desc="Maximum institutional integrity with full randomization."
                    icon={<Zap size={20} />}
                    onClick={() => handleRunSeating("random")}
                  />
                  <MixingOption
                    title="Departmental Block"
                    desc="Group candidates by academic division."
                    icon={<Users size={20} />}
                    onClick={() => handleRunSeating("department")}
                  />
                  <MixingOption
                    title="Sequential Registry"
                    desc="Strict alignment by roll number sequence."
                    icon={<ClipboardList size={20} />}
                    onClick={() => handleRunSeating("sequential")}
                  />
                  <button onClick={() => setWizardStep(1)} className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-800 tracking-widest uppercase transition-colors">
                    ← Back
                  </button>
                </>
              )}

              {wizardStep === 2 && allocationType === "class" && (
                <>
                   {/* Placeholder for the real class routine logic */}
                   <div className="text-center py-6 text-slate-500">
                     <Users size={48} className="mx-auto mb-4 text-slate-200" />
                     <p className="font-bold text-slate-700 mb-2">Class Routine Logic Setup</p>
                     <p className="text-xs leading-relaxed">
                       We need to set up Timetables and Day configurations before we can map Teachers and Students properly.
                     </p>
                   </div>
                   <button onClick={() => setWizardStep(1)} className="w-full mt-4 py-3 text-xs font-bold text-slate-500 bg-slate-50 rounded-xl hover:text-slate-800 tracking-widest uppercase transition-colors">
                    ← Back
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MixingOption = ({ title, desc, icon, onClick }) => (
  <button
    onClick={onClick}
    className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-white hover:border-blue-200 hover:shadow-xl transition-all group"
  >
    <div className="flex items-center gap-4 mb-2">
      <div className="p-2 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">{icon}</div>
      <p className="font-black text-slate-800 uppercase tracking-widest text-xs">{title}</p>
    </div>
    <p className="text-[10px] text-slate-400 font-medium leading-relaxed">{desc}</p>
  </button>
);

export default Allocation;