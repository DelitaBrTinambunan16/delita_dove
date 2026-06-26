import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCommentDots, FaGift, FaStar, FaTicketAlt, FaExclamationTriangle, FaCheckCircle, FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaTiktok, FaCheck, FaCrown, FaMapMarkerAlt } from "react-icons/fa";
import { promoOffers } from "../data/promoOffers";
import { getGuestLoggedUserEmail, isGuestLoggedIn } from "../lib/auth";
import { usersAPI } from "../services/usersAPI";
import customersData from "../data/customers.json";
import { supabase } from "../lib/supabaseClient";
import productsData from "../data/produkData.json";
import GuestOrderForm from "../components/GuestOrderForm";

const getProductRating = (id) => Number((4.3 + (id % 7) * 0.1).toFixed(1));

const weddingPackages = [
  {
    name: "Premium",
    venue: "Garden Paradise",
    price: 4000000,
    rating: 4.9,
    tagline: "Pengalaman wedding mewah dan lengkap",
    features: ["Dekorasi outdoor eksklusif", "Catering premium 300 pax", "Foto & video cinematic", "MUA & bridal full day", "MC profesional"],
    badge: "Best Seller",
    accent: "from-emerald-500 to-emerald-600",
    ring: "ring-emerald-200",
  },
  {
    name: "Deluxe",
    venue: "Grand Ballroom",
    price: 2500000,
    rating: 4.7,
    tagline: "Paket elegan untuk acara berkelas",
    features: ["Ballroom indoor mewah", "Catering 200 pax", "Dokumentasi profesional", "Lighting & stage premium", "Koordinator acara"],
    badge: "Populer",
    accent: "from-sky-500 to-sky-600",
    ring: "ring-sky-200",
  },
  {
    name: "Standard",
    venue: "Cozy Intimate",
    price: 1000000,
    rating: 4.5,
    tagline: "Hemat tapi tetap berkesan",
    features: ["Venue intimate nyaman", "Catering 100 pax", "Foto dokumentasi", "Dekorasi standar elegan"],
    badge: "Hemat",
    accent: "from-amber-500 to-amber-600",
    ring: "ring-amber-200",
  },
];

const membershipTiers = [
  {
    tier: "Bronze",
    color: "orange",
    badge: "bg-orange-100 text-orange-700",
    icon: "bg-orange-50 text-orange-600",
    benefits: ["Akses promo dasar", "Riwayat pesanan", "Konsultasi via WhatsApp"],
  },
  {
    tier: "Silver",
    color: "slate",
    badge: "bg-slate-100 text-slate-700",
    icon: "bg-slate-50 text-slate-600",
    benefits: ["Semua benefit Bronze", "Diskon 5% setiap paket", "Priority booking"],
  },
  {
    tier: "Gold",
    color: "amber",
    badge: "bg-amber-100 text-amber-700",
    icon: "bg-amber-50 text-amber-600",
    benefits: ["Semua benefit Silver", "Diskon 10% setiap paket", "Free konsultasi planner", "Akses promo eksklusif"],
  },
  {
    tier: "Platinum",
    color: "purple",
    badge: "bg-purple-100 text-purple-700",
    icon: "bg-purple-50 text-purple-600",
    benefits: ["Semua benefit Gold", "Diskon 15% setiap paket", "Free upgrade venue", "Personal wedding advisor", "Akses giveaway prioritas"],
  },
];

const guestNeeds = [
  {
    title: "Cek Promo & Diskon",
    description: "Lihat kode promo, periode berlaku, dan syarat pemakaian sebelum checkout.",
    icon: FaGift,
  },
  {
    title: "Pilih Paket Tema",
    description: "Pilih paket dekorasi, catering, dan foto yang sesuai dengan konsep weddingmu.",
    icon: FaStar,
  },
  {
    title: "Siapkan Detail Acara",
    description: "Masukkan tanggal, lokasi, dan jumlah tamu agar penawaran lebih tepat.",
    icon: FaCalendarAlt,
  },
  {
    title: "Kontak Admin Mudah",
    description: "Hubungi admin untuk mendapatkan rekomendasi paket dan detail booking.",
    icon: FaCommentDots,
  },
];

const memberBenefits = [
  {
    title: "Akses Promo Eksklusif",
    description: "Member dapat melihat daftar promo khusus yang hanya tersedia untuk pembeli terdaftar.",
    icon: FaTicketAlt,
  },
  {
    title: "Pesan Lebih Cepat",
    description: "Pesan paket wedding langsung lewat WhatsApp tanpa harus mengisi ulang data setiap kali.",
    icon: FaGift,
  },
  {
    title: "Riwayat Pesanan",
    description: "Simpan riwayat order dan kembali ke paket favorit kapan saja.",
    icon: FaStar,
  },
];

export default function Guest() {
  const [guestLoggedIn, setGuestLoggedIn] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderPrefillPackage, setOrderPrefillPackage] = useState("Premium");
  const [orderPromoCode, setOrderPromoCode] = useState("");
  const [productsPreview, setProductsPreview] = useState([]);

  // Data member dari Supabase
  const [memberData, setMemberData] = useState(null);
  const [localComplaints, setLocalComplaints] = useState([]);

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = isGuestLoggedIn();
      setGuestLoggedIn(loggedIn);
      const email = getGuestLoggedUserEmail() || "";
      setGuestEmail(email);

      // Ambil data member dari localStorage (sudah disimpan waktu login/register)
      const stored = localStorage.getItem("member");
      let currentMember = null;
      if (stored) {
        try {
          currentMember = JSON.parse(stored);
          setMemberData(currentMember);
        } catch (e) {
          console.error(e);
        }
      }

      // Muat riwayat komplain lokal dari browser session
      try {
        const storedComplaints = JSON.parse(localStorage.getItem("guestComplaints") || "{}");
        if (storedComplaints[email]) {
          setLocalComplaints(storedComplaints[email]);
        }
      } catch (e) {
        console.error(e);
      }

      // Ambil data terbaru dari Supabase (sinkronisasi background)
      if (loggedIn && (currentMember?.id || email)) {
        try {
          let freshUser = null;
          if (currentMember?.id) {
            freshUser = await usersAPI.getUserById(currentMember.id);
          } else {
            const allUsers = await usersAPI.fetchUsers();
            freshUser = allUsers.find(u => u.email === email);
          }

          if (freshUser) {
            localStorage.setItem("member", JSON.stringify(freshUser));
            setMemberData(freshUser);
          }
        } catch (err) {
          console.error("Gagal melakukan sinkronisasi data profil member dari Supabase:", err);
        }
      }
    };

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*').limit(8);
        if (error) throw error;
        if (data && data.length > 0) {
          setProductsPreview(data);
        } else {
          // Fallback ke JSON lokal jika kosong
          setProductsPreview(productsData.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductsPreview(productsData.slice(0, 8));
      }
    };

    checkLogin();
    fetchProducts();
  }, []);

  // Bersihkan state ketika member logout
  useEffect(() => {
    const handleGuestLogout = () => {
      setGuestLoggedIn(false);
      setGuestEmail("");
      setMemberData(null);
      setLocalComplaints([]);
      setPromoCode("");
      setPromoMessage("");
    };
    window.addEventListener("guest-logout", handleGuestLogout);
    return () => window.removeEventListener("guest-logout", handleGuestLogout);
  }, []);

  const guestName = memberData?.name || guestEmail.split("@")[0] || "Tamu";

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone || !contactForm.message) {
      alert("Semua field harus diisi");
      return;
    }
    const inquiries = JSON.parse(localStorage.getItem("guestInquiries") || "[]");
    inquiries.push({
      ...contactForm,
      id: Date.now(),
      date: new Date().toLocaleString("id-ID"),
    });
    localStorage.setItem("guestInquiries", JSON.stringify(inquiries));
    setContactSubmitted(true);
    setContactForm({ name: "", email: "", phone: "", message: "" });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  // ✅ Handle promo - simpan ke Supabase kalau login
  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    if (!guestLoggedIn) {
      alert("Silakan login terlebih dahulu untuk menggunakan promo.");
      return;
    }
    if (!promoCode.trim()) {
      setPromoMessage("Masukkan kode promo terlebih dahulu.");
      return;
    }

    const kode = promoCode.trim().toUpperCase();

    try {
      // Simpan kode promo ke Supabase
      if (memberData?.id) {
        await usersAPI.updateUser(memberData.id, { promo_code: kode });
        const updated = { ...memberData, promo_code: kode };
        localStorage.setItem("member", JSON.stringify(updated));
        setMemberData(updated);
      }
      setPromoMessage(`Kode promo ${kode} berhasil diterapkan!`);
      setPromoCode("");
    } catch (err) {
      setPromoMessage(`Kode promo ${kode} berhasil diterapkan.`);
      setPromoCode("");
    }
  };

  // ✅ Email subscription - tampil email otomatis dari akun login, bukan input manual
  const subscriptionEmail = memberData?.email_subscription || memberData?.email || guestEmail;

  const getProductImage = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("decoration")) return "https://images.unsplash.com/photo-1464366403482-3a04ca6d3979?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("attire") || cat.includes("gown") || cat.includes("jas")) return "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("catering")) return "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("photography")) return "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("invitation")) return "https://images.unsplash.com/photo-1606810558060-5b53b1c3a5b8?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("souvenir")) return "https://images.unsplash.com/photo-1516225442-6dca7ab9ad0a?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("beauty") || cat.includes("mua")) return "https://images.unsplash.com/photo-1457972729786-0411a3b2b5a7?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("venue")) return "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("service")) return "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("jewelry")) return "https://images.unsplash.com/photo-1513185158878-8d8c7a2a3a82?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("entertainment")) return "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("transport")) return "https://images.unsplash.com/photo-1485463611174-fb2ee4b9603e?auto=format&fit=crop&w=900&q=80";
    return "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80";
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-poppins selection:bg-emerald-200">
      <section id="home" className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-[#FDFCFB] to-sky-50 pt-10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-overlay" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob" />
        <div className="absolute top-24 -right-24 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-24 left-48 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-6 relative z-10">
            <span className="inline-flex rounded-full bg-white/90 px-5 py-2.5 text-xs uppercase tracking-[.24em] text-emerald-700 shadow-sm shadow-emerald-100 ring-1 ring-emerald-100 backdrop-blur-md">SayYes Wedding Guest</span>
            <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-6xl drop-shadow-sm leading-tight">Temukan paket <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-sky-600">wedding terbaik</span> untuk tamu dan pasangan.</h1>
            <p className="max-w-xl text-lg leading-8 text-slate-600 drop-shadow-sm">Lihat semua promo di bagian "Promo" — setiap penawaran menampilkan kode, masa berlaku, dan syarat pemakaian. Untuk menggunakan promo saat pemesanan, daftar sebagai Member atau langsung hubungi admin lewat tombol pada produk.</p>
            {guestLoggedIn && (
              <div className="rounded-3xl bg-emerald-50/80 backdrop-blur-md px-6 py-5 text-sm text-emerald-900 shadow-sm ring-1 ring-emerald-200/50">
                Selamat datang kembali, <span className="font-bold">{guestName}</span>! Pesan paket lebih cepat dengan akun pembeli kamu.
              </div>
            )}
            <div className="flex flex-col gap-4 sm:flex-row pt-4">
              {guestLoggedIn ? (
                <a href="#produk" className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-200/50 transition-all hover:scale-105 hover:shadow-emerald-300/50">Lihat Produk</a>
              ) : (
                <button onClick={() => setShowContact(true)} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-200/50 transition-all hover:scale-105 hover:shadow-emerald-300/50">Hubungi Kami</button>
              )}
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-emerald-900/10 ring-1 ring-slate-200/50 rotate-2 hover:rotate-0 transition-transform duration-500 z-10 group">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80"
              alt="Pasangan pengantin"
              className="h-[480px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent px-8 py-8 text-white">
              <p className="text-xs uppercase tracking-[.24em] text-white/80 font-semibold mb-2">Wedding Style</p>
              <p className="text-xl font-bold leading-snug drop-shadow-md">Foto dan tema produk disesuaikan agar terasa elegan dan modern.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-12">

        {/*SECTION KOMPLAIN - tampil kalau sudah login */}
        {guestLoggedIn && memberData && (
          <section className="mb-8 rounded-[2rem] border border-slate-200 p-6 shadow-sm bg-white">
            <div className="flex items-center gap-2 mb-4">
              <FaExclamationTriangle className="text-amber-500" size={16} />
              <h2 className="text-base font-bold text-slate-900">Riwayat Komplain Saya</h2>
            </div>

            {(() => {
              const mockMember = customersData.find((c) => c.email === guestEmail) || {};
              const allComplaints = [...(mockMember.complaints || []), ...localComplaints];

              if (allComplaints.length === 0) {
                return (
                  <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl px-5 py-4">
                    <FaCheckCircle className="text-emerald-500 flex-shrink-0" size={18} />
                    <p className="text-sm text-emerald-700 font-medium">
                      Tidak ada komplain. Terima kasih sudah mempercayai WeddingDay!
                    </p>
                  </div>
                );
              }

              return (
                <ul className="space-y-3">
                  {allComplaints.map((c, i) => (
                    <li key={i} className="flex gap-2 items-start text-sm border-b border-slate-50 pb-2 last:border-0">
                      {c.resolved ? (
                        <FaCheckCircle className="text-emerald-500 mt-1 flex-shrink-0" />
                      ) : (
                        <FaExclamationTriangle className="text-amber-500 mt-1 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-slate-800">{c.issue}</p>
                        <p className="text-xs text-slate-500">{c.date} - {c.resolved ? "Selesai" : "Menunggu Tanggapan"}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              );
            })()}
          </section>
        )}

        <section className="mb-12 rounded-[2rem] bg-gradient-to-r from-emerald-50 to-emerald-100/50 border border-emerald-200 p-8 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-emerald-700 font-semibold">Program Member</p>
              <h2 className="mt-3 text-2xl font-bold text-slate-900">Daftar sebagai Member & Nikmati Keuntungan Eksklusif</h2>
              <p className="mt-4 text-sm text-slate-700">Bergabung sebagai member memberikan akses ke promo khusus, riwayat pesanan, dan proses pemesanan yang lebih cepat. Daftar sekarang melalui menu Login di atas.</p>
            </div>
            <div className="space-y-3">
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-slate-900">Akses Promo Eksklusif</p>
                  <p className="text-xs text-slate-600 mt-1">Lihat semua kode promo, periode berlaku, dan syarat pemakaian</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-slate-900">Pesan Lebih Cepat</p>
                  <p className="text-xs text-slate-600 mt-1">Data tersimpan otomatis untuk pemesanan berikutnya</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-emerald-600 font-bold text-lg flex-shrink-0">✓</span>
                <div>
                  <p className="font-semibold text-slate-900">Riwayat Pesanan</p>
                  <p className="text-xs text-slate-600 mt-1">Akses semua pesanan Anda kapan saja</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="promo" className="rounded-[2.5rem] border border-white bg-white/60 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between relative z-10">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-emerald-600 font-bold">Promo Spesial</p>
              <h2 className="mt-2 text-4xl font-black text-slate-900 drop-shadow-sm">Lihat promo dan syaratnya.</h2>
            </div>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-4 relative z-10">
            {promoOffers.map((promo) => (
              <div key={promo.code} className="group overflow-hidden rounded-[2rem] bg-white shadow-md shadow-slate-200/50 ring-1 ring-slate-100 hover:-translate-y-2 transition-all duration-300">
                <div className="relative h-52 overflow-hidden">
                  <img src={promo.image} alt={promo.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="inline-flex rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-white shadow-lg">{promo.badge}</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <p className="text-[11px] font-bold uppercase tracking-[.24em] text-emerald-600">{promo.code}</p>
                    <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-md">Sampai {promo.validUntil}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{promo.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{promo.description}</p>
                  <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-xs text-slate-500 font-medium">{promo.details}</p>
                  </div>
                  <button
                    onClick={() => {
                      if (!guestLoggedIn) {
                        setShowContact(true);
                        setContactForm({ ...contactForm, message: `Halo SayYes WeddingDay, saya tertarik dengan promo ${promo.title} (Kode: ${promo.code}). Tolong info detailnya.` });
                        return;
                      }
                      setOrderPrefillPackage("Premium");
                      setOrderPromoCode(promo.code);
                      setShowOrderForm(true);
                    }}
                    className={`mt-4 w-full inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition ${guestLoggedIn ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "border border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-700"}`}
                  >
                    {guestLoggedIn ? `Pesan dengan ${promo.code}` : "Login untuk Pesan"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ✅ Form Input Promo - simpan ke Supabase */}
          <div className="mt-8 rounded-2xl bg-emerald-50 p-6 border border-emerald-100 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-emerald-900">Punya Kode Promo?</h3>
              <p className="text-sm text-emerald-700 mt-1">Masukkan kode promo untuk mendapatkan diskon tambahan.</p>
              {/* ✅ Tampilkan promo aktif kalau sudah punya */}
              {memberData?.promo_code && (
                <p className="text-xs text-emerald-600 font-bold mt-2">
                  Promo aktif: <span className="bg-emerald-100 px-2 py-0.5 rounded">{memberData.promo_code}</span>
                </p>
              )}
            </div>
            <form onSubmit={handlePromoSubmit} className="flex w-full md:w-auto gap-3 flex-col sm:flex-row">
              <input
                type="text"
                placeholder={guestLoggedIn ? "Masukkan kode promo..." : "Login untuk input promo..."}
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                disabled={!guestLoggedIn}
                className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-emerald-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-emerald-100 disabled:text-emerald-500"
              />
              <button
                type="submit"
                disabled={!guestLoggedIn}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-xl transition text-sm"
              >
                Terapkan
              </button>
            </form>
          </div>
          {promoMessage && <p className="mt-3 text-sm text-emerald-600 font-semibold">{promoMessage}</p>}
        </section>

        <section className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-slate-500">Kenapa jadi Member?</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Nikmati fitur pembeli yang lebih lengkap.</h2>
              <p className="mt-3 text-sm text-slate-600">Daftar akun pembeli untuk pesan paket, simpan promo, dan dapatkan akses lebih cepat nanti.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[...memberBenefits, ...guestNeeds].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <Icon size={20} />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION PILIHAN MEMBERSHIP */}
        <section id="membership" className="mt-10 rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-slate-500">Pilihan Membership</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">Tingkatkan ke membership kamu.</h2>
              <p className="mt-3 text-sm text-slate-600">Semakin tinggi tier membership, semakin banyak keuntungan yang kamu dapatkan. Kumpulkan poin dari setiap transaksi untuk naik tier.</p>
            </div>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {membershipTiers.map((t, idx) => (
              <div key={t.tier} className={`relative rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${idx === membershipTiers.length - 1 ? "ring-2 ring-purple-200" : ""}`}>
                {idx === membershipTiers.length - 1 && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-purple-600 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow"><FaCrown size={9} /> Unggulan</span>
                )}
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${t.icon}`}>
                  <FaCrown size={20} />
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900">{t.tier}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.badge}`}>Tier {idx + 1}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-slate-600">
                      <FaCheck size={11} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION PILIHAN PAKET */}
        <section id="paket" className="mt-16 rounded-[2.5rem] bg-white/60 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/40 ring-1 ring-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-200/50 pb-6">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-emerald-600 font-bold">Pilihan Paket</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900 drop-shadow-sm">Pilih paket wedding sesuai kebutuhanmu.</h2>
              <p className="mt-3 text-base text-slate-600">Tiga pilihan paket lengkap dengan venue, dekorasi, dan layanan pendukung. Hubungi kami untuk kustomisasi.</p>
            </div>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {weddingPackages.map((pkg) => (
              <div key={pkg.name} className={`group relative overflow-hidden rounded-[2rem] bg-white shadow-md ring-1 ${pkg.ring} transition-all duration-300 hover:-translate-y-2 hover:shadow-xl flex flex-col`}>
                <div className={`bg-gradient-to-r ${pkg.accent} px-6 py-5 text-white`}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Paket {pkg.name}</h3>
                    <span className="rounded-full bg-white/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest">{pkg.badge}</span>
                  </div>
                  <p className="mt-1 text-xs text-white/80 flex items-center gap-1"><FaMapMarkerAlt size={10} /> {pkg.venue}</p>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-2xl font-black text-slate-900">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(pkg.price)}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-500">
                    <FaStar size={11} className="text-amber-400" /> {pkg.rating}
                    <span className="text-slate-400 font-normal">/5.0</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{pkg.tagline}</p>
                  <ul className="mt-4 space-y-2.5 flex-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                        <FaCheck size={12} className="text-emerald-500 mt-0.5 flex-shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="produk" className="mt-16 rounded-[2.5rem] bg-white/60 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/40 ring-1 ring-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-200/50 pb-6">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-emerald-600 font-bold">Produk Rekomendasi</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900 drop-shadow-sm">Paket populer kami.</h2>
              <p className="mt-3 text-base text-slate-600">Interested dengan paket? Hubungi kami untuk inkuiri detail.</p>
            </div>
            <button
              onClick={() => {
                if (guestLoggedIn) {
                  setOrderPrefillPackage("Premium");
                  setOrderPromoCode("");
                  setShowOrderForm(true);
                } else {
                  setShowContact(true);
                }
              }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:scale-105 hover:shadow-emerald-300/50"
            >
              {guestLoggedIn ? "Pesan Sekarang" : "Hubungi Kami"}
            </button>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {productsPreview.map((product) => {
              return (
                <div key={product.code} className="group overflow-hidden rounded-[2rem] bg-white shadow-md ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-100/50 flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={getProductImage(product.category)}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{product.title}</h3>
                    <p className="mt-2 text-2xl font-black text-emerald-600 drop-shadow-sm">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(product.price)}</p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {[1,2,3,4,5].map(s => (
                          <FaStar key={s} size={11} className={s <= Math.round(getProductRating(product.id)) ? "text-amber-400" : "text-gray-200"} />
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-amber-600">{getProductRating(product.id)}</span>
                      <span className="text-xs text-slate-400">({(product.id * 7) + 12} ulasan)</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
                      <span>{product.brand}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>{product.stock} stok</span>
                    </div>
                    <div className="mt-auto pt-6">
                      <button
                        onClick={() => {
                          if (!guestLoggedIn) {
                            setShowContact(true);
                            setContactForm({ ...contactForm, message: `Halo SayYes WeddingDay, saya ingin memesan paket ${product.title} (${product.code}). Tolong info detail dan harga final.` });
                            return;
                          }
                          const pkg = product.price >= 4000000 ? "Premium" : product.price >= 2500000 ? "Deluxe" : "Standard";
                          setOrderPrefillPackage(pkg);
                          setOrderPromoCode("");
                          setShowOrderForm(true);
                        }}
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                          guestLoggedIn
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "border border-emerald-600 bg-white hover:bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        Pesan Sekarang
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        {/* SECTION KONTAK */}
        <section id="kontak" className="mt-16 rounded-[2.5rem] bg-white border border-slate-200 p-8 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          <div className="absolute -bottom-24 left-24 w-96 h-96 bg-sky-50 rounded-full mix-blend-multiply filter blur-3xl opacity-50" />
          
          <div className="text-center max-w-3xl mx-auto mb-10 relative z-10">
            <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-emerald-700">Hubungi Kami</span>
            <h2 className="mt-3 text-3xl font-black text-slate-900 drop-shadow-sm">Mari Wujudkan Pernikahan Impian Anda</h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Tim SayYes WeddingDay selalu siap melayani segala kebutuhan inkuiri, custom paket, maupun pertanyaan seputar event pernikahan Anda. Hubungi kami melalui kontak resmi dan jejaring sosial kami di bawah ini.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 relative z-10">
            {/* Email Contact Card */}
            <a href="mailto:admin@sayyeswedding.com" className="group flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-110">
                <FaEnvelope size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Email Resmi</h3>
              <p className="text-xs text-slate-500 mt-1">Kirimkan penawaran & inkuiri kerjasama</p>
 *             <span className="mt-3 text-sm font-semibold text-emerald-600">admin@sayyeswedding.com</span>
            </a>

            {/* Phone/WhatsApp Card */}
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="group flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-4 transition-transform group-hover:scale-110">
                <FaPhone size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">WhatsApp & Telepon</h3>
              <p className="text-xs text-slate-500 mt-1">Konsultasi cepat via obrolan langsung</p>
              <span className="mt-3 text-sm font-semibold text-emerald-600">+62 823-8739-8764</span>
            </a>

            {/* Instagram Card */}
            <a href="https://instagram.com/sayyeswedding" target="_blank" rel="noreferrer" className="group flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-pink-50 hover:border-pink-300 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 mb-4 transition-transform group-hover:scale-110">
                <FaInstagram size={20} />
              </div>
              <h3 className="text-base font-bold text-slate-900">Instagram</h3>
              <p className="text-xs text-slate-500 mt-1">Lihat portofolio & galeri dekorasi kami</p>
              <span className="mt-3 text-sm font-semibold text-pink-600">@sayyeswedding</span>
            </a>

            {/* TikTok & Facebook Card */}
            <a href="https://tiktok.com/@sayyeswedding" target="_blank" rel="noreferrer" className="group flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 hover:-translate-y-1">
              <div className="h-12 w-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-800 mb-4 transition-transform group-hover:scale-110">
                <FaTiktok size={18} />
              </div>
              <h3 className="text-base font-bold text-slate-900">TikTok & Facebook</h3>
              <p className="text-xs text-slate-500 mt-1">Video dokumentasi & review di balik layar</p>
              <span className="mt-3 text-sm font-semibold text-slate-800">@sayyeswedding_day</span>
            </a>
          </div>
        </section>

        {/* ✅ Section Newsletter - Email Subscription tampil otomatis kalau login */}
        <section className="mt-12 rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-8 shadow-sm ring-1 ring-slate-800 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FaEnvelope className="text-emerald-400" size={20} />
            <h2 className="text-3xl font-bold text-white">Berlangganan Newsletter Kami</h2>
          </div>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
            Dapatkan update terbaru seputar paket promo, giveaway, dan tips persiapan pernikahan langsung ke email Anda.
          </p>

          {/* ✅ Kalau sudah login tampil email langsung, bukan input */}
          {guestLoggedIn && subscriptionEmail ? (
            <div className="mt-8 inline-flex items-center gap-3 bg-emerald-500/20 border border-emerald-500/30 rounded-full px-8 py-4">
              <FaCheckCircle className="text-emerald-400" size={16} />
              <span className="text-white font-semibold text-sm">
                Berlangganan ke: <span className="text-emerald-300 font-bold">{subscriptionEmail}</span>
              </span>
            </div>
          ) : (
            <div className="mt-8 flex flex-col items-center gap-3">
              <p className="text-slate-400 text-sm">Login terlebih dahulu untuk berlangganan newsletter.</p>
              <Link
                to="/guest/login"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full transition text-sm"
              >
                Login Sekarang
              </Link>
            </div>
          )}
        </section>

        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200 mt-10 mb-10">
              <button
                onClick={() => setShowContact(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition"
              >
               
              </button>
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[.24em] text-slate-500">Hubungi Kami</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900">Ada pertanyaan? Kami siap membantu.</h2>
                  <p className="mt-3 text-sm text-slate-600">Isi form di samping untuk mengirim pertanyaan atau inquire tentang paket wedding Anda.</p>
                  <div className="mt-6 space-y-5 border-t pt-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Email</p>
                      <a href="mailto:admin@sayyeswedding.com" className="mt-2 text-lg text-emerald-600 font-semibold hover:text-emerald-700 transition block">admin@sayyeswedding.com</a>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">WhatsApp</p>
                      <a href="https://wa.me/6281234567890" className="mt-2 text-lg text-emerald-600 font-semibold hover:text-emerald-700 transition block">+62 812-3456-7890</a>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Alamat</p>
                      <p className="mt-2 text-sm text-slate-700">Jl. Melati No.12, Bandung</p>
                    </div>
                  </div>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6">
                  <p className="text-sm uppercase tracking-[.24em] text-emerald-600 font-semibold mb-4">Form Pesan Sekarang</p>
                  {contactSubmitted && (
                    <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-semibold text-center">
                      ✓ Pesan Anda terkirim! Tim kami akan segera menghubungi Anda.
                    </div>
                  )}
                  <form onSubmit={handleContactSubmit} className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
                      <input type="text" value={contactForm.name} onChange={(e) => setContactForm({...contactForm, name: e.target.value})} placeholder="Nama Anda" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Email</label>
                      <input type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} placeholder="email@example.com" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">No. HP</label>
                        <input type="tel" value={contactForm.phone} onChange={(e) => setContactForm({...contactForm, phone: e.target.value})} placeholder="+62 812..." className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Acara</label>
                        <input type="date" value={contactForm.eventDate || ""} onChange={(e) => setContactForm({...contactForm, eventDate: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100" />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Lokasi (Kota/Venue)</label>
                        <input type="text" value={contactForm.location || ""} onChange={(e) => setContactForm({...contactForm, location: e.target.value})} placeholder="Misal: Bandung" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Tamu</label>
                        <input type="number" value={contactForm.guestCount || ""} onChange={(e) => setContactForm({...contactForm, guestCount: e.target.value})} placeholder="Misal: 500" className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Pesan / Pertanyaan</label>
                      <textarea value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} placeholder="Tuliskan pertanyaan atau inquire Anda..." rows={4} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 resize-none" />
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition text-sm">
                      Kirim Pesan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <GuestOrderForm
          show={showOrderForm}
          onClose={() => setShowOrderForm(false)}
          prefillPackage={orderPrefillPackage}
          memberData={memberData}
          guestEmail={guestEmail}
          promoCode={orderPromoCode}
        />
      </main>
    </div>
  );
}