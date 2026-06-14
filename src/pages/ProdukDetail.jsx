import { useParams, Link } from "react-router-dom";
import productsData from "../data/produkData.json";

export default function ProductDetail() {
    const { id } = useParams();

    // cari produk dari data lokal
    const product = productsData.find(
        (p) => p.id === Number(id)
    );

    // kalau tidak ketemu
    if (!product) {
        return (
            <div className="p-6 text-red-600">
                Produk tidak ditemukan
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-xl shadow-lg max-w-xl mx-auto mt-6">

            {/* IMAGE (dibuat dummy karena data kamu belum punya gambar) */}
            <img
                src={`https://picsum.photos/seed/${product.id}/500/300`}
                alt={product.title}
                className="rounded-xl mb-4 w-full h-52 object-cover"
            />

            {/* TITLE */}
            <h2 className="text-2xl font-bold mb-2">
                {product.title}
            </h2>

            {/* DETAIL */}
            <div className="space-y-2 text-gray-700">

                <p>
                    <span className="font-semibold">Kode:</span> {product.code}
                </p>

                <p>
                    <span className="font-semibold">Kategori:</span> {product.category}
                </p>

                <p>
                    <span className="font-semibold">Brand:</span> {product.brand}
                </p>

                <p className="text-lg font-bold text-gray-900">
                    Rp {product.price.toLocaleString("id-ID")}
                </p>

                <p>
                    <span className="font-semibold">Stock:</span> {product.stock} pcs
                </p>
            </div>

            {/* BACK BUTTON */}
            <Link
                to="/admin/products"
                className="inline-block mt-6 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
                ← Back to Products
            </Link>

        </div>
    );
}