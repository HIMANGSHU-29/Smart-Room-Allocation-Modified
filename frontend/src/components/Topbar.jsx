import { useNavigate } from "react-router-dom";

export default function Topbar() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-3 flex justify-between items-center">

      <h1 className="font-semibold text-lg">
        Admin Dashboard
      </h1>

      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>

    </header>
  );
}