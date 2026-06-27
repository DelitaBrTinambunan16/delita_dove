import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import ProductForm from "../components/ProductForm";
import ProductCard from "../components/ProductCard";
import productsData from "../data/produkData.json";
import { supabase } from "../lib/supabaseClient";

const emptyForm = {
  title: "",
  code: "",
  category: "",
  brand: "",
  price: "",
  stock: "",
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, title, code, category, brand, price, stock, image_url")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setProducts(data && data.length > 0 ? data : productsData);
      if (!data || data.length === 0) {
        setMessage("Tabel products kosong, menampilkan data contoh lokal.");
      }
    } catch (error) {
      console.error("Gagal memuat produk Supabase:", error);
      setProducts(productsData);
      setMessage("Tabel products belum siap, menampilkan data contoh lokal.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProduct(null);
  };

  const openCreateForm = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
      title: product.title || "",
      code: product.code || "",
      category: product.category || "",
      brand: product.brand || "",
      price: product.price || "",
      stock: product.stock || "",
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: form.title,
      code: form.code,
      category: form.category,
      brand: form.brand || "Delita Dove",
      price: Number(form.price || 0),
      stock: Number(form.stock || 0),
    };

    try {
      if (editingProduct?.id && !String(editingProduct.id).startsWith("local-")) {
        const { data, error } = await supabase
          .from("products")
          .update(payload)
          .eq("id", editingProduct.id)
          .select()
          .single();

        if (error) throw error;
        setProducts(products.map((product) => product.id === editingProduct.id ? data : product));
        setMessage("Produk berhasil diupdate.");
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert(payload)
          .select()
          .single();

        if (error) throw error;
        setProducts([data, ...products]);
        setMessage("Produk berhasil ditambahkan.");
      }
    } catch (error) {
      console.error("Gagal menyimpan produk:", error);
      const localProduct = { ...payload, id: editingProduct?.id || `local-${Date.now()}` };
      if (editingProduct) {
        setProducts(products.map((product) => product.code === editingProduct.code ? localProduct : product));
      } else {
        setProducts([localProduct, ...products]);
      }
      setMessage("Supabase belum siap, perubahan hanya tersimpan sementara di browser.");
    }

    setShowForm(false);
    resetForm();
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Hapus produk ${product.title}?`)) return;

    try {
      if (product.id && !String(product.id).startsWith("local-")) {
        const { error } = await supabase.from("products").delete().eq("id", product.id);
        if (error) throw error;
      }
      setProducts(products.filter((item) => item.id !== product.id && item.code !== product.code));
      setMessage("Produk berhasil dihapus.");
    } catch (error) {
      console.error("Gagal menghapus produk:", error);
      setMessage("Gagal menghapus produk dari Supabase.");
    }
  };

  return (
    <div className="space-y-4 font-poppins bg-[#F9F7F5] min-h-screen p-8">
      <PageHeader
        title="Produk"
        description="Atur paket produk pernikahan dengan cepat"
      >
        <button
          onClick={openCreateForm}
          className="bg-[var(--color-primary)] hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-2xl shadow-md shadow-emerald-100 transition-all flex items-center gap-2 text-sm"
        >
          Tambah Produk
        </button>
      </PageHeader>

      <ProductForm
        show={showForm}
        onClose={() => {
          setShowForm(false);
          resetForm();
        }}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        editingProduct={editingProduct}
      />

      {message && (
        <div className="rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-medium text-slate-600 shadow-sm">
          {message}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-slate-100 bg-white px-4 py-8 text-center text-sm text-slate-400">
          Memuat produk...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product, i) => (
            <ProductCard
              key={product.code || i}
              product={product}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {!loading && products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400 text-sm font-medium">Belum ada paket produk pernikahan.</p>
        </div>
      )}
    </div>
  );
}
