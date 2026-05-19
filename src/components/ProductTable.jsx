import { Package, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductTable({ products, onDelete }) {
  return (
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
                <button className="bg-yellow-100 p-2 rounded hover:bg-yellow-200 transition-colors">
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => onDelete(p.code)}
                  className="bg-red-100 p-2 rounded hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
