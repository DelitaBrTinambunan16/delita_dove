import { useParams, Link } from "react-router-dom";
import productsData from "../data/produkData.json";

export default function ProductDetail() {
  const { id } = useParams();

  const product = productsData.find(
    (p) => p.id === Number(id)
  );

  if (!product) {
    return (
      <div className="p-6 text-red-600">
        Produk tidak ditemukan
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto mt-6">

      <img
        src={`https://picsum.photos/seed/${product.id}/400/300`}
        alt={product.title}
        className="rounded-xl mb-4 w-full h-48 object-cover"
      />

      <h2 className="text-2xl font-bold mb-2">
        {product.title}
      </h2>

      <p>Kode: {product.code}</p>
      <p>Kategori: {product.category}</p>
      <p>Brand: {product.brand}</p>

      <p className="text-lg font-semibold mt-2">
        Rp {product.price.toLocaleString("id-ID")}
      </p>

      <Link
        to="/products"
        className="inline-block mt-4 text-green-600"
      >
        ← Back
      </Link>

    </div>
  );
}