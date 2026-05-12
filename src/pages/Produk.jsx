import { useState } from "react";
import PageHeader from "../components/PageHeader";
import productsData from "../data/produkData.json";
import { Package, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

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
        id: products.length + 1 // 🔥 PENTING: BIAR TIDAK UNDEFINED
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
    <div>

      <PageHeader
        title="Products"
        breadcrumb={["Dashboard", "Product List"]}
      >
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-xl"
        >
          Add Product
        </button>
      </PageHeader>

      {/* FORM */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 mt-5 rounded-2xl space-y-4">

          <input placeholder="Product Title"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <input placeholder="Product Code"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />

          <input placeholder="Category"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />

          <input placeholder="Brand"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
          />

          <input placeholder="Price"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />

          <input placeholder="Stock"
            className="border p-3 w-full"
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save Product
          </button>

        </form>
      )}

      {/* TABLE */}
      <div className="mt-6 bg-white rounded-2xl shadow-sm overflow-x-auto">

        <table className="w-full whitespace-nowrap">

          <thead>
            <tr className="bg-gray-50 text-xs uppercase text-gray-500">
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody>

            {products.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">

                {/* PRODUCT LINK */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">

                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <Package size={18} />
                    </div>

                    <Link
                      to={`/products/${p.id}`}
                      className="text-green-600 hover:underline font-medium"
                    >
                      {p.title}
                    </Link>

                  </div>
                </td>

                <td className="px-6 py-4 text-gray-500">{p.code}</td>
                <td className="px-6 py-4">{p.category}</td>
                <td className="px-6 py-4">{p.brand}</td>

                <td className="px-6 py-4 font-medium">
                  Rp {Number(p.price).toLocaleString("id-ID")}
                </td>

                <td className="px-6 py-4">{p.stock}</td>

                <td className="px-6 py-4 flex gap-2">

                  <button className="bg-yellow-100 p-2 rounded">
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(p.code)}
                    className="bg-red-100 p-2 rounded"
                  >
                    <Trash2 size={16} />
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>
      </div>
    </div>
  );
}