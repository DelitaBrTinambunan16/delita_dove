import { useState, useEffect, useMemo } from "react";
import { FaSearch, FaReply, FaCheck } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import { supabase } from "../lib/supabaseClient";

export default function Message() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  //Inisialisasi state untuk menampung data messages dan loading state
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);

  const [replyModal, setReplyModal] = useState({ open: false, messageId: null });
  const [replyText, setReplyText] = useState("");
  const [replySending, setReplySending] = useState(false);

  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterType]);

  // Fetch messages dari Supabase
  useEffect(() => {
    const fetchMessages = async () => {
      setMessagesLoading(true);
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setMessages(data || []); //Simpan data ke state


      } catch (error) {
        console.error("Gagal memuat messages:", error);
        setMessages([]);
      } finally {
        setMessagesLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const query = searchTerm.toLowerCase();

      const matchesSearch =
        (msg.name && msg.name.toLowerCase().includes(query)) ||
        (msg.phone && msg.phone.toString().includes(searchTerm)) ||
        (msg.email && msg.email.toLowerCase().includes(query)) ||
        (msg.message && msg.message.toLowerCase().includes(query));

      if (filterType === "All") return matchesSearch;
      if (filterType === "Konsultasi") return matchesSearch && msg.message_type === "CONSULTATION";
      if (filterType === "Inquiry") return matchesSearch && msg.message_type === "INQUIRY";
      if (filterType === "Reschedule") return matchesSearch && msg.message_type === "RESCHEDULE";

      return matchesSearch;
    });
  }, [searchTerm, filterType, messages]);

  const totalPages = Math.max(1, Math.ceil(filteredMessages.length / itemsPerPage));
  const currentMessages = filteredMessages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const openReplyModal = (messageId, adminReply = "") => {
    setReplyModal({ open: true, messageId });
    setReplyText(adminReply);
  };

  const handleSendReply = async () => {
    if (!replyModal.messageId || !replyText.trim()) {
      alert("Catatan tidak boleh kosong");
      return;
    }

    setReplySending(true);
    try {
      const { error } = await supabase
        .from("messages")
        .update({
          admin_reply: replyText.trim(),
          admin_reply_date: new Date().toISOString()
        })
        .eq("id", replyModal.messageId);

      if (error) throw error;

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === replyModal.messageId
            ? {
                ...msg,
                admin_reply: replyText.trim(),
                admin_reply_date: new Date().toISOString()
              }
            : msg
        )
      );

      setReplyModal({ open: false, messageId: null });
      setReplyText("");
      alert("Balasan berhasil dikirim ke pelanggan!");
    } catch (error) {
      console.error("Gagal mengirim balasan:", error);
      alert("Gagal mengirim balasan");
    } finally {
      setReplySending(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "-";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
  };

  return (
    <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
      <PageHeader
        title="Inbox Pesan"
        description="Kelola semua pesan dan inquiry dari calon pelanggan."
      />

      <section className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
        <div className="mb-4">
          <p className="text-sm font-bold text-slate-900">📝 Lead Inquiry dari Landing Page</p>
          <p className="text-xs text-slate-500 mt-1">Pesan langsung dari calon pelanggan melalui form kontak.</p>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {messagesLoading ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-400">Memuat pesan...</div>
          ) : messages.length > 0 ? (
            messages.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{item.name || "Guest"}</p>
                    <p className="text-xs text-slate-500">{item.email} • {item.phone}</p>
                  </div>
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600">
                    {item.message_type || "INQUIRY"}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.message}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-slate-500">
                  {item.event_date && <span className="rounded-full bg-white px-2 py-1">Tanggal: {item.event_date}</span>}
                  {item.location && <span className="rounded-full bg-white px-2 py-1">Lokasi: {item.location}</span>}
                  {item.guest_count && <span className="rounded-full bg-white px-2 py-1">{item.guest_count} tamu</span>}
                  {item.promo_code && <span className="rounded-full bg-white px-2 py-1">Promo: {item.promo_code}</span>}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-400">
              Belum ada inquiry dari calon pelanggan.
            </div>
          )}
        </div>
      </section>

      <div className="mt-6 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-50">
          <p className="text-sm font-bold text-slate-900">💬 Daftar Semua Pesan</p>
          <p className="text-xs text-slate-500 mt-1">Kelola semua inquiry dan tambahkan catatan untuk follow-up.</p>
        </div>

        <div className="p-4 border-b border-gray-50 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Cari nama, email, atau nomor HP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 outline-none focus:border-emerald-500 transition-all text-sm"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
          </div>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 bg-gray-50 font-medium text-gray-600 whitespace-nowrap"
          >
            <option value="All">Semua Tipe</option>
            <option value="Konsultasi">Konsultasi</option>
            <option value="Inquiry">Inquiry</option>
            <option value="Reschedule">Reschedule</option>
          </select>

          <span className="text-xs text-gray-400 font-medium self-center">{filteredMessages.length} pesan</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/50">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">name</th>
                <th className="px-4 py-4 text-left font-semibold">phone</th>
                <th className="px-4 py-4 text-left font-semibold">email</th>
                <th className="px-4 py-4 text-left font-semibold">event_date</th>
                <th className="px-4 py-4 text-left font-semibold">location</th>
                <th className="px-4 py-4 text-left font-semibold">guest_count</th>
                <th className="px-4 py-4 text-left font-semibold">message</th>
                <th className="px-4 py-4 text-left font-semibold">status</th>
                <th className="px-4 py-4 text-left font-semibold">admin_reply</th>
                <th className="px-4 py-4 text-left font-semibold">admin_reply_date</th>
                <th className="px-4 py-4 text-left font-semibold">created_at</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {messagesLoading ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-sm">Memuat pesan...</td>
                </tr>
              ) : currentMessages.length > 0 ? (
                currentMessages.map((msg) => (
                  <tr key={msg.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-gray-800 font-medium text-sm">{msg.name || "-"}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{msg.phone || "-"}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{msg.email || "-"}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{msg.event_date || "-"}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{msg.location || "-"}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm">{msg.guest_count ?? 0}</td>
                    <td className="px-4 py-4 text-gray-600 text-sm truncate max-w-[220px]" title={msg.message}>{msg.message || "-"}</td>
                    <td className="px-4 py-4 text-sm">{msg.status || "Pending"}</td>

                    <td className="px-4 py-4 text-sm">
                      <div className="space-y-2">
                        {msg.admin_reply ? (
                          <div>
                            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-xs">
                              <FaCheck size={10} className="text-emerald-600" />
                              <span className="font-medium">Sudah dibalas</span>
                            </div>
                            <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">{msg.admin_reply}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Belum ada balasan</span>
                        )}

                        <button
                          type="button"
                          onClick={() => openReplyModal(msg.id, msg.admin_reply || "")}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition"
                        >
                          <FaReply size={11} /> {msg.admin_reply ? "Edit Balasan" : "Balas Pesan"}
                        </button>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm">{formatDateTime(msg.admin_reply_date)}</td>
                    <td className="px-4 py-4 text-sm">{formatDateTime(msg.created_at)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-gray-400 text-sm">Tidak ada pesan yang sesuai filter</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredMessages.length > 0 && (
          <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
            <span className="text-sm text-gray-500">
              Menampilkan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredMessages.length)} dari {filteredMessages.length} pesan
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Reply Modal */}
      {replyModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-gray-100 bg-white p-6 shadow-[0_25px_80px_rgba(15,23,42,0.16)]">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Balas Pesan Pelanggan</h2>
                <p className="mt-1 text-sm text-slate-500">Tulis balasan untuk dikirim ke pelanggan melalui email.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setReplyModal({ open: false, messageId: null });
                  setReplyText("");
                }}
                className="text-sm font-semibold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Tulis balasan Anda di sini..."
              className="w-full min-h-[160px] rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
            />

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setReplyModal({ open: false, messageId: null });
                  setReplyText("");
                }}
                className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSendReply}
                disabled={replySending || !replyText.trim()}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {replySending ? "Mengirim..." : "Kirim Balasan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

