import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCommentDots, FaGift, FaStar, FaTicketAlt } from "react-icons/fa";
import { promoOffers } from "../data/promoOffers";
import { getGuestLoggedUserEmail, isGuestLoggedIn } from "../lib/auth";
import productsData from "../data/produkData.json";

const productsPreview = productsData.slice(0, 4);

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

  useEffect(() => {
    setGuestLoggedIn(isGuestLoggedIn());
    setGuestEmail(getGuestLoggedUserEmail() || "");
  }, []);

  const guestName = guestEmail.split("@")[0] || "Tamu";

  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.phone || !contactForm.message) {
      alert("Semua field harus diisi");
      return;
    }
    // Store inquiry in localStorage for admin to see
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
  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (!guestLoggedIn) {
      alert("Silakan login terlebih dahulu untuk menggunakan promo.");
      return;
    }
    if (!promoCode.trim()) {
      setPromoMessage("Masukkan kode promo terlebih dahulu.");
      return;
    }
    setPromoMessage(`Kode promo ${promoCode.trim().toUpperCase()} berhasil diterapkan.`);
    setPromoCode("");
  };

  const [subscribeEmail, setSubscribeEmail] = useState("");
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!guestLoggedIn) {
      alert("Silakan login terlebih dahulu untuk berlangganan.");
      return;
    }
    if (!subscribeEmail) {
      alert("Masukkan email Anda.");
      return;
    }
    alert(`Berhasil berlangganan dengan email: ${subscribeEmail}`);
    setSubscribeEmail("");
  };

  const getProductImage = (category) => {
    const cat = category?.toLowerCase() || "";
    if (cat.includes("decoration")) return "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("attire") || cat.includes("gown") || cat.includes("jas")) return "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("catering")) return "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("photography")) return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("invitation")) return "https://images.unsplash.com/photo-1517365830460-955ce3ccd263?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("souvenir")) return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("beauty") || cat.includes("mua")) return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("venue")) return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("service")) return "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("jewelry")) return "https://images.unsplash.com/photo-1512996367567-03f0356d3d62?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("entertainment")) return "https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=900&q=80";
    if (cat.includes("transport")) return "https://images.unsplash.com/photo-1517142089942-ba376ce32a2e?auto=format&fit=crop&w=900&q=80";
    return "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80";
  };

  const createWaLink = (text) => {
    const phone = "6281234567890";
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
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
                </div>
              </div>
            ))}
          </div>

          {/* Form Input Promo */}
          <div className="mt-8 rounded-2xl bg-emerald-50 p-6 border border-emerald-100 flex flex-col md:flex-row items-center gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-emerald-900">Punya Kode Promo?</h3>
              <p className="text-sm text-emerald-700 mt-1">Masukkan kode promo untuk mendapatkan diskon tambahan.</p>
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
            {/* Visible 'Daftar Member' buttons removed; registration available via Login dropdown. */}
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {memberBenefits.map((item) => {
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

        <section className="mt-10 grid gap-6 lg:grid-cols-4">
          {guestNeeds.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </section>

        <section id="produk" className="mt-16 rounded-[2.5rem] bg-white/60 backdrop-blur-xl p-8 shadow-xl shadow-slate-200/40 ring-1 ring-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-slate-200/50 pb-6">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-emerald-600 font-bold">Produk Rekomendasi</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900 drop-shadow-sm">Paket populer kami.</h2>
              <p className="mt-3 text-base text-slate-600">Interested dengan paket? Hubungi kami untuk inkuiri detail.</p>
            </div>
            <button onClick={() => setShowContact(true)} className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:scale-105 hover:shadow-emerald-300/50">Pesan Sekarang</button>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {productsPreview.map((product) => {
              const waText = `Halo SayYes WeddingDay, saya tertarik dengan ${product.title} (${product.code}). Tolong info detail dan harga final.`;
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
                    <div className="mt-4 flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-2 rounded-xl">
                      <span>{product.brand}</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span>{product.stock} stok</span>
                    </div>
                    <div className="mt-auto pt-6">
                    {guestLoggedIn ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowContact(true);
                          setContactForm({ ...contactForm, message: `Halo SayYes WeddingDay, saya ingin memesan paket ${product.title} (${product.code}). Tolong info detail dan harga final.` });
                        }}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
                      >
                        Pesan Sekarang
                      </button>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setShowContact(true);
                          setContactForm({ ...contactForm, message: `Halo SayYes WeddingDay, saya ingin memesan paket ${product.title} (${product.code}). Tolong info detail dan harga final.` });
                        }}
                        className="mt-5 inline-flex w-full items-center justify-center rounded-full border border-emerald-600 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
                      >
                        Pesan Sekarang
                      </button>
                    )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section Langganan / Newsletter */}
        <section className="mt-12 rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-8 shadow-sm ring-1 ring-slate-800 text-center">
          <h2 className="text-3xl font-bold text-white">Berlangganan Newsletter Kami</h2>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
            Dapatkan update terbaru seputar paket promo, giveaway, dan tips persiapan pernikahan langsung ke email Anda. 
            Hanya member yang login dapat berlangganan.
          </p>
          <form onSubmit={handleSubscribe} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder={guestLoggedIn ? "Masukkan email Anda..." : "Login terlebih dahulu..."}
              value={subscribeEmail}
              onChange={(e) => setSubscribeEmail(e.target.value)}
              disabled={!guestLoggedIn}
              className="w-full px-4 py-3 rounded-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!guestLoggedIn}
              className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 disabled:text-slate-400 text-white font-semibold py-3 px-8 rounded-full transition text-sm"
            >
              Langganan
            </button>
          </form>
        </section>

        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-[2rem] bg-white p-8 shadow-2xl ring-1 ring-slate-200 mt-10 mb-10">
              <button 
                onClick={() => setShowContact(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition"
              >
                ✕ Tutup
              </button>
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p className="text-sm uppercase tracking-[.24em] text-slate-500">Hubungi Kami</p>
                  <h2 className="mt-3 text-2xl font-bold text-slate-900">Ada pertanyaan? Kami siap membantu.</h2>
                  <p className="mt-3 text-sm text-slate-600">Isi form di samping untuk mengirim pertanyaan atau inquire tentang paket wedding Anda. Tim kami akan segera merespon.</p>
                  <div className="mt-6 space-y-5 border-t pt-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">Email</p>
                      <a href="mailto:admin@sayyeswedding.com" className="mt-2 text-lg text-emerald-600 font-semibold hover:text-emerald-700 transition block">admin@sayyeswedding.com</a>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">WhatsApp (untuk tanya-tanya cepat)</p>
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
                      <input 
                        type="text" 
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                        placeholder="Nama Anda"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Email</label>
                      <input 
                        type="email" 
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                        placeholder="email@example.com"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">No. HP</label>
                        <input 
                          type="tel" 
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                          placeholder="+62 812..."
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Tanggal Acara</label>
                        <input 
                          type="date" 
                          value={contactForm.eventDate || ""}
                          onChange={(e) => setContactForm({...contactForm, eventDate: e.target.value})}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Lokasi (Kota/Venue)</label>
                        <input 
                          type="text" 
                          value={contactForm.location || ""}
                          onChange={(e) => setContactForm({...contactForm, location: e.target.value})}
                          placeholder="Misal: Bandung"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-600 block mb-1">Jumlah Tamu</label>
                        <input 
                          type="number" 
                          value={contactForm.guestCount || ""}
                          onChange={(e) => setContactForm({...contactForm, guestCount: e.target.value})}
                          placeholder="Misal: 500"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">Pesan / Pertanyaan</label>
                      <textarea 
                        value={contactForm.message}
                        onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                        placeholder="Tuliskan pertanyaan atau inquire Anda..."
                        rows={4}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-100 resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition text-sm"
                    >
                      Kirim Pesan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
