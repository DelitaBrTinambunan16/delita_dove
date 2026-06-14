export default function Footer({ variant = 'default' }) {
  if (variant === 'compact') {
    return (
      <div className="w-full mt-8">
        <p className="text-center text-[10px] text-gray-400 font-medium uppercase tracking-[0.2em]">
          © 2026 SayYes WeddingDay
        </p>
      </div>
    );
  }

  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-emerald-600 font-semibold text-sm">SayYes WeddingDay</h3>
          <p className="mt-1 text-xs text-gray-500">© 2026. Solusi pernikahan terpercaya Anda.</p>
        </div>
        <p className="text-xs text-gray-400">Hubungi kami di bagian Kontak untuk info lebih lanjut</p>
      </div>
    </footer>
  );
}