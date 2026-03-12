import { useState, useEffect } from "react";
import axios from "axios";
import { ShieldAlert, Clock, AlertTriangle, Bug } from "lucide-react";

export default function Settings() {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchErrors = async () => {
    try {
      setLoading(true);
      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get("http://localhost:5000/api/errors", { headers });
      setErrors(response.data);
    } catch (error) {
      console.error("Failed to fetch error logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
  }, []);

  const triggerTestCrash = () => {
    // This will intentionally throw a render error to test the ErrorBoundary
    setErrors([...errors, { generateCrash: true }]);
  };

  // The crash generator
  if (errors.some(e => e.generateCrash)) {
    throw new Error("Simulated Test Crash triggered from Settings!");
  }

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif-luxury text-slate-900 italic mb-2 tracking-tight">System Settings</h1>
          <div className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] flex items-center gap-3">
            <div className="w-8 md:w-12 h-px bg-red-100" /> Administrative Constraints Overview
          </div>
        </div>
        
        <button 
          onClick={triggerTestCrash}
          className="bg-red-50 text-red-600 border border-red-200 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-all shadow-sm flex items-center justify-center gap-2 text-sm whitespace-nowrap"
        >
          <Bug size={18} /> Trigger Test Crash
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50 flex items-center gap-3">
          <ShieldAlert className="text-red-500" size={24} />
          <h2 className="text-xl font-bold text-slate-800">Application Crash Logs</h2>
        </div>
        
        <div className="p-0">
          {loading ? (
             <div className="p-12 text-center text-slate-400 font-medium">Loading telemetry blocks...</div>
          ) : errors.length === 0 ? (
            <div className="p-16 text-center text-slate-500 flex flex-col items-center">
              <ShieldAlert size={64} className="mb-6 text-emerald-200 stroke-[1]" />
              <p className="font-bold text-xl text-slate-700 mb-2">Systems Nominal</p>
              <p className="text-sm max-w-sm text-slate-400">No anomalous Application crashes recorded in telemetry logs.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {errors.map((err) => (
                <div key={err._id} className="p-6 md:p-8 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-2">
                       <AlertTriangle size={18} className="text-amber-500" />
                       <h3 className="font-bold text-slate-800 break-words">{err.message}</h3>
                    </div>
                    <span className="shrink-0 flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                      <Clock size={14} /> {new Date(err.timestamp).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm font-medium text-slate-500">
                     <p><span className="text-slate-400">Component:</span> {err.component || 'Unknown Element'}</p>
                     <p><span className="text-slate-400">Route URI:</span> {err.route || 'Global Execution'}</p>
                  </div>
                  
                  {err.stack && (
                    <div className="bg-slate-900 rounded-xl p-4 overflow-x-auto shadow-inner">
                      <pre className="text-xs text-red-300 font-mono font-medium leading-relaxed">
                        {err.stack}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}