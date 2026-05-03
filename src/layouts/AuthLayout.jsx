import { Outlet } from "react-router-dom";
import { FaHeart } from "react-icons/fa";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-pink-50 relative overflow-hidden">
            {/* Decorative background circles */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

            <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md z-10 relative border border-white/50 backdrop-blur-sm">
                <div className="flex flex-col items-center justify-center mb-8">
                    <div className="bg-gradient-to-tr from-[#fa2b56] to-pink-400 p-4 rounded-full mb-4 shadow-lg shadow-pink-200">
                        <FaHeart className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 text-center leading-snug">
                        Blush Moments<br/><span className="text-[#fa2b56]">Wedding</span>
                    </h1>
                </div>

                <Outlet/>

                <p className="text-center text-xs text-gray-400 mt-8">
                    © 2026 Admin Blush Moments Wedding.<br/>All rights reserved.
                </p>
            </div>
        </div>
    )
}