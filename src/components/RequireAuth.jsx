import { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function RequireAuth({ children }) {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setAuthenticated(!!session);
      setChecking(false);
    };
    checkSession();
  }, []);

  if (checking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F9F7F5]">
        <div className="text-sm text-gray-400 font-poppins">Memeriksa sesi...</div>
      </div>
    );
  }

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
