import { useEffect, useState } from "react";
import { Users, Home, CheckCircle, PieChart, Clock, ArrowUpRight, BookOpen, MapPin, Zap } from "lucide-react";
import API from "../services/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalHalls: 0,
    seated: 0,
    unassigned: 0,
    utilization: 0,
    recentExaminees: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await API.get("/students/stats");
        setStats(data);
        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000); // 5s high-freq sync
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-6xl font-serif-luxury text-slate-900 italic mb-2 tracking-tight">System Insights</h1>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] flex items-center gap-3">
            <div className="w-8 md:w-12 h-px bg-blue-100" /> Operational Protocol Interface
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3 px-5 py-2.5 glass rounded-2xl luxury-border">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Active Integrity Sweep</span>
          </div>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mr-2">Last Sync: {lastUpdated}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users size={20} />} color="bg-slate-900" term="Candidates" />
        <StatCard title="Total Rooms" value={stats.totalHalls} icon={<MapPin size={20} />} color="bg-blue-600" term="Capacity" />
        <StatCard title="Seated Students" value={stats.seated} icon={<CheckCircle size={20} />} color="bg-slate-800" term="Verified" />
        <StatCard title="Core Load" value={`${stats.utilization}%`} icon={<PieChart size={20} />} color="bg-indigo-600" term="Efficiency" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] luxury-border shadow-xl overflow-hidden">
          <div className="px-12 py-10 border-b border-slate-50 flex items-center justify-between bg-white">
            <h3 className="text-2xl font-serif-luxury text-slate-800 italic flex items-center gap-4">
              <BookOpen size={20} className="text-blue-500" />
              Latest Registrations
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/20 text-left">
                  <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Candidate Identity</th>
                  <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Division</th>
                  <th className="px-12 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Registry State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {stats.recentExaminees.length > 0 ? (
                  stats.recentExaminees.map((s) => (
                    <tr key={s._id} className="hover:bg-blue-50/20 transition-all">
                      <td className="px-12 py-6">
                        <p className="font-bold text-slate-900 text-sm tracking-tight">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest number-solid">{s.rollNumber}</p>
                      </td>
                      <td className="px-12 py-6 text-xs font-black text-slate-600 uppercase tracking-tighter">{s.department || "General"}</td>
                      <td className="px-12 py-6 text-right">
                        <span className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${s.allocationStatus === 'Allocated'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                          : 'text-amber-700 bg-amber-50 border-amber-100'}`}>
                          {s.allocationStatus === 'Allocated' ? 'Seated' : 'Awaiting'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-12 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-20">
                        <Zap size={40} className="animate-pulse" />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Protocol Telemetry</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-dark rounded-[2.5rem] p-12 text-white relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -top-20 -right-20 opacity-5 rotate-12 scale-150"><PieChart size={300} /></div>
          <div>
            <h3 className="text-lg font-black mb-12 flex items-center gap-4 uppercase tracking-[0.3em] text-white/40">
              <div className="w-10 h-px bg-white/20" /><center> Status</center>
            </h3>
            <div className="space-y-12 relative z-10">
              <div className="flex justify-between items-end border-b border-white/5 pb-10">
                <div className="space-y-2">
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Pending </p>
                  <p className="text-4xl md:text-6xl font-serif-luxury text-white leading-none number-solid">{stats.unassigned}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em]">Verified</p>
                  <p className="text-4xl md:text-6xl font-serif-luxury text-emerald-400 leading-none number-solid">{stats.seated}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center px-2">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30">System Load Factors</span>
                  <span className="text-2xl font-serif-luxury text-blue-400 number-solid">{stats.utilization}%</span>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
                  <div className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full rounded-full transition-all duration-1000" style={{ width: `${stats.utilization}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-start gap-5 backdrop-blur-md">
              <div className="w-2 h-2 mt-2 bg-blue-400 rounded-full animate-ping"></div>
              <p className="text-[11px] font-medium leading-relaxed text-white/50 tracking-tight">
                The allocation engine is currently sustaining optimal throughput. Automated shuffling protocols are standing by for next shift cycle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, term }) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-5 group hover:shadow-lg hover:border-blue-100 transition-all duration-300 luxury-border">
    <div className={`w-14 h-14 ${color} text-white rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-black text-slate-800">{value}</p>
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-tight">{term}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;