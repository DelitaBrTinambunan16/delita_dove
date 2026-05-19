import { FaTrash, FaBox, FaTag } from "react-icons/fa";
const fmtRupiahLokal = (value) => {
  if (!value) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

export default function ProductCard({ product, onDelete }) {
  const { title, code, category, brand, price, stock, imageUrl } = product;


  const getProductImage = (cat) => {
    if (imageUrl) return imageUrl;

    const kategorySesuai = cat?.toLowerCase() || "";
    
    if (kategorySesuai.includes("decor")) {
      return "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=500&auto=format&fit=crop";
    }
    if (kategorySesuai.includes("attire") || kategorySesuai.includes("gown") || kategorySesuai.includes("jas")) {
      return "https://images.unsplash.com/photo-1594552072238-b8a33785b261?q=80&w=500&auto=format&fit=crop";
    }
    if (kategorySesuai.includes("cater")) {
      return "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=500&auto=format&fit=crop";
    }
    if (kategorySesuai.includes("photo") || kategorySesuai.includes("video")) {
      return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=500&auto=format&fit=crop";
    }
    if (kategorySesuai.includes("invitation") || kategorySesuai.includes("undang")) {
      return "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?q=80&w=500&auto=format&fit=crop";
    }
    if (kategorySesuai.includes("souvenir")) {
      return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=500&auto=format&fit=crop";
    }
    if (kategorySesuai.includes("beauty") || kategorySesuai.includes("mua")) {
      return "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=500&auto=format&fit=crop";
    }

    return "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=500&auto=format&fit=crop";
  };

  const finalImage = getProductImage(category);

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-0 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group overflow-hidden">
      
      {/* BAGIAN GAMBAR */}
      <div className="w-full h-44 overflow-hidden relative bg-gray-50">
        <img 
          src={finalImage} 
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Label Kategori */}
        <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
          <FaTag size={8} /> {category || "WEDDING"}
        </span>
      </div>

      {/* Bagian Info */}
      <div className="p-5 pt-4 flex flex-col flex-1">
        
        {/* Bagian Atas: Kode */}
        <div className="flex justify-end mb-1">
          <span className="text-gray-400 text-[10px] font-mono font-semibold tracking-wider">
            {code}
          </span>
        </div>

        {/* Bagian Tengah: Judul & Brand */}
        <div className="mb-4 flex-1">
          <h3 className="text-gray-800 font-bold text-sm line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-400 text-xs mt-1 font-medium">
            Vendor: <span className="text-gray-500 font-semibold">{brand || "WeddingDay"}</span>
          </p>
        </div>

        {/* Bagian Bawah: Harga, Stok, & Tombol Aksi */}
        <div className="border-t border-gray-50 pt-3 mt-auto flex items-center justify-between gap-2">
          <div>
            <p className="text-[10px] text-gray-400 font-semibold">Harga Paket</p>
            <p className="text-sm font-extrabold text-gray-900">
              {fmtRupiahLokal(price)}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Label Stok */}
            <div className="text-right">
              <p className="text-[9px] text-gray-400 font-bold flex items-center gap-0.5 justify-end">
                <FaBox size={8} /> Stok
              </p>
              <p className={`text-xs font-black ${Number(stock) === 0 ? 'text-rose-500' : 'text-gray-700'}`}>
                {stock}
              </p>
            </div>

            {/* Tombol Hapus */}
            <button
              onClick={() => onDelete(code)}
              className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
              title="Hapus Produk"
            >
              <FaTrash size={11} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}