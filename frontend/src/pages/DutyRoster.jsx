import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ServerCog, UserCheck, Search, Users, ShieldAlert, ArrowRight } from "lucide-react";
import API from "../services/api";

const DutyRoster = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState("");
  const [allocating, setAllocating] = useState(false);
  const [roster, setRoster] = useState([]);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const { data } = await API.get("/exams");
      setExams(data);
    } catch {
      toast.error("Failed to fetch exams");
    } finally {
      setLoadingExams(false);
    }
  };

  const handleRunAlgorithm = async () => {
    if (!selectedExam) return toast.warning("Select an exam first");
    
    try {
      setAllocating(true);
      const { data } = await API.post("/allocate/invigilators", { examId: selectedExam });
      toast.success(data.message);
      
      // We will enhance this in the next pass to fetch actual populated roster records
      setRoster(data.roster);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to assign invigilators");
    } finally {
      setAllocating(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-[90vh] flex flex-col">
      <div className="mb-10 text-center animate-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-serif-luxury text-slate-900 italic mb-4 tracking-tighter">Duty Roster Console</h1>
        <p className="text-slate-400 font-bold text-[10px] tracking-[0.3em] uppercase flex items-center justify-center gap-4">
          <div className="w-12 h-px bg-slate-200" /> Automated Invigilation Engine <div className="w-12 h-px bg-slate-200" />
        </p>
      </div>

      <div className="glass rounded-[2rem] p-8 md:p-12 luxury-border shadow-xl shadow-slate-200/50 mb-10 border border-white/60 animate-in zoom-in-95 duration-500">
        <div className="flex flex-col md:flex-row gap-6 items-center flex-wrap">
          
          <div className="flex-1 w-full relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Search size={18} />
            </div>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              disabled={loadingExams}
              className="w-full pl-12 pr-6 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all font-medium text-slate-700 disabled:opacity-50 appearance-none shadow-inner"
            >
              <option value="">Select Target Exam Timeline</option>
              {exams.map((ex) => (
                <option key={ex._id} value={ex._id}>
                  {ex.examName} • {new Date(ex.date).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleRunAlgorithm}
            disabled={allocating || !selectedExam}
            className="w-full md:w-auto px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50 hover:-translate-y-0.5 active:translate-y-0"
          >
            {allocating ? (
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <><ServerCog size={16} /> Execute Matrix</>
            )}
          </button>
        </div>

        {roster.length > 0 && (
          <div className="mt-8 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100/50 flex items-start gap-4 animate-in slide-in-from-top-4">
             <div className="p-2 bg-emerald-100 rounded-xl mt-1"><UserCheck size={18} /></div>
             <div>
                <p className="font-bold text-xs uppercase tracking-widest mb-1">Algorithm Success</p>
                <p className="text-sm font-medium">Successfully locked {roster.length} active invigilators into duty slots for the selected exam session. Their maximum limits were respected.</p>
             </div>
          </div>
        )}
      </div>

      <div className="flex-1 glass rounded-[2rem] luxury-border shadow-sm overflow-hidden flex flex-col bg-white">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm mb-1">Master Roster</h3>
              <p className="text-xs font-medium text-slate-400">Live view of current assignments.</p>
            </div>
            <div className="px-4 py-2 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 shadow-sm text-slate-600 flex items-center gap-2">
                <Users size={14} /> {roster.length} Records
            </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 min-h-[300px]">
          {roster.length === 0 ? (
            <>
              <ShieldAlert size={48} className="mb-6 opacity-20" />
              <p className="font-bold uppercase tracking-widest text-xs mb-2">Network Idle</p>
              <p className="text-sm font-medium opacity-60">Select an exam event and execute the matrix above to view the mapped roster.</p>
            </>
          ) : (
            <>
               <ArrowRight size={48} className="mb-6 opacity-20" />
               <p className="font-bold uppercase tracking-widest text-xs mb-2">Awaiting Roster Render</p>
               <p className="text-sm font-medium opacity-60">The grid is currently syncing populated teacher/room details...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DutyRoster;
