export default function ProductForm({ show, onClose, form, setForm, onSubmit }) {
  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <form onSubmit={onSubmit} className="bg-white p-6 mt-5 rounded-2xl space-y-4">
      <input 
        type="text"
        name="title"
        placeholder="Product Title"
        value={form.title}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input 
        type="text"
        name="code"
        placeholder="Product Code"
        value={form.code}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input 
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input 
        type="text"
        name="brand"
        placeholder="Brand"
        value={form.brand}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input 
        type="number"
        name="price"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input 
        type="number"
        name="stock"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
        className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-2">
        <button 
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Save Product
        </button>
        <button 
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
