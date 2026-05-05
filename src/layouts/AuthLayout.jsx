import { Outlet } from "react-router-dom";
import { FaGem } from "react-icons/fa"; // Ganti Heart ke Gem agar lebih elegan/luxury

export default function AuthLayout() {
    return (
        // Font (Typography)
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-poppins relative overflow-hidden px-4">
            
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="w-full max-w-[360px] z- relative">
                
                {/* Logo Section */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 mb-3">
                        <FaGem className="w-6 h-6 text-[#10B981]" />
                    </div>
                    {/* //Typography// */}
                    <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
                        Wedding<span className="text-[#10B981]">Day</span>
                    </h1>
                </div>

                <Outlet />

                {/* Footer (Typography) */}
                <p className="text-center text-[10px] text-gray-400 mt-8 font-medium uppercase tracking-[0.2em]">
                    © 2026 Admin WeddingDay
                </p>
            </div>
        </div>
    )
}
