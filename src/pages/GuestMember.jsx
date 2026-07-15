import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { getGuestLoggedUserEmail, isGuestLoggedIn } from "../lib/auth";
import { FaUserShield, FaStar, FaRegStar, FaGift, FaExclamationTriangle, FaCheckCircle, FaComments, FaBullhorn, FaEnvelope, FaBoxOpen, FaEdit, FaTimes } from "react-icons/fa";
import customersData from "../data/customers.json";
import { usersAPI } from "../services/usersAPI";
import {
  getGuestOrders,
  getMembershipTier,
  getGuestRatings,
  addGuestRating,
  getAverageRating,
  getJoinedCampaign,
  joinCampaign,
  leaveCampaign,
  getCampaignName,
  availableCampaigns,
  getGiveawayStatus,
  toggleGiveaway,
} from "../lib/guestData";

const campaignNameMap = {
  "1": "Diskon 20% Paket Dekorasi",
  "2": "Bonus Undangan Digital",
  "3": "Free Gift Card",
  "4": "VIP Tamu Eksklusif",
  "5": "Paket Honeymoon Spesial",
  "6": "Cashback 1 Juta",
};

function mapCampaignName(code) {
  if (!code || code === "-") return "-";
  return campaignNameMap[code] || `Promo #${code}`;
}

function getStatusPromo(campaignName, emailSub) {
  if (campaignName === "-") return "Tidak Pernah";
  return emailSub === "Ya" ? "Aktif" : "Kedaluwarsa";
}

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

export default function GuestMember() {
  const [isLogged, setIsLogged] = useState(true);
  const [email, setEmail] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [localComplaints, setLocalComplaints] = useState([]);
  const [guestOrders, setGuestOrders] = useState([]);
  const [memberRatings, setMemberRatings] = useState([]);
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingComment, setRatingComment] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [memberObj, setMemberObj] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", phone: "", city: "" });
  const [editSaving, setEditSaving] = useState(false);

  const loadMemberData = (loggedEmail) => {
    // Ambil data detail profil dari localStorage (Supabase)
    const storedMember = localStorage.getItem("member");
    let mObj = null;
    if (storedMember) {
      try {
        mObj = JSON.parse(storedMember);
      } catch (e) {
        console.error(e);
      }
    }
    setMemberObj(mObj);

    const found = customersData.find((c) => c.email === loggedEmail) || {
      customerName: mObj?.name || loggedEmail.split("@")[0] || "Member",
      loyalty: mObj?.loyalty || "Bronze",
      campaignDiikuti: "-",
      complaints: [],
      adminNotes: "",
    };

    // Hitung membership tier dari jumlah pesanan (bukan selalu Bronze)
    const orders = getGuestOrders(loggedEmail);
    const computedTier = getMembershipTier(loggedEmail);

    // Campaign & giveaway dari guestData (localStorage)
    const joinedCampaign = getJoinedCampaign(loggedEmail);
    const campaignDiikuti = joinedCampaign || found.campaignDiikuti || "-";
    const giveaway = getGiveawayStatus(loggedEmail);
    const emailSub = found.emailSub || (mObj?.email_subscription ? "Ya" : "Tidak");
    const statusPromo = getStatusPromo(campaignDiikuti, emailSub);

    // Rating dari guestData (rata-rata yang diberikan member)
    const avgRating = getAverageRating(loggedEmail);
    const ratings = getGuestRatings(loggedEmail);

    const mergedData = {
      ...found,
      name: mObj?.name || found.customerName || loggedEmail.split("@")[0],
      email: mObj?.email || loggedEmail,
      phone: mObj?.phone || found.phone || "-",
      city: mObj?.city || found.city || "-",
      loyalty: computedTier, // gunakan tier yang dihitung dari jumlah pesanan
      promo_code: mObj?.promo_code || found.promo_code || "-",
      rating: avgRating ?? found.rating ?? "-",
      status: found.status || "Active",
      campaignDiikuti,
      giveaway,
      emailSub,
      statusPromo,
      orders,
      orderCount: orders.length,
    };

    setMemberData(mergedData);
    setGuestOrders(orders);
    setMemberRatings(ratings);
    setSelectedCampaign("");
    setRatingComment("");
    setRatingStars(5);

    // Update Supabase jika tier berubah dari yang tersimpan
    if (mObj?.id && mObj.loyalty !== computedTier) {
      usersAPI
        .updateUser(mObj.id, { loyalty: computedTier })
        .then((updated) => {
          if (updated) {
            const newMember = { ...mObj, loyalty: computedTier };
            localStorage.setItem("member", JSON.stringify(newMember));
            setMemberObj(newMember);
          }
        })
        .catch((err) => console.error("Gagal update tier ke Supabase:", err));
    }

    // Load complaints from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem("guestComplaints") || "{}");
      if (stored[loggedEmail]) {
        setLocalComplaints(stored[loggedEmail]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!isGuestLoggedIn()) {
      setIsLogged(false);
      return;
    }
    const loggedEmail = getGuestLoggedUserEmail() || "";
    setEmail(loggedEmail);
    loadMemberData(loggedEmail);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLogged) {
    return <Navigate to="/member/login" replace />;
  }

  if (!memberData) return null;

  const name = memberData.name || memberData.customerName;
  const allComplaints = [...(memberData.complaints || []), ...localComplaints];

  const refresh = () => loadMemberData(email);

  // Handler: bergabung campaign
  const handleJoinCampaign = (e) => {
    e.preventDefault();
    if (!selectedCampaign) {
      alert("Pilih campaign terlebih dahulu.");
      return;
    }
    joinCampaign(email, selectedCampaign);
    // Update Supabase kalau ada id (gunakan campaignDiikuti sebagai nama kolom)
    if (memberObj?.id) {
      usersAPI.updateUser(memberObj.id, { campaignDiikuti: selectedCampaign }).catch(() => {});
    }
    refresh();
  };

  const handleLeaveCampaign = () => {
    leaveCampaign(email);
    refresh();
  };

  // Handler: toggle giveaway
  const handleToggleGiveaway = () => {
    toggleGiveaway(email);
    refresh();
  };

  // Handler: beri rating
  const handleGiveRating = (e) => {
    e.preventDefault();
    if (!ratingStars || ratingStars < 1) {
      alert("Pilih jumlah bintang.");
      return;
    }
    addGuestRating(email, { stars: ratingStars, comment: ratingComment });
    refresh();
  };

  const handleKirimKomplain = (e) => {
    e.preventDefault();
    const input = e.target.elements.message.value;
    if (!input.trim()) return;

    const newComplaint = { issue: input, date: new Date().toISOString().split("T")[0], resolved: false };

    // Save to local storage
    try {
      const stored = JSON.parse(localStorage.getItem("guestComplaints") || "{}");
      if (!stored[email]) stored[email] = [];
      stored[email].push(newComplaint);
      localStorage.setItem("guestComplaints", JSON.stringify(stored));
    } catch (err) {
      console.error(err);
    }

    setLocalComplaints([...localComplaints, newComplaint]);
    e.target.reset();
  };

  // Handler: edit profil member
  const handleOpenEdit = () => {
    setEditForm({
      name: memberData.name || "",
      phone: memberData.phone !== "-" ? memberData.phone || "" : "",
      city: memberData.city !== "-" ? memberData.city || "" : "",
    });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setEditSaving(true);

    const updatedData = {
      name: editForm.name,
      phone: editForm.phone,
      city: editForm.city,
    };

    // Update Supabase kalau ada id
    if (memberObj?.id) {
      try {
        const updated = await usersAPI.updateUser(memberObj.id, updatedData);
        if (updated) {
          const newMember = { ...memberObj, ...updatedData };
          localStorage.setItem("member", JSON.stringify(newMember));
          setMemberObj(newMember);
        }
      } catch (err) {
        console.error("Gagal update profil ke Supabase:", err);
      }
    }

    setEditSaving(false);
    setShowEditProfile(false);
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#F9F7F5] font-poppins text-slate-800 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Profile Card */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-slate-200 flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-4xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
            <p className="text-slate-500 mt-1">{email}</p>
            <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
              {memberData.status && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${memberData.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                  {memberData.status === "Active" ? "Aktif" : "Tidak Aktif"}
                </span>
              )}
              {memberData.rating && memberData.rating !== "-" && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-600">
                  <FaStar size={9} className="text-amber-400" /> {memberData.rating}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center bg-amber-50 rounded-2xl px-6 py-4 border border-amber-100">
            <FaUserShield className="text-amber-500 text-3xl mb-2" />
            <span className="text-amber-700 font-bold uppercase tracking-wider text-xs">{memberData.loyalty} Member</span>
            <span className="text-[10px] text-amber-500 mt-1">{memberData.orderCount || 0} pesanan</span>
          </div>
        </div>

        {/* Edit Profile Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleOpenEdit}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            <FaEdit size={11} /> Edit Profil
          </button>
        </div>

        {/* Detail Data Member (Matching Admin Columns) */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600 inline-flex">
              <FaUserShield size={18} />
            </span>
            Detail Data Member Anda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nama Lengkap</p>
              <p className="mt-1 font-semibold text-slate-800">{memberData.name}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</p>
              <p className="mt-1 font-semibold text-slate-800">{memberData.email}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No. HP / Telepon</p>
              <p className="mt-1 font-semibold text-slate-800">{memberData.phone || "-"}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kota Domisili</p>
              <p className="mt-1 font-semibold text-slate-800">{memberData.city || "-"}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status Membership</p>
              <div className="mt-1">{getMembershipBadge(memberData.loyalty)}</div>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status Akun</p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold ${memberData.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                  {memberData.status === "Active" ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Rating</p>
              <div className="mt-1 flex items-center gap-2">
                {memberData.rating && memberData.rating !== "-" ? (
                  <>
                    <span className="font-semibold text-slate-800">{memberData.rating}</span>
                    <div className="flex gap-0.5">
                      {[1,2,3,4,5].map(s => (
                        <FaStar key={s} size={11} className={s <= Math.round(memberData.rating) ? "text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                  </>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </div>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kode Promo Aktif</p>
              <p className="mt-1">
                {memberData.promo_code && memberData.promo_code !== "-" ? (
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded text-xs font-mono font-bold">
                    {memberData.promo_code}
                  </span>
                ) : (
                  <span className="text-gray-400">—</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Marketing & Engagement - menyamai kolom admin CustomerDetail */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-sky-100 p-2.5 rounded-xl text-sky-600 inline-flex">
              <FaBullhorn size={18} />
            </span>
            Marketing & Engagement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Campaign Diikuti</p>
              <p className="mt-1 font-semibold text-slate-800">{mapCampaignName(memberData.campaignDiikuti)}</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status Promo</p>
              <div className="mt-1">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${memberData.statusPromo === "Aktif" ? "bg-emerald-100 text-emerald-700" : memberData.statusPromo === "Kedaluwarsa" ? "bg-rose-100 text-rose-700" : "bg-gray-100 text-gray-500"}`}>
                  {memberData.statusPromo}
                </span>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Giveaway</p>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${memberData.giveaway === "Ya" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-gray-500"}`}>
                  {memberData.giveaway === "Ya" ? (<><FaGift size={10} /> Ya</>) : "Tidak"}
                </span>
              </div>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email Subscription</p>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold ${memberData.emailSub === "Ya" ? "bg-sky-100 text-sky-700" : "bg-gray-100 text-gray-500"}`}>
                  {memberData.emailSub === "Ya" ? (<><FaEnvelope size={10} /> {memberData.email}</>) : "Belum terdaftar"}
                </span>
              </div>
            </div>
          </div>

          {/* Aksi: kelola campaign & giveaway */}
          <div className="mt-6 rounded-2xl bg-slate-50 p-5 space-y-4">
            <p className="text-sm font-bold text-slate-700">Kelola Campaign & Giveaway</p>

            {/* Campaign join / leave */}
            <div>
              {memberData.campaignDiikuti && memberData.campaignDiikuti !== "-" ? (
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-600">Anda tergabung di: <span className="font-bold text-emerald-700">{getCampaignName(memberData.campaignDiikuti)}</span></p>
                  <button onClick={handleLeaveCampaign} className="text-xs bg-rose-100 text-rose-600 px-3 py-1.5 rounded-lg font-semibold hover:bg-rose-200 transition">Keluar</button>
                </div>
              ) : (
                <form onSubmit={handleJoinCampaign} className="flex flex-col sm:flex-row gap-2">
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="">Pilih campaign...</option>
                    {availableCampaigns.map((c) => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  <button type="submit" className="rounded-xl bg-emerald-600 text-white px-4 py-2 text-xs font-semibold hover:bg-emerald-700 transition whitespace-nowrap">Gabung Campaign</button>
                </form>
              )}
            </div>

            {/* Giveaway toggle */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
              <div>
                <p className="text-xs font-bold text-slate-700">Partisipasi Giveaway</p>
                <p className="text-[11px] text-slate-500">{memberData.giveaway === "Ya" ? "Anda terdaftar untuk giveaway." : "Belum mengikuti giveaway."}</p>
              </div>
              <button
                onClick={handleToggleGiveaway}
                className={`text-xs px-4 py-2 rounded-lg font-semibold transition ${memberData.giveaway === "Ya" ? "bg-rose-100 text-rose-600 hover:bg-rose-200" : "bg-amber-500 text-white hover:bg-amber-600"}`}
              >
                {memberData.giveaway === "Ya" ? "Berhenti" : "Ikuti Giveaway"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Promo Tersedia */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600">
                <FaGift size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Promo Aktif</h2>
            </div>
            <ul className="space-y-4">
              {memberData.campaignDiikuti !== "-" ? (
                <li className="p-4 rounded-2xl border border-emerald-100 bg-emerald-50/50 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-emerald-900 text-sm">Promo Terdaftar</p>
                    <p className="text-xs text-emerald-700">Kode Campaign: {
                      {
                        "1": "Diskon 20% Paket Dekorasi",
                        "2": "Bonus Undangan Digital",
                        "3": "Free Gift Card",
                        "4": "VIP Tamu Eksklusif",
                        "5": "Paket Honeymoon Spesial",
                        "6": "Cashback 1 Juta",
                      }[memberData.campaignDiikuti] || memberData.campaignDiikuti
                    }</p>
                  </div>
                  <Link to="/#paket" className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-700 transition">Gunakan</Link>
                </li>
              ) : (
                <li className="p-4 rounded-2xl border border-slate-100 bg-slate-50 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-700 text-sm">Tidak Ada Promo</p>
                    <p className="text-xs text-slate-500">Anda belum mengikuti campaign apapun.</p>
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Komplain & Pesan Admin */}
          <div className="bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-rose-100 p-3 rounded-xl text-rose-600">
                <FaComments size={20} />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Komplain & Pesan Admin</h2>
            </div>
            <div className="space-y-5">
              {memberData.adminNotes ? (
                <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100">
                  <p className="text-xs font-bold text-sky-800 mb-1">Pesan dari Admin:</p>
                  <p className="text-sm text-sky-700">{memberData.adminNotes}</p>
                </div>
              ) : null}

              <div>
                <p className="text-sm font-bold text-slate-700 mb-3">Riwayat Komplain & Pesan Anda:</p>
                {allComplaints.length > 0 ? (
                  <ul className="space-y-3">
                    {allComplaints.map((c, i) => (
                      <li key={i} className="flex gap-2 items-start text-sm">
                        {c.resolved ? (
                          <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                        ) : (
                          <FaExclamationTriangle className="text-amber-500 mt-1 flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-slate-800">{c.issue}</p>
                          <p className="text-xs text-slate-500">{c.date} - {c.resolved ? "Selesai" : "Menunggu"}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">Tidak ada riwayat komplain.</p>
                )}
              </div>

              {/* Form Tambah Komplain (Mockup) */}
              <div className="mt-6 border-t border-slate-100 pt-5">
                <p className="text-sm font-bold text-slate-700 mb-3">Kirim Pesan/Komplain Baru</p>
                <form 
                  onSubmit={handleKirimKomplain}
                  className="flex flex-col gap-3"
                >
                  <textarea 
                    name="message"
                    required
                    placeholder="Tulis keluhan atau pertanyaan Anda..." 
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 min-h-[80px]"
                  ></textarea>
                  <button type="submit" className="self-end rounded-full bg-slate-900 px-5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition">Kirim ke Admin</button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* RIWAYAT PESANAN MEMBER */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-emerald-100 p-2.5 rounded-xl text-emerald-600 inline-flex">
              <FaBoxOpen size={18} />
            </span>
            Riwayat Pesanan ({guestOrders.length})
          </h2>
          {guestOrders.length > 0 ? (
            <div className="space-y-3">
              {guestOrders.map((o) => (
                <div key={o.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">Paket {o.paket} — {o.venue}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Tanggal acara: {o.orderDate || "-"} {o.guestCount ? `· ${o.guestCount} tamu` : ""}</p>
                    {o.notes && <p className="text-xs text-slate-400 mt-1">{o.notes}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-600">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(o.price || 0)}</span>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${o.status === "Completed" ? "bg-green-100 text-green-700" : o.status === "Cancelled" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-700"}`}>{o.status}</span>
                  </div>
                </div>
              ))}
              <p className="text-xs text-slate-400 mt-2">
                Tip: 3+ pesanan = Silver · 6+ pesanan = Gold · 10+ pesanan = Platinum. Pesanan Anda sekarang: <span className="font-bold text-slate-600">{guestOrders.length}</span> → Tier <span className="font-bold text-emerald-600">{memberData.loyalty}</span>
              </p>
            </div>
          ) : (
            <div className="rounded-2xl bg-slate-50 p-6 text-center">
              <FaBoxOpen className="mx-auto text-slate-300 mb-3" size={32} />
              <p className="text-sm text-slate-500">Belum ada pesanan. Pesan paket dari halaman utama untuk mulai mengumpulkan tier membership.</p>
            </div>
          )}
        </div>

        {/* BERI RATING */}
        <div className="bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
            <span className="bg-amber-100 p-2.5 rounded-xl text-amber-600 inline-flex">
              <FaStar size={18} />
            </span>
            Beri Rating Pengalaman Anda
          </h2>

          <form onSubmit={handleGiveRating} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Pilih Bintang</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRatingStars(s)}
                    className="transition hover:scale-110"
                  >
                    {s <= ratingStars ? (
                      <FaStar size={28} className="text-amber-400" />
                    ) : (
                      <FaRegStar size={28} className="text-gray-200" />
                    )}
                  </button>
                ))}
                <span className="ml-3 text-sm font-bold text-slate-700">{ratingStars}.0 / 5.0</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Komentar (opsional)</label>
              <textarea
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={3}
                placeholder="Bagikan pengalaman Anda..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
              ></textarea>
            </div>
            <button type="submit" className="rounded-full bg-amber-500 text-white px-6 py-2.5 text-sm font-semibold hover:bg-amber-600 transition">Kirim Rating</button>
          </form>

          {memberRatings.length > 0 && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="text-sm font-bold text-slate-700 mb-3">Rating yang Anda berikan ({memberRatings.length})</p>
              <ul className="space-y-2">
                {memberRatings.map((r) => (
                  <li key={r.id} className="flex items-start gap-2 text-sm">
                    <div className="flex gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <FaStar key={s} size={11} className={s <= r.stars ? "text-amber-400" : "text-gray-200"} />
                      ))}
                    </div>
                    <div>
                      <p className="text-slate-700">{r.comment || <span className="text-slate-400">Tanpa komentar</span>}</p>
                      <p className="text-xs text-slate-400">{r.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* EDIT PROFILE MODAL */}
        {showEditProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Edit Profil</h2>
                <button
                  onClick={() => setShowEditProfile(false)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <FaTimes size={16} />
                </button>
              </div>
              <form onSubmit={handleSaveProfile} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Nama Anda"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">No. HP / WhatsApp</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="08xx..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Kota Domisili</label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Misal: Bandung"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEditProfile(false)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={editSaving}
                    className="flex-1 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition disabled:opacity-60"
                  >
                    {editSaving ? "Menyimpan..." : "Simpan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
