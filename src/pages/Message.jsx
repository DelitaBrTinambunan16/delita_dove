import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaStar, FaCheckCircle, FaExclamationTriangle, FaReply } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import customersData from "../data/customers";

export default function Message() {
  const [searchTerm, setSearchTerm] = useState("");
  const [complaintFilter, setComplaintFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [draftReply, setDraftReply] = useState("");
  const [replies, setReplies] = useState(() => {
    const initial = {};
    customersData.forEach((customer) => {
      initial[customer.customerId] = customer.adminNotes || "";
    });
    return initial;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, complaintFilter]);

  const filteredData = useMemo(() => {
    let localComplaints = {};
    try {
      localComplaints = JSON.parse(localStorage.getItem("guestComplaints") || "{}");
    } catch (e) {
      console.error(e);
    }

    const mergedData = customersData.map(customer => {
      const extraComplaints = localComplaints[customer.email] || [];
      return {
        ...customer,
        complaints: [...(customer.complaints || []), ...extraComplaints]
      };
    });

    // Tambahkan user baru (akun baru) yang mengirim komplain tapi belum ada di customersData
    const existingEmails = new Set(customersData.map(c => c.email));
    for (const email in localComplaints) {
      if (!existingEmails.has(email)) {
        mergedData.push({
          customerId: "NEW-" + email.substring(0, 4).toUpperCase() + Math.floor(Math.random() * 100),
          customerName: email.split("@")[0],
          email: email,
          phone: "Belum diisi",
          loyalty: "Bronze",
          status: "Active",
          complaints: localComplaints[email],
          adminNotes: ""
        });
      }
    }

    return mergedData.filter((customer) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        customer.customerName.toLowerCase().includes(query) ||
        customer.customerId.toLowerCase().includes(query) ||
        (customer.phone && customer.phone.includes(searchTerm));

      const hasComplaints = customer.complaints && customer.complaints.length > 0;
      if (complaintFilter === "Ada") return matchesSearch && hasComplaints;
      if (complaintFilter === "Tidak Ada") return matchesSearch && !hasComplaints;
      return matchesSearch;
    });
  }, [searchTerm, complaintFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / 10));
  const currentMessages = filteredData.slice((currentPage - 1) * 10, currentPage * 10);

  const handleReply = (customer) => {
    setActiveReplyId(customer.customerId);
    setDraftReply(replies[customer.customerId] || "");
  };

  const handleSendReply = () => {
    if (!activeReplyId) return;
    setReplies((prev) => ({ ...prev, [activeReplyId]: draftReply.trim() }));
    setActiveReplyId(null);
    setDraftReply("");
  };

  return (
    <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Inbox Pesan Admin"
        description="Kelola pesan pembeli dan balas komplain langsung dari halaman admin."
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Cari nama, ID, atau No. HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-emerald-100 transition-all text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={complaintFilter}
              onChange={(e) => setComplaintFilter(e.target.value)}
              className="w-full sm:w-auto border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-primary)] bg-gray-50 font-medium text-gray-600"
            >
              <option value="All">Semua Pelanggan</option>
              <option value="Ada">Ada Komplain</option>
              <option value="Tidak Ada">Tidak Ada Komplain</option>
            </select>
            <span className="text-xs text-gray-400 whitespace-nowrap hidden sm:block">
              {filteredData.length} pelanggan
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
              <tr>
                <th className="px-6 py-4 font-semibold">ID Customer</th>
                <th className="px-6 py-4 font-semibold">Nama Lengkap</th>
                <th className="px-6 py-4 font-semibold">No. HP</th>
                <th className="px-6 py-4 font-semibold">Riwayat Komplain</th>
                <th className="px-6 py-4 font-semibold text-center">Rating</th>
                <th className="px-6 py-4 font-semibold">Balas Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {currentMessages.length > 0 ? (
                currentMessages.map((customer) => {
                  const hasComplaints = customer.complaints && customer.complaints.length > 0;
                  return (
                    <tr key={customer.customerId} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5 font-semibold text-gray-500 font-mono text-xs">{customer.customerId}</td>
                      <td className="px-6 py-5 font-bold text-gray-800">{customer.customerName}</td>
                      <td className="px-6 py-5 text-gray-500 font-mono text-[13px]">{customer.phone}</td>
                      <td className="px-6 py-5 max-w-[260px]">
                        {hasComplaints ? (
                          <div className="space-y-1.5">
                            {customer.complaints.map((c, index) => (
                              <div
                                key={index}
                                className={`text-[11px] px-2 py-1 rounded border flex items-start gap-1.5 ${
                                  c.resolved
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-100"
                                    : "bg-amber-50 text-amber-800 border-amber-100"
                                }`}
                              >
                                {c.resolved ? (
                                  <FaCheckCircle className="text-emerald-500 mt-0.5 flex-shrink-0" size={10} />
                                ) : (
                                  <FaExclamationTriangle className="text-amber-500 mt-0.5 flex-shrink-0" size={10} />
                                )}
                                <div>
                                  <span className="font-semibold">[{c.date}]</span> {c.issue}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <FaCheckCircle className="text-emerald-500" size={10} /> Tidak ada komplain
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-bold text-[11px]">
                          <FaStar className="text-amber-500" size={11} />
                          <span>{customer.rating ? customer.rating.toFixed(1) : "0.0"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700">
                        <div className="space-y-2">
                          <p className="truncate text-gray-500">{replies[customer.customerId] || "Belum ada balasan"}</p>
                          <button
                            type="button"
                            onClick={() => handleReply(customer)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-700 transition"
                          >
                            <FaReply size={12} /> Balas
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada pesan atau komplain yang sesuai filter
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredData.length > 0 && (
          <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * 10 + 1} hingga {Math.min(currentPage * 10, filteredData.length)} dari {filteredData.length} pelanggan
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {activeReplyId && (
        <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div>
              <p className="text-sm font-semibold text-slate-900">Balas Pesan</p>
              <p className="text-xs text-slate-500">Customer ID: {activeReplyId}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveReplyId(null);
                setDraftReply("");
              }}
              className="text-sm text-slate-500 hover:text-slate-900"
            >
              Batal
            </button>
          </div>
          <textarea
            value={draftReply}
            onChange={(e) => setDraftReply(e.target.value)}
            placeholder="Tulis balasan admin di sini..."
            className="w-full min-h-[120px] rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-800 outline-none focus:border-slate-400"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSendReply}
              className="rounded-xl bg-[#10B981] px-4 py-2 text-white text-sm font-semibold hover:bg-emerald-600 transition"
            >
              Kirim Balasan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
