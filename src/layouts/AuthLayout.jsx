import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function AuthLayout() {
    return (
        // Font (Typography)
        <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] font-poppins relative overflow-hidden px-4">

            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60"></div>

            <div className="w-full max-w-[360px] z- relative">
                <Outlet />

                {/* Use shared Footer in compact variant to match layouts */}
                <Footer variant="compact" />
            </div>
        </div>
    );
}
