import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, Edit2, X, School, Users, CheckCircle } from "lucide-react";
import API from "../services/api";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [_loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [formData, setFormData] = useState({
    roomNo: "",
    block: "",
    capacity: 30,
    gender: "Both",
    status: "Active",
    type: "Hall"
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/rooms");
      setRooms(data);
    } catch {
      toast.error("Failed to fetch exam halls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await API.put(`/rooms/${editingRoom._id}`, formData);
        toast.success("Hall updated");
      } else {
        await API.post("/rooms", formData);
        toast.success("Exam Hall registered");
      }
      setShowModal(false);
      resetForm();
      fetchRooms();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this exam hall?")) return;
    try {
      await API.delete(`/rooms/${id}`);
      toast.success("Hall removed");
      fetchRooms();
    } catch {
      toast.error("Delete failed");
    }
  };

  const resetForm = () => {
    setFormData({
      roomNo: "",
      block: "",
      capacity: 30,
      gender: "Both",
      status: "Active",
      type: "Hall"
    });
    setEditingRoom(null);
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif-luxury text-slate-900 italic mb-2 leading-none uppercase tracking-tight">Venue Directory</h1>
          <p className="text-slate-400 font-bold text-[9px] tracking-[0.3em] uppercase flex items-center gap-3">
            <div className="w-8 md:w-12 h-px bg-blue-100" /> Asset Registry
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3.5 rounded-2xl hover:bg-blue-700 transition-all font-bold shadow-[0_20px_40px_-15px_rgba(37,99,235,0.4)] text-sm group"
        >
          <Plus size={18} className="group-hover:rotate-90 transition-all duration-300" />
          Establish New Venue
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {rooms.map((room) => (
          <div key={room._id} className="glass rounded-[2rem] md:rounded-[2.5rem] luxury-border overflow-hidden flex flex-col group hover:shadow-2xl transition-all duration-500 bg-white">
            <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100 flex justify-between items-start">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">
                  {room.block ? `Sector ${room.block}` : "General Hall"}
                </p>
                <h3 className="text-2xl font-black text-slate-900 leading-none">{room.roomNo}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${room.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                {room.status}
              </span>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Capacity Load</p>
                  <p className="text-3xl font-black text-slate-900 leading-none">
                    {room.filled}<span className="text-lg text-slate-300 ml-1">/ {room.capacity}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Utilization</p>
                  <p className="text-sm font-black text-blue-600 number-solid">
                    {Math.round((room.filled / room.capacity) * 100)}%
                  </p>
                </div>
              </div>

              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-200">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${(room.filled / room.capacity) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Filter</p>
                  <p className="text-[10px] font-black text-slate-800 uppercase italic leading-none">{room.gender}</p>
                </div>
                <div className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl">
                  <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest mb-1">Type</p>
                  <p className="text-[10px] font-black text-slate-800 uppercase italic leading-none">{room.type}</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-4 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={() => { setEditingRoom(room); setFormData({ ...room }); setShowModal(true); }}
                className="flex-1 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
              >
                <Edit2 size={12} /> Refine
              </button>
              <div className="w-px h-4 bg-slate-200 self-center" />
              <button
                onClick={() => handleDelete(room._id)}
                className="flex-1 py-2 text-[10px] font-black uppercase text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={12} /> Purge
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">{editingRoom ? "Refine Venue" : "New Venue Protocol"}</h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-xl transition-all text-slate-400 hover:text-slate-900"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateOrUpdate} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Hall Identifier</label>
                  <input required className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.roomNo} onChange={e => setFormData({ ...formData, roomNo: e.target.value })} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Sector (Optional)</label>
                  <input className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 placeholder:text-slate-300" placeholder="ALPHA" value={formData.block} onChange={e => setFormData({ ...formData, block: e.target.value.toUpperCase() })} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Unit Capacity</label>
                  <input required type="number" className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
                </div>
                <div className="col-span-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block ml-1">Gender Matrix</label>
                  <select className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all font-bold text-slate-800 appearance-none cursor-pointer" value={formData.gender} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                    <option value="Male">Male Only</option>
                    <option value="Female">Female Only</option>
                    <option value="Both">Integrated</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                {editingRoom ? "Execute Update" : "Establish Venue"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;