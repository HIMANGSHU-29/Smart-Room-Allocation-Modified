import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("AuthProvider: Initializing Firebase Auth observer...");
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("AuthProvider: Auth state changed:", firebaseUser ? "User logged in" : "No user");
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = () => {
        navigate("/dashboard");
    };

    const logout = async () => {
        try {
            await signOut(auth);
            localStorage.removeItem("token");
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-[#FFFAF0]">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Initializing Secure Session...</p>
                    </div>
                </div>
            ) : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
