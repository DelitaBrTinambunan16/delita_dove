import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import { loginGuestUser } from "../../lib/auth";
import lilyImg from "../../assets/img/lily.jpg";

export default function GuestRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [dataForm, setDataForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setDataForm({ ...dataForm, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!dataForm.email) {
      setError("Email harus diisi untuk membuat akun.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      loginGuestUser(dataForm.email);
      setLoading(false);
      navigate("/guest", { replace: true });
    }, 600);
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
          <h1 className="text-2xl font-extrabold text-gray-900">Daftar Akun Pembeli</h1>
          <p className="text-xs text-gray-500 mt-2">Buat akun pembeli untuk pesan paket, simpan promo, dan lihat riwayat order dengan mudah.</p>
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
              <span className="text-[9px] text-gray-400 font-bold">&nbsp;</span>
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

          <div className="border-b border-gray-100 focus-within:border-[#10B981] transition-all pb-0.5">
            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block mb-1">Tahu kami dari mana?</label>
            <select
              name="source"
              onChange={handleChange}
              className="w-full py-1.5 bg-transparent focus:outline-none text-xs text-gray-700"
              defaultValue=""
            >
              <option value="" disabled>Pilih sumber...</option>
              <option value="Instagram">Instagram</option>
              <option value="TikTok">TikTok</option>
              <option value="Facebook">Facebook</option>
              <option value="Teman/Keluarga">Teman / Keluarga</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#10B981] hover:bg-emerald-600 disabled:opacity-70 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-2"
          >
            {loading ? <ImSpinner2 className="animate-spin text-sm" /> : "Buat Akun Pembeli"}
          </button>
        </form>
      </div>
    </div>
  );
}
