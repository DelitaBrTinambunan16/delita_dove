import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    // Typography dan collor palate
<div className="flex min-h-screen bg-[#F8F9FA] font-poppins antialiased tracking-tight text-slate-800">
      
      {/* SIDEBAR */}
      <Sidebar />

      {/* MAIN */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* HEADER */}
        <header className="h-[72px] bg-white border-b border-gray-100 flex items-center px-8 z-10">
          <Header />
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-8 overflow-y-auto bg-[#F8F9FA]">
          <div className="max-w-[1600px] mx-auto">
             <Outlet />
          </div>
        </main>

      </div>
    </div>
  );
}