import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./contexts/AuthContext";
import { useState, lazy, Suspense } from "react";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Students = lazy(() => import("./pages/Students"));
const Rooms = lazy(() => import("./pages/Rooms"));
const Allocation = lazy(() => import("./pages/Allocation"));
const Reports = lazy(() => import("./pages/Reports"));
const Settings = lazy(() => import("./pages/Settings"));
const Landing = lazy(() => import("./pages/Landing"));
const Search = lazy(() => import("./pages/Search"));
const Exams = lazy(() => import("./pages/Exams"));
const Teachers = lazy(() => import("./pages/Teachers"));
const DutyRoster = lazy(() => import("./pages/DutyRoster"));

import DashboardLayout from "./components/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import SplashScreen from "./components/SplashScreen";
import ErrorBoundary from "./components/ErrorBoundary";

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFAF0] gap-4">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="text-slate-500 font-medium uppercase tracking-widest text-xs animate-pulse">Loading Module...</p>
  </div>
);

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<LoadingFallback />}>
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
              <Route path="teachers" element={<Teachers />} />
              <Route path="rooms" element={<Rooms />} />
              <Route path="exams" element={<Exams />} />
              <Route path="allocation" element={<Allocation />} />
              <Route path="roster" element={<DutyRoster />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
        <ToastContainer position="top-right" autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
    </ErrorBoundary>
  );
}