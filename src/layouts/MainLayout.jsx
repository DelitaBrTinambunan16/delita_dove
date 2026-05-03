import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div id="app-container" className="bg-[#f4f6f8] min-h-screen flex font-barlow">
      <Sidebar />
      <div id="main-content" className="flex-1 overflow-x-hidden">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}
