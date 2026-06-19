import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaTrash, FaCheckCircle } from "react-icons/fa";
import { ImSpinner2 } from "react-icons/im";
import PageHeader from "../components/PageHeader";
import { usersAPI } from "../services/usersAPI";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import AlertBox from "../components/AlertBox";

function getMembershipBadge(loyalty) {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold";
  switch (loyalty) {
    case "Platinum": return <span className={`${base} bg-purple-100 text-purple-700`}>Platinum</span>;
    case "Gold":     return <span className={`${base} bg-amber-100 text-amber-700`}>Gold</span>;
    case "Silver":   return <span className={`${base} bg-slate-100 text-slate-700`}>Silver</span>;
    case "Bronze":   return <span className={`${base} bg-orange-100 text-orange-700`}>Bronze</span>;
    default:         return <span className={`${base} bg-gray-100 text-gray-500`}>{loyalty || "Bronze"}</span>;
  }
}

export default function Member() {
  const [members, setMembers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { loadMembers(); }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await usersAPI.fetchUsers();
      setMembers(data);
    } catch (err) {
      setError("Gagal memuat data member dari Supabase.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus member "${name}"?`)) return;
    try {
      setDeletingId(id);
      await usersAPI.deleteUser(id);
      setMembers(prev => prev.filter(m => m.id !== id));
      setSuccess(`Member "${name}" berhasil dihapus.`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Gagal menghapus member.");
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return members.filter(m =>
      (m.name || "").toLowerCase().includes(q) ||
      (m.email || "").toLowerCase().includes(q)
    );
  }, [searchTerm, members]);

  return (
    <div className="p-8 font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Halaman Member"
        description="Daftar member yang mendaftar langsung lewat aplikasi (Supabase)"
      />

      {error   && <AlertBox type="error"   className="mt-4">{error}</AlertBox>}
      {success && <AlertBox type="success" className="mt-4">{success}</AlertBox>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mt-4 overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center gap-3">
          <div className="relative w-80">
            <input
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari nama atau email..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:border-emerald-500 text-sm"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-300" />
          </div>
          <span className="text-xs text-gray-400">{filtered.length} member</span>
        </div>

        {loading && <LoadingSpinner text="Memuat data member..." />}

        {!loading && !error && filtered.length === 0 && (
          <EmptyState text="Belum ada member yang mendaftar." />
        )}

        {!loading && filtered.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs text-gray-400 uppercase border-b bg-gray-50/50">
                <tr>
                  <th className="p-4 text-left">Nama</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Kota</th>
                  <th className="p-4 text-left">Membership</th>
                  <th className="p-4 text-left">Kode Promo</th>
                  <th className="p-4 text-center">Hapus</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">{m.name}</td>
                    <td className="p-4 text-gray-500 text-xs">{m.email}</td>
                    <td className="p-4 text-gray-500">{m.city || "-"}</td>
                    <td className="p-4">{getMembershipBadge(m.loyalty)}</td>
                    <td className="p-4 text-xs font-mono text-emerald-600">
                      {m.promo_code
                        ? <span className="bg-emerald-50 px-2 py-1 rounded">{m.promo_code}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleDelete(m.id, m.name)}
                        disabled={deletingId === m.id}
                        className="text-red-300 hover:text-red-500 transition disabled:opacity-40"
                      >
                        {deletingId === m.id
                          ? <ImSpinner2 className="animate-spin" />
                          : <FaTrash size={13} />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}