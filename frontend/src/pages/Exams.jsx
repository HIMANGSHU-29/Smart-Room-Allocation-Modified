import { useState, useEffect } from "react";
import { Plus, Search, Calendar, X, Clock, Users, BookOpen, Trash2, Check } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";
import { toast } from "react-toastify";

export default function Exams() {
  const [exams, setExams] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departments, setDepartments] = useState([]);
  
  const [formData, setFormData] = useState({
    examId: "",
    subjectName: "",
    year: "",
    semester: "",
    courses: [],
    date: "",
    startTime: "",
    endTime: "",
    duration: ""
  });

  const fetchExams = async () => {
    try {
      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      // Depending on the backend routes protect setup, the user might need correct auth flow. 
      // If the prev conversations removed auth, maybe no token is strictly required or standard token is used.
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get("http://localhost:5000/api/exams", { headers });
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams", error);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get("http://localhost:5000/api/exams/analytics", { headers });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics", error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get("http://localhost:5000/api/students/departments", { headers });
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments", error);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchAnalytics();
    fetchDepartments();
  }, []);

  const handleCourseToggle = (dept) => {
    setFormData((prev) => {
      const isSelected = prev.courses.includes(dept);
      if (isSelected) {
        return { ...prev, courses: prev.courses.filter(c => c !== dept) };
      } else {
        return { ...prev, courses: [...prev.courses, dept] };
      }
    });
  };

  const handleDeleteExam = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam and its associated allocations?")) return;
    try {
      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.delete(`http://localhost:5000/api/exams/${id}`, { headers });
      toast.success("Exam deleted successfully");
      fetchExams();
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete exam");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      if (formData.courses.length === 0) {
        toast.error("Please select at least one course/department");
        return;
      }
      const payload = {
        ...formData,
        courses: formData.courses,
        year: Number(formData.year),
        semester: Number(formData.semester),
        duration: Number(formData.duration)
      };

      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      await axios.post("http://localhost:5000/api/exams", payload, { headers });
      
      toast.success("Exam scheduled successfully!");
      setIsModalOpen(false);
      setFormData({
        examId: "", subjectName: "", year: "", semester: "", courses: [], date: "", startTime: "", endTime: "", duration: ""
      });
      fetchExams();
      fetchAnalytics();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to schedule exam");
    }
  };

  const filteredExams = exams.filter(e => 
    e.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif-luxury text-slate-900 italic mb-2 tracking-tight">Exam Scheduling</h1>
          <div className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] flex items-center gap-3">
            <div className="w-8 md:w-12 h-px bg-blue-100" /> Coordinate Institutional Timelines
          </div>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
        >
          <Plus size={18} /> Schedule New Exam
        </button>
      </div>

      {/* Analytics Section */}
      {analytics.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Users size={20} className="text-blue-500" /> Students vs Subjects Analytics
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="students" fill="url(#colorStudents)" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50">
          <div className="flex bg-slate-50 p-3 rounded-xl w-full max-w-md border border-slate-100 focus-within:ring-2 ring-blue-100 transition-all">
            <Search className="text-slate-400 mx-3" size={20} />
            <input 
              type="text" 
              placeholder="Search by subject or course code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
        
        {filteredExams.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <Calendar size={64} className="mb-6 text-slate-200 stroke-[1]" />
            <p className="font-bold text-xl text-slate-700 mb-2">No active exams scheduled.</p>
            <p className="text-sm max-w-sm text-slate-400">Use the "Schedule New Exam" button to initialize time slots and venue parameters.</p>
          </div>
        ) : (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map(exam => (
              <div key={exam._id} className="group border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen size={64} className="text-blue-600" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
                      {new Date(exam.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <button 
                      onClick={() => handleDeleteExam(exam._id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete Exam"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{exam.subjectName}</h3>
                  <p className="text-sm font-medium text-slate-400 mb-6 flex flex-wrap gap-2">
                    {exam.courses.map(course => (
                       <span key={course} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                         {course}
                       </span>
                    ))}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-slate-600">
                      <Clock size={16} className="mr-3 text-slate-400" />
                      <span className="font-semibold">{exam.startTime}</span>
                      <span className="mx-2 text-slate-300">-</span>
                      <span className="font-semibold">{exam.endTime}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-slate-600">
                      <Users size={16} className="mr-3 text-slate-400" />
                      Year {exam.year}, Semester {exam.semester}
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Duration: {exam.duration} mins</span>
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {exam.linkedStudents?.length || 0} Students 
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Schedule Exam</h2>
                <p className="text-sm text-slate-500 mt-1">Configure exam parameters and automatically link eligible students.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateExam} className="p-6 md:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam ID / Code</label>
                  <input required name="examId" value={formData.examId} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. EXAM-2024-001" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Name</label>
                  <input required name="subjectName" value={formData.subjectName} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. Data Structures" />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Available Courses / Departments</label>
                  {departments.length === 0 ? (
                    <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">No departments synced yet. Please upload student details.</div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {departments.map((dept) => (
                        <label key={dept} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${formData.courses.includes(dept) ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                          <div className={`w-5 h-5 flex items-center justify-center rounded border ${formData.courses.includes(dept) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
                            {formData.courses.includes(dept) && <Check size={14} className="stroke-[3]" />}
                          </div>
                          <span className={`text-sm font-bold ${formData.courses.includes(dept) ? 'text-blue-700' : 'text-slate-600'}`}>
                            {dept}
                          </span>
                          <input type="checkbox" className="hidden" checked={formData.courses.includes(dept)} onChange={() => handleCourseToggle(dept)} />
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Year of Study</label>
                  <input required type="number" name="year" value={formData.year} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. 2" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Semester</label>
                  <input required type="number" name="semester" value={formData.semester} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. 4" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exam Date</label>
                  <input required type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                  <input required type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                  <input required type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Duration (mins)</label>
                  <input required type="number" name="duration" value={formData.duration} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. 180" />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  Save & Link Students
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
