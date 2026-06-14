import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { loginGuestUser } from "../../lib/auth";
import lilyImg from "../../assets/img/lily.jpg";

export default function GuestLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!dataForm.email) {
      setError("Email harus diisi untuk login pembeli.");
      setLoading(false);
      return;
    }

    try {
      loginGuestUser(dataForm.email);
      const from = location.state?.from?.pathname || "/guest";
      navigate(from, { replace: true });
    } catch (err) {
      setError("Gagal login. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[360px] mx-auto flex flex-col shadow-[0_15px_40px_rgba(0,0,0,0.10)] rounded-[28px] overflow-hidden bg-white border border-gray-100 font-poppins">
      <div className="h-40 w-full overflow-hidden bg-emerald-50">
        <img
          src={lilyImg}
          className="w-full h-full object-cover object-center"
          alt="Lily Decoration"
          onError={(e) => {
            e.target.parentElement.style.background = "linear-gradient(135deg,#d1fae5,#6ee7b7)";
            e.target.style.display = "none";
          }}
        />
      </div>

      <div className="px-8 pt-6">
        <div className="mb-4 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-[#10B981] font-bold">SayYes</p>
          <h1 className="text-2xl font-extrabold text-gray-900">Login Pembeli</h1>
          <p className="text-xs text-gray-500 mt-2">Masuk untuk pesan paket wedding, simpan promo, dan lanjutkan order dengan mudah.</p>
        </div>
      </div>

      <div className="px-8 pb-8">
        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-lg text-red-500 text-[10px] font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="border-b border-gray-100 focus-within:border-[#10B981] transition-all pb-0.5">
            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Email Address</label>
            <input
              name="email"
              type="email"
              autoComplete="off"
              onChange={handleChange}
              placeholder="contoh@domain.com"
              className="w-full py-1.5 bg-transparent focus:outline-none text-xs text-gray-700 placeholder-gray-200"
            />
          </div>

          <div className="border-b border-gray-100 focus-within:border-[#10B981] transition-all pb-0.5">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Password</label>
              <Link to="/guest/register" className="text-[9px] text-gray-400 hover:text-[#10B981] font-bold transition-colors">Daftar</Link>
            </div>
            <div className="flex items-center">
              <input
                name="password"
                type={showPass ? "text" : "password"}
                onChange={handleChange}
                placeholder="Password opsional"
                className="w-full py-1.5 bg-transparent focus:outline-none text-xs text-gray-700 placeholder-gray-200"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="text-gray-300 hover:text-[#10B981] transition-colors ml-1 flex-shrink-0"
              >
                {showPass ? <FaRegEye size={12} /> : <FaRegEyeSlash size={12} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] hover:bg-emerald-600 disabled:opacity-70 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <ImSpinner2 className="animate-spin text-sm" /> : "Masuk Sebagai Pembeli"}
          </button>
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-[9px] text-gray-300 font-medium">Atau</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        <p className="text-center text-[10px] text-gray-400 font-medium">
          Belum punya akun pembeli?{' '}
          <Link to="/guest/register" className="text-[#10B981] font-bold hover:underline">Buat akun sekarang</Link>
        </p>
      </div>
    </div>
  );
}
