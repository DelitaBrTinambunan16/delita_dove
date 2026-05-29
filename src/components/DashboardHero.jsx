export default function DashboardHero({ pendingOrders }) {
  return (
    <div className="lg:col-span-5 bg-white rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[230px] border border-gray-100 shadow-[0_12px_40px_rgba(0,0,0,0.015)] group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-dark to-primary"></div>
      <div className="space-y-2 max-w-[58%] z-10">
        <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded font-barlow">Console Alpha</span>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 leading-tight mt-2">Hello Admin!</h2>
        <p className="text-xs text-gray-400 font-light mt-1">
          Ada <span className="font-semibold text-primary-dark bg-primary/10 px-1 rounded">{pendingOrders} approval baru</span> yang perlu divalidasi.
        </p>
      </div>
      <button className="z-10 w-fit mt-4 bg-primary-dark hover:bg-primary text-white font-semibold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 duration-150 cursor-pointer">
        Kelola Kontrak
      </button>
      <div className="absolute right-0 bottom-0 top-0 w-[44%] bg-cover bg-center hidden sm:block transition-transform duration-700 group-hover:scale-102"
           style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=400')` }}>
        <div className="w-full h-full bg-gradient-to-r from-white via-white/10 to-transparent"></div>
      </div>
    </div>
  );
}
