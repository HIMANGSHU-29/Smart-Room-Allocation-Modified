import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white shadow h-screen p-4">

      <h2 className="text-xl font-bold text-blue-600 mb-6">
        Smart Room
      </h2>

      <nav className="space-y-3">

        <Link to="/dashboard" className="block p-2 rounded hover:bg-blue-50">
          📊 Overview
        </Link>

        <Link to="/dashboard/students" className="block p-2 rounded hover:bg-blue-50">
          👨‍🎓 Students
        </Link>

        <Link to="/dashboard/rooms" className="block p-2 rounded hover:bg-blue-50">
          🏫 Rooms
        </Link>

        <Link to="/dashboard/teachers" className="block p-2 rounded hover:bg-blue-50">
          👩‍🏫 Teachers
        </Link>

        <Link to="/dashboard/allocation" className="block p-2 rounded hover:bg-blue-50">
          🔄 Allocation
        </Link>

        <Link to="/dashboard/roster" className="block p-2 rounded hover:bg-blue-50 text-indigo-700 font-medium">
          👔 Duty Roster
        </Link>

        <Link to="/dashboard/reports" className="block p-2 rounded hover:bg-blue-50">
          📄 Reports
        </Link>

        <Link to="/dashboard/settings" className="block p-2 rounded hover:bg-blue-50">
          ⚙️ Settings
        </Link>

      </nav>
    </div>
  );
}