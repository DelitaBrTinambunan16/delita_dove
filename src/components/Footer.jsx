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
    <footer className="bg-white border-t border-emerald-100 py-4">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-2">

        <h2 className="text-emerald-600 font-semibold text-lg">SayYes WeddingDay</h2>

        <p className="text-sm text-gray-500 text-center">© 2026 SayYes WeddingDay</p>

        <div className="flex gap-4 text-sm text-gray-600">
          <a href="#" className="hover:text-emerald-600 transition">Home</a>
          <a href="#" className="hover:text-emerald-600 transition">Produk</a>
          <a href="#" className="hover:text-emerald-600 transition">Kontak</a>
        </div>

      </div>
    </footer>
  );
}