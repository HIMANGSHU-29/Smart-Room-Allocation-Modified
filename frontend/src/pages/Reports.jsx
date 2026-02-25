import { FileText, Download, Search, MapPin } from "lucide-react";
import logo from "../assets/logo.svg";
import { useState } from "react";
import { toast } from "react-toastify";
import API from "../services/api";

export default function Reports() {
  const [roomNo, setRoomNo] = useState("");
  const [loading, setLoading] = useState(false);

  const downloadMaster = async () => {
    try {
      const res = await API.get("/reports/pdf", { responseType: "blob" });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = "master_report.pdf";
      a.click();
    } catch (err) {
      toast.error("Master report generation failed");
    }
  };

  const downloadRoom = async () => {
    if (!roomNo) return toast.warning("Please specify a room number");
    try {
      setLoading(true);
      const res = await API.get(`/reports/pdf/room/${roomNo}`, { responseType: "blob" });
      const url = window.URL.createObjectURL(res.data);
      const a = document.createElement("a");
      a.href = url;
      a.download = `room_${roomNo}_report.pdf`;
      a.click();
      toast.success(`Report for Venue ${roomNo} ready`);
    } catch (err) {
      toast.error("Room-specific report failed. Verify venue identifier.");
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

          <div className="w-full relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
            <input
              type="text"
              placeholder="Room Number..."
              className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all font-bold text-xs"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
            />
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