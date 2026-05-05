import { Link } from "react-router-dom"
import { FaArrowLeft } from "react-icons/fa"

// Import gambar agar seragam dengan Login
import lilyImg from "../../assets/img/lily.jpg" 

export default function Forgot() {
    return (
        /* Ukuran max-w-[360px] agar pas di website dan seragam dengan Login */
        <div className="w-full max-w-[360px] mx-auto flex flex-col shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-[35px] overflow-hidden bg-white border border-gray-50">
            
            {/* GAMBAR: Dibuat ringkas (h-32) agar tidak kepanjangan */}
            <div className="h-32 w-full overflow-hidden">
                <img 
                    src={lilyImg} 
                    className="w-full h-full object-cover" 
                    alt="Lily Wedding"
                    onError={(e) => { e.target.style.display = 'none' }}
                />
            </div>

            {/* FORM BODY */}
            <div className="px-8 pb-10 pt-6">
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
                    <p className="text-gray-400 text-[10px] mt-1 font-medium leading-relaxed">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                <form className="space-y-6">
                    {/* Input Email (Gaya Underline Emerald) */}
                    <div className="relative border-b border-gray-100 focus-within:border-[#C5A358] transition-all">
                        <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Email Address</label>
                        <input 
                            type="email"
                            placeholder="your@email.com"
                            className="w-full py-2 bg-transparent focus:outline-none text-xs text-gray-700 placeholder-gray-200"
                        />
                    </div>

                    {/* Tombol Reset */}
                    <button 
                        type="submit"
                        className="w-full bg-[#10B981] hover:bg-emerald-600 text-white py-3.5 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 transition-all"
                    >
                        Send Reset Link
                    </button>
                </form>

                {/* Kembali ke Login */}
                <div className="mt-8 text-center">
                    <Link 
                        to="/login" 
                        className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-[#10B981] transition-colors"
                    >
                        <FaArrowLeft size={10} />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    )
}