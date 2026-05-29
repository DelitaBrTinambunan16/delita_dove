import { FaCalendarAlt } from "react-icons/fa";

export default function DashboardIntroBar() {
  return (
    <div className="bg-white rounded-xl px-6 py-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-gray-100 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest font-barlow">Wedplan Workspace</p>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="hidden md:inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1.5 rounded-xl text-[10px] font-bold border border-primary/10">
          <FaCalendarAlt className="text-secondary" /> REPORT CYCLE 2026
        </span>
      </div>
    </div>
  );
}
