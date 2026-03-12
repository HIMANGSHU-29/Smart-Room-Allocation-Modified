import { Component } from 'react';
import { AlertCircle } from 'lucide-react';
import axios from 'axios';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to the backend
    this.logCrash(error, errorInfo);
  }

  logCrash = async (error, errorInfo) => {
    try {
      const payload = {
        message: error.toString(),
        stack: errorInfo.componentStack || error.stack,
        component: "React ErrorBoundary",
        route: window.location.pathname
      };
      
      const dbUser = JSON.parse(localStorage.getItem("dbUser") || "{}");
      const token = dbUser?.token;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      await axios.post('http://localhost:5000/api/errors', payload, { headers });
      console.log("Crash report sent successfully");
    } catch (e) {
      console.error("Failed to send crash report", e);
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-slate-200/50 max-w-2xl w-full border border-red-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6">
              <AlertCircle size={32} />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif-luxury italic text-slate-900 mb-4">Application Crash</h1>
            <p className="text-slate-500 font-medium mb-8">
              An unexpected error occurred. A detailed crash report has been automatically sent to the administrative logs.
            </p>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 w-full text-left overflow-x-auto">
              <p className="text-xs font-mono text-red-600 font-medium whitespace-pre-wrap break-all">
                {this.state.error && this.state.error.toString()}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
