import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { getGuestLoggedUserEmail, isGuestLoggedIn, logoutGuestUser } from "../lib/auth";

export default function GuestLayout() {
  const [guestLoggedIn, setGuestLoggedIn] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [showLoginDropdown, setShowLoginDropdown] = useState(false);

  useEffect(() => {
    setGuestLoggedIn(isGuestLoggedIn());
    setGuestEmail(getGuestLoggedUserEmail() || "");
  }, []);

  const handleLogout = () => {
    logoutGuestUser();
    localStorage.removeItem("member");
    setGuestLoggedIn(false);
    setGuestEmail("");
    window.dispatchEvent(new Event("guest-logout"));
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] font-poppins text-slate-800">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/guest#home" className="text-xl font-black text-emerald-600">SayYes WeddingDay</a>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            <a href="/guest#home" className="transition hover:text-emerald-600">Home</a>
            <a href="/guest#produk" className="transition hover:text-emerald-600">Produk</a>
            <a href="/guest#promo" className="transition hover:text-emerald-600">Promo</a>
            <a href="/guest#kontak" className="transition hover:text-emerald-600">Kontak</a>
          </nav>
          <div className="flex items-center gap-4">
            {/* Prominent member CTA (moved into Login dropdown to avoid duplicates) */}

            {guestLoggedIn ? (
              <div className="flex items-center gap-3">
                <span className="hidden rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 sm:inline-flex">Hi, {guestEmail.split("@")[0]}</span>
                <Link to="/member" className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-200">Profil Member</Link>
                <button onClick={handleLogout} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={() => setShowLoginDropdown(!showLoginDropdown)} className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-emerald-200 hover:bg-emerald-700">Login</button>
                  {showLoginDropdown && (
                    <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-slate-200 z-50">
                      <Link to="/login" onClick={() => setShowLoginDropdown(false)} className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Login Admin</Link>
                      <Link to="/guest/login" onClick={() => setShowLoginDropdown(false)} className="block px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50 border-t border-b border-slate-100">Login Member</Link>
                      <Link to="/guest/register" onClick={() => setShowLoginDropdown(false)} className="block px-4 py-2 text-sm text-emerald-700 hover:bg-emerald-50">Daftar Member</Link>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
