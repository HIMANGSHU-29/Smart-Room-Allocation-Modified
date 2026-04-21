import { FileText, Download, Search, MapPin } from "lucide-react";
import logo from "../assets/logo.svg";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

export default function Reports() {
  const [examId, setExamId] = useState("");
  const [roomId, setRoomId] = useState("");
  
  const [exams, setExams] = useState([]);
  const [rooms, setRooms] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [examRes, roomRes] = await Promise.all([
        API.get("/exams"),
        API.get("/rooms")
      ]);
      setExams(examRes.data);
      setRooms(roomRes.data);
    } catch {
      toast.error("Failed to fetch system data for reports");
    } finally {
      setInitialLoad(false);
    }
  };

  const downloadMaster = async () => {
    try {
      const res = await API.get("/reports/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "master_report.pdf";
      a.click();
    } catch {
      toast.error("Master report generation failed");
    }
  };

  const downloadRoom = async () => {
    if (!examId || !roomId) return toast.warning("Please select both Exam and Venue");
    
    try {
      setLoading(true);
      const res = await API.get(`/reports/pdf/exam/${examId}/room/${roomId}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Exam_Venue_Report.pdf`;
      a.click();
      toast.success(`Venue Report Generated Successfully`);
    } catch (err) {
      if (err.response?.status === 404) {
          toast.info("No candidates or invigilators found for this specific session and room.");
      } else {
          toast.error("Report generation failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-serif-luxury font-black text-slate-900 tracking-tight leading-none mb-3 italic text-center underline decoration-blue-500 decoration-4 underline-offset-8">Terminal Reports</h1>
        <p className="text-slate-400 font-bold text-[10px] tracking-[0.4em] uppercase text-center mt-4 md:mt-6">Generated System Analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-100 border border-blue-100/50">
            <FileText size={36} />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-3 uppercase tracking-tight">Master Chart</h2>
          <p className="text-slate-500 text-[10px] leading-relaxed mb-8 max-w-[200px] font-medium uppercase tracking-widest">
            Full synchronization audit of all venues and candidates.
          </p>
          <button
            onClick={downloadMaster}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10"
          >
            <Download size={14} /> Global Export
          </button>
        </div>

        <div className="bg-white rounded-[2rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-indigo-100 border border-indigo-100/50">
            <MapPin size={36} />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tight">Targeted Venue</h2>

          <div className="w-full text-left mb-6 space-y-4">
            
            <div className="relative">
              <select
                value={examId}
                onChange={(e) => setExamId(e.target.value)}
                disabled={initialLoad}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-xs appearance-none text-slate-700"
              >
                <option value="">-- Select Exam Timeline --</option>
                {exams.map(ex => (
                    <option key={ex._id} value={ex._id}>{ex.examName} ({new Date(ex.date).toLocaleDateString()})</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <select
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                disabled={initialLoad}
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-xs appearance-none text-slate-700"
              >
                <option value="">-- Select Venue --</option>
                {rooms.map(rm => (
                    <option key={rm._id} value={rm._id}>Room {rm.roomNo} (Cap: {rm.capacity})</option>
                ))}
              </select>
            </div>

          </div>

          <button
            onClick={downloadRoom}
            disabled={loading}
            className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
          >
            {loading ? "Generating..." : <><Download size={14} /> Targeted PDF</>}
          </button>
        </div>
      </div>

      <div className="mt-12 flex justify-center items-center gap-2 text-slate-300">
        <img src={logo} alt="AllocateU Logo icon" className="w-4 h-4 object-contain opacity-20 grayscale" />
        <span className="text-[10px] font-bold uppercase tracking-widest">Digitally Signed & Verified Platform Report</span>
      </div>
    </div>
  );
}