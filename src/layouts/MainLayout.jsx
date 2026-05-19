import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#F8F9FA] font-poppins antialiased tracking-tight text-slate-800">

      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <div className="h-[56px] bg-white border-b border-gray-100 flex items-center px-6 z-10">
          <Header />
        </div>

        {/* CONTENT */}
          <main className="flex-1 p-4 overflow-y-auto">
            <div className="max-w-[1200px] mx-auto">
            <Outlet />
          </div>

          <Footer />
        </main>

      </div>
    </div>
  );
}