import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Rooms from "./pages/Rooms";
import Allocation from "./pages/Allocation";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Landing from "./pages/Landing";
import Search from "./pages/Search";
import Exams from "./pages/Exams";

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";
import { useState } from "react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root */}
          <Route path="/" element={<Landing />} />

          {/* Search Portal (Public) */}
          <Route path="/search" element={<Search />} />

          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard Layout */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Default dashboard page */}
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="rooms" element={<Rooms />} />
            <Route path="exams" element={<Exams />} />
            <Route path="allocation" element={<Allocation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}