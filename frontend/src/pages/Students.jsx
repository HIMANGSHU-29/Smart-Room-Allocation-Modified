import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Search, Plus, Trash2, Edit2, Upload, X, ChevronLeft, ChevronRight, Filter, BookOpen } from "lucide-react";
import API from "../services/api";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [department, setDepartment] = useState("");
  const [status, _setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    department: "",
    semester: 1,
    email: "",
    phone: "",
    gender: "Male"
  });

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data } = await API.get(`/students?search=${searchTerm}&department=${department}&status=${status}&page=${page}`);
      setStudents(data.students);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, department, status]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchStudents();
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, department, status, page]); // Intentionally omitting fetchStudents to avoid loop

  const handleUpload = async () => {
    if (!file) return toast.warning("Please select a file");
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      setLoading(true);
      await API.post("/students/upload", uploadData);
      toast.success("Upload successful");
      setFile(null);
      fetchStudents();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await API.put(`/students/${editingStudent._id}`, formData);
        toast.success("Student updated");
      } else {
        await API.post("/students", formData);
        toast.success("Student added");
      }
      setShowModal(false);
      resetForm();
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/students/${id}`);
      toast.success("Student deleted");
      fetchStudents();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm("CRITICAL WARNING: Are you absolutely sure you want to wipe the entire examinee registry? This action cannot be undone.")) return;
    try {
      setLoading(true);
      await API.delete("/students/all");
      toast.success("Registry wiped successfully");
      setPage(1);
      fetchStudents();
    } catch {
      toast.error("Failed to wipe registry");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rollNumber: "",
      department: "",
      semester: 1,
      email: "",
      phone: "",
      gender: "Male"
    });
    setEditingStudent(null);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif-luxury text-slate-900 italic mb-2">Examinee Matrix</h1>
          <p className="text-slate-400 font-bold text-[9px] tracking-[0.3em] uppercase flex items-center gap-3">
            <div className="w-6 md:w-8 h-px bg-blue-200" /> Operational / Registry Registry
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleDeleteAll}
            disabled={loading || students.length === 0}
            className="flex items-center justify-center gap-2 bg-rose-50 text-rose-600 px-4 md:px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-rose-100 disabled:opacity-50 transition-all font-bold text-xs md:text-sm w-full md:w-auto border border-rose-100 shadow-sm"
          >
            <Trash2 size={16} />
            Wipe Registry
          </button>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 md:px-6 py-3 md:py-3.5 rounded-xl md:rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] text-xs md:text-sm group w-full md:w-auto"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-all duration-300" />
            Register Candidate
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 mb-8 flex flex-wrap items-center gap-6">
        <div className="relative flex-1 min-w-[320px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            type="text"
            placeholder="Search Identifier or Name..."
            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all text-sm font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3">
          <Filter size={18} className="text-slate-300" />
          <select
            className="bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-xs font-bold uppercase tracking-widest text-slate-600 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all cursor-pointer"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">Core Specializations</option>
            <option value="BCA">BCA</option>
            <option value="BBA">BBA</option>
            <option value="HM">HM</option>
            <option value="BCOM">BCOM</option>
          </select>
        </div>

        <div className="flex items-center gap-3 border-l pl-6 border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-5 py-4 rounded-2xl transition-all border border-slate-100 group">
            <Upload size={18} className="text-blue-600 group-hover:-translate-y-0.5 transition-all" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{file ? file.name : "CSV Import"}</span>
            <input type="file" accept=".csv" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </label>
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-slate-900 text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-800 disabled:opacity-30 transition-all shadow-lg shadow-slate-900/10"
          >
            Execute
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Examinee Identity</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Context</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Venue ID</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((s) => (
                <tr key={s._id} className="hover:bg-slate-50/80 transition-all group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-xs uppercase shadow-lg shadow-slate-200 group-hover:bg-blue-600 transition-all">
                        {s.name.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm tracking-tight">{s.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter number-solid">{s.rollNumber}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    <p className="text-xs font-black text-slate-800 uppercase italic tracking-tight mb-1">{s.department}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{s.semester} Semester Cycle</p>
                  </td>
                  <td className="px-10 py-6">
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all ${s.allocationStatus === "Allocated"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : "bg-orange-50 text-orange-600 border-orange-100"
                      }`}>
                      {s.allocationStatus === 'Allocated' ? 'Verified Seating' : 'Pending Matrix'}
                    </span>
                  </td>
                  <td className="px-10 py-6">
                    {s.roomNumber ? (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 text-xs font-black uppercase number-solid">
                        {s.roomNumber}
                      </div>
                    ) : (
                      <span className="text-slate-200 font-black">—</span>
                    )}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                      <button onClick={() => { setEditingStudent(s); setFormData({ ...s }); setShowModal(true); }} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(s._id)} className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-10 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Dataset Summary: <span className="text-slate-900">{students.length} Records / Page</span>
          </p>
          <div className="flex items-center gap-3">
            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all disabled:opacity-20 shadow-sm"><ChevronLeft size={16} /></button>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 text-slate-500">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all disabled:opacity-20 shadow-sm"><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">{editingStudent ? "Refine Examinee" : "New Examinee Registry"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Full Legal Name</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Registry Identifier (Roll)</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.rollNumber} onChange={e => setFormData({ ...formData, rollNumber: e.target.value })} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Gender Class</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Department / Branch</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. CSE" />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Academic Cycle (Semester)</label>
                  <input required type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.semester} onChange={e => setFormData({ ...formData, semester: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Official Email Address</label>
                  <input required type="email" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="email@institution.edu" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Contact Phone Number</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" />
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                {editingStudent ? "Execute Update" : "Establish Registry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;