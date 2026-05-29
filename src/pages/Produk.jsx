import { useState } from "react";
import PageHeader from "../components/PageHeader";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard"; 
import productsData from "../data/produkData.json";

export default function Products() {
  const [products, setProducts] = useState(productsData);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    code: "",
    category: "",
    brand: "",
    price: "",
    stock: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    setProducts([
      ...products,
      {
        ...form,
        id: products.length + 1
      }
    ]);

    setForm({
      title: "",
      code: "",
      category: "",
      brand: "",
      price: "",
      stock: ""
    });

    setShowForm(false);
  };

  const handleDelete = (code) => {
    setProducts(products.filter((p) => p.code !== code));
  };

  return (
    <div className="space-y-4 font-poppins bg-[#F9F7F5] min-h-screen p-8">
      <PageHeader
        title="Produk"
        description="Atur paket produk pernikahan dengan cepat"
      >
        <button
          onClick={() => setShowForm(true)}
          className="bg-[var(--color-primary)] hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-2xl shadow-md shadow-emerald-100 transition-all flex items-center gap-2 text-sm"
        >
          Tambah Produk
        </button>
      </PageHeader>

      <ProductForm 
        show={showForm} 
        onClose={() => setShowForm(false)} 
        form={form} 
        setForm={setForm} 
        onSubmit={handleSubmit} 
      />

      {/* ── SEKARANG MENGGUNAKAN GRID LAYOUT PRODUCT CARD ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, i) => (
          <ProductCard 
            key={product.code || i} 
            product={product} 
            onDelete={handleDelete} 
          />
        ))}
      </div>

      {/* Tampilan alternatif jika produk kosong */}
      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm font-medium">Belum ada paket produk pernikahan.</p>
        </div>
      )}
    </div>
  );
}