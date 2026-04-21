import { useState, useEffect } from "react";
import { Plus, Search, Mail, Phone, BookOpen, GraduationCap, X, Edit2, Trash2, GraduationCap as DeptIcon } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [formData, setFormData] = useState({
    id: "",
    teacherId: "",
    name: "",
    email: "",
    phone: "",
    designation: "Assistant Professor",
    isInvigilator: true,
    maxExamDuties: 5,
    unavailableDates: [],
    compatibleCourses: [],
    teachingSubjectsInput: "",
    teachingSubjects: []
  });

  const fetchTeachers = async () => {
    try {
      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get("http://localhost:5000/api/teachers", { headers });
      setTeachers(response.data);
    } catch (error) {
      console.error("Error fetching teachers", error);
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
    fetchTeachers();
    fetchDepartments();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCourseToggle = (dept) => {
    setFormData((prev) => {
      const isSelected = prev.compatibleCourses.includes(dept);
      if (isSelected) {
        return { ...prev, compatibleCourses: prev.compatibleCourses.filter(c => c !== dept) };
      } else {
        return { ...prev, compatibleCourses: [...prev.compatibleCourses, dept] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.compatibleCourses.length === 0) {
        toast.error("Please select at least one compatible course/department");
        return;
      }

      const subjectsArray = formData.teachingSubjectsInput.split(',').map(s => s.trim()).filter(Boolean);
      
      const payload = {
        teacherId: formData.teacherId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        designation: formData.designation,
        isInvigilator: formData.isInvigilator,
        maxExamDuties: formData.maxExamDuties,
        unavailableDates: formData.unavailableDates,
        compatibleCourses: formData.compatibleCourses,
        teachingSubjects: subjectsArray
      };

      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (formData.id) {
        await axios.put(`http://localhost:5000/api/teachers/${formData.id}`, payload, { headers });
        toast.success("Teacher updated successfully!");
      } else {
        await axios.post("http://localhost:5000/api/teachers", payload, { headers });
        toast.success("Teacher added successfully!");
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchTeachers();
    } catch (error) {
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to save teacher");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
       const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
       const token = dbUser?.token;
       const headers = token ? { Authorization: `Bearer ${token}` } : {};

       await axios.delete(`http://localhost:5000/api/teachers/${id}`, { headers });
       toast.success("Teacher deleted successfully");
       fetchTeachers();
    } catch (error) {
       toast.error(error.response?.data?.message || "Failed to delete teacher");
    }
  };

  const editTeacher = (teacher) => {
    setFormData({
      id: teacher._id,
      teacherId: teacher.teacherId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      designation: teacher.designation || "Assistant Professor",
      isInvigilator: teacher.isInvigilator !== undefined ? teacher.isInvigilator : true,
      maxExamDuties: teacher.maxExamDuties || 5,
      unavailableDates: teacher.unavailableDates || [],
      compatibleCourses: teacher.compatibleCourses,
      teachingSubjectsInput: teacher.teachingSubjects.join(", "),
      teachingSubjects: teacher.teachingSubjects
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      id: "", teacherId: "", name: "", email: "", phone: "", designation: "Assistant Professor", isInvigilator: true, maxExamDuties: 5, unavailableDates: [], compatibleCourses: [], teachingSubjectsInput: "", teachingSubjects: []
    });
  }

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.teacherId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.compatibleCourses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif-luxury text-slate-900 italic mb-2 tracking-tight">Faculty Intelligence</h1>
          <div className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] flex items-center gap-3">
            <div className="w-8 md:w-12 h-px bg-blue-100" /> Manage Teaching Staff Directory
          </div>
        </div>
        
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 text-sm whitespace-nowrap"
        >
          <Plus size={18} /> Add New Teacher
        </button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-6 md:p-8 border-b border-slate-50">
          <div className="flex bg-slate-50 p-3 rounded-xl w-full max-w-md border border-slate-100 focus-within:ring-2 ring-blue-100 transition-all">
            <Search className="text-slate-400 mx-3" size={20} />
            <input 
              type="text" 
              placeholder="Search by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>
        
        {filteredTeachers.length === 0 ? (
          <div className="p-16 text-center text-slate-500 flex flex-col items-center">
            <GraduationCap size={64} className="mb-6 text-slate-200 stroke-[1]" />
            <p className="font-bold text-xl text-slate-700 mb-2">No faculty records found.</p>
            <p className="text-sm max-w-sm text-slate-400">Use the "Add New Teacher" button to populate the staff directory for scheduling.</p>
          </div>
        ) : (
          <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeachers.map(teacher => (
              <div key={teacher._id} className="group border border-slate-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-900/5 transition-all bg-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <BookOpen size={64} className="text-blue-600" />
                </div>
                
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-200">
                      ID: {teacher.teacherId}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => editTeacher(teacher)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => handleDelete(teacher._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{teacher.name}</h3>
                  
                  <div className="space-y-3 mb-4 block">
                    <div className="flex items-center text-sm text-slate-600">
                      <Mail size={16} className="mr-3 text-slate-400" />
                      <span className="font-medium">{teacher.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Phone size={16} className="mr-3 text-slate-400" />
                      <span className="font-medium">{teacher.phone}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold border border-slate-200">
                          {teacher.designation || 'Faculty'}
                      </span>
                      {teacher.isInvigilator ? (
                        <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-xs font-bold border border-emerald-200 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Invigilator (Max: {teacher.maxExamDuties || 5})
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200 flex items-center gap-1">
                             <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Exempt
                        </span>
                      )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><DeptIcon size={12}/> Compatible Courses</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {teacher.compatibleCourses.map(course => (
                         <span key={course} className="bg-blue-50 border border-blue-100 px-2 py-0.5 rounded text-blue-700 text-xs font-bold">
                           {course}
                         </span>
                      ))}
                    </div>

                    {teacher.teachingSubjects.length > 0 && (
                      <>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2"><BookOpen size={12}/> Teaching Subjects</p>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed">
                          {teacher.teachingSubjects.join(", ")}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50 bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">{formData.id ? "Edit Teacher Map" : "Enroll Teacher Map"}</h2>
                <p className="text-sm text-slate-500 mt-1">Configure registry baseline and compatible teaching matrix.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teacher ID / Roll</label>
                  <input required name="teacherId" value={formData.teacherId} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. T-2024-001" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Legal Name</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. Jane Doe" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Communication</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="jane.doe@university.edu" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contact Terminal</label>
                  <input required name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="+1..." />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Designation / Role</label>
                  <select name="designation" value={formData.designation} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all">
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Guest Faculty">Guest Faculty</option>
                    <option value="HOD">Head of Department (HOD)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Exam Duties</label>
                  <input type="number" name="maxExamDuties" value={formData.maxExamDuties} onChange={handleInputChange} min="0" max="20" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. 5" />
                  <p className="text-[10px] text-slate-400 mt-1">Maximum allowed invigilation sessions.</p>
                </div>

                <div className="space-y-2 md:col-span-2 flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => setFormData(prev => ({ ...prev, isInvigilator: !prev.isInvigilator }))}>
                    <input type="checkbox" className="hidden" checked={formData.isInvigilator} onChange={() => {}} />
                    <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${formData.isInvigilator ? 'bg-blue-600' : 'bg-slate-300'}`}>
                        {formData.isInvigilator && <div className="w-2.5 h-2.5 bg-white rounded-sm"></div>}
                    </div>
                    <div>
                        <span className="text-sm font-bold text-slate-800 block">Eligible for Exam Invigilation</span>
                        <span className="text-[10px] text-slate-500">Uncheck to completely exclude from all exam duty allocations.</span>
                    </div>
                </div>

                <div className="space-y-2 md:col-span-2 mt-4 pt-4 border-t border-slate-100">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Compatible Departments / Courses Matrix</label>
                  {departments.length === 0 ? (
                    <div className="text-sm text-slate-500 italic p-3 bg-slate-50 rounded-xl border border-slate-200">No student departments found in database sync.</div>
                  ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {departments.map((dept) => {
                        const isSelected = formData.compatibleCourses.includes(dept);
                        return (
                        <label key={dept} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${isSelected ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'}`}>
                          <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleCourseToggle(dept)} />
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 bg-white'}`}>
                            {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                          </div>
                          <span className={`text-sm font-bold ${isSelected ? 'text-blue-700' : 'text-slate-600'}`}>
                            {dept}
                          </span>
                        </label>
                      )})}
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Map Teaching Subjects</label>
                  <input required name="teachingSubjectsInput" value={formData.teachingSubjectsInput} onChange={handleInputChange} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all" placeholder="e.g. Advanced Networking, Data Structures (comma separated)" />
                  <p className="text-[10px] text-slate-400 mt-1">Separate subject identifiers by comma to map array.</p>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white shadow-[0_-10px_10px_white]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                  Abort
                </button>
                <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
                  {formData.id ? "Commit Change" : "Commit Matrix"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
