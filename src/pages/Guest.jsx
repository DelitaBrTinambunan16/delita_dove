import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaCommentDots, FaGift, FaStar, FaTicketAlt, FaExclamationTriangle, FaCheckCircle, FaEnvelope, FaPhone, FaInstagram, FaFacebook, FaTiktok, FaCheck, FaCrown, FaMapMarkerAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { promoOffers } from "../data/promoOffers";
import { getGuestLoggedUserEmail, isGuestLoggedIn } from "../lib/auth";
import { usersAPI } from "../services/usersAPI";
import customersData from "../data/customers.json";
import { supabase } from "../lib/supabaseClient";
import productsData from "../data/produkData.json";
import campaignsData from "../data/campaigns.json";
import GuestOrderForm from "../components/GuestOrderForm";

const getProductRating = (id) => Number((4.3 + (id % 7) * 0.1).toFixed(1));
const formatRupiah = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(value || 0);


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
  const [weddingPackages, setWeddingPackages] = useState([]);
  const [productsPreview, setProductsPreview] = useState([]);
  const [campaignPreview, setCampaignPreview] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [campaignLoading, setCampaignLoading] = useState(true);
  const [landingError, setLandingError] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchPackages = async () => {
      setProductsLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, code, title, category, brand, price, stock')
          .limit(12);
        if (error) throw error;
        const productRows = data && data.length > 0 ? data : productsData.slice(0, 12);
        setProductsPreview(productRows.slice(0, 8));

        // Mapping sederhana berdasarkan price range (sesuai PRD)
        const mapped = productRows.map((p) => {
          const tier = p.price >= 4000000 ? 'Premium' : p.price >= 2500000 ? 'Deluxe' : 'Standard';
          const accent =
            tier === 'Premium'
              ? 'from-emerald-500 to-emerald-600'
              : tier === 'Deluxe'
                ? 'from-sky-500 to-sky-600'
                : 'from-amber-500 to-amber-600';
          const ring =
            tier === 'Premium'
              ? 'ring-emerald-200'
              : tier === 'Deluxe'
                ? 'ring-sky-200'
                : 'ring-amber-200';
          const badge = tier === 'Premium' ? 'Best Seller' : tier === 'Deluxe' ? 'Populer' : 'Hemat';

          return {
            name: tier,
            venue: 'Custom Venue',
            price: p.price,
            rating: 4.7,
            tagline: `Paket ${tier} tersedia dengan konfigurasi fleksibel.`,
            features: [
              'Konsultasi wedding sesuai kebutuhan',
              'Rincian layanan mengikuti ketersediaan',
              'Koordinasi timeline event',
              'Dokumentasi & laporan ringkas',
            ],
            badge,
            accent,
            ring,
          };
        });

        // Ambil 1 paket per tier supaya section konsisten 3 card
        const byTier = { Premium: null, Deluxe: null, Standard: null };
        for (const item of mapped) {
          if (!byTier[item.name]) byTier[item.name] = item;
        }

        setWeddingPackages([
          byTier.Premium || null,
          byTier.Deluxe || null,
          byTier.Standard || null,
        ].filter(Boolean));
      } catch (err) {
        console.error('Error fetching packages:', err);
        setLandingError("Data Supabase belum tersedia, menampilkan data contoh lokal.");
        setProductsPreview(productsData.slice(0, 8));
        // fallback minimal (agar section tetap render)
        setWeddingPackages([
          {
            name: 'Premium',
            venue: 'Garden Paradise',
            price: 4000000,
            rating: 4.9,
            tagline: 'Pengalaman wedding mewah dan lengkap',
            features: ['Dekorasi outdoor eksklusif'],
            badge: 'Best Seller',
            accent: 'from-emerald-500 to-emerald-600',
            ring: 'ring-emerald-200',
          },
          {
            name: 'Deluxe',
            venue: 'Grand Ballroom',
            price: 2500000,
            rating: 4.7,
            tagline: 'Paket elegan untuk acara berkelas',
            features: ['Ballroom indoor mewah'],
            badge: 'Populer',
            accent: 'from-sky-500 to-sky-600',
            ring: 'ring-sky-200',
          },
          {
            name: 'Standard',
            venue: 'Cozy Intimate',
            price: 1000000,
            rating: 4.5,
            tagline: 'Hemat tapi tetap berkesan',
            features: ['Venue intimate nyaman'],
            badge: 'Hemat',
            accent: 'from-amber-500 to-amber-600',
            ring: 'ring-amber-200',
          },
        ]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchPackages();
  }, []);
  const [guestEmail, setGuestEmail] = useState("");
  const [contactForm, setContactForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [contactErrors, setContactErrors] = useState({});
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactError, setContactError] = useState("");
  const [showContact, setShowContact] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [orderPrefillPackage, setOrderPrefillPackage] = useState("Premium");
  const [orderPromoCode, setOrderPromoCode] = useState("");

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

      // Ambil data terbaru dari Supabase 
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

    const fetchCampaigns = async () => {
      setCampaignLoading(true);
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select('id, campaign_id, name, type, start_date, end_date, participants_count, image_url, description')
          .order('participants_count', { ascending: false })
          .limit(3);
        if (error) throw error;
        const rows = data && data.length > 0 ? data : campaignsData.slice(0, 3);
        setCampaignPreview(rows);
      } catch (error) {
        console.error("Error fetching campaigns:", error);
        setCampaignPreview(campaignsData.slice(0, 3));
      } finally {
        setCampaignLoading(false);
      }
    };

    checkLogin();
    fetchCampaigns();
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

  // Validation function untuk contact form
  const validateContactForm = (form) => {
    const errors = {};
    
    if (!form.name.trim()) {
      errors.name = "Nama wajib diisi";
    } else if (form.name.trim().length < 3) {
      errors.name = "Nama minimal 3 karakter";
    }
    
    if (!form.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "Format email tidak valid (contoh: nama@email.com)";
    }
    
    if (!form.phone.trim()) {
      errors.phone = "Nomor HP wajib diisi";
    } else if (!/^(\+62|0)[0-9]{9,12}$/.test(form.phone.replace(/[-\s]/g, ""))) {
      errors.phone = "Format HP tidak valid (contoh: 08123456789 atau +62812345678)";
    }
    
    if (!form.message.trim()) {
      errors.message = "Pesan wajib diisi";
    } else if (form.message.trim().length < 10) {
      errors.message = "Pesan minimal 10 karakter";
    }
    
    return errors;
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateContactForm(contactForm);
    setContactErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      setContactError("Silakan perbaiki error di bawah sebelum mengirim.");
      return;
    }
    
    setContactLoading(true);
    setContactError("");

    const payload = {
      message_type: "general_inquiry",
      name: contactForm.name.trim(),
      email: contactForm.email.trim(),
      phone: contactForm.phone.trim(),
      event_date: contactForm.eventDate || null,
      location: contactForm.location || null,
      guest_count: contactForm.guestCount ? Number(contactForm.guestCount) : null,
      message: contactForm.message.trim(),
      notes: null,
      promo_code: null,
    };

    try {
      const { error } = await supabase.from('messages').insert([payload]);
      if (error) {
        if (error.message?.includes("constraint")) {
          throw new Error("Data sudah pernah terkirim. Silakan gunakan data lain atau hubungi admin.");
        }
        throw error;
      }

      setContactSubmitted(true);
      setContactForm({ name: "", email: "", phone: "", message: "", eventDate: "", location: "", guestCount: "" });
      setContactErrors({});
      
      // Auto-hide modal setelah 3 detik
      setTimeout(() => {
        setContactSubmitted(false);
        setShowContact(false);
      }, 3000);
    } catch (err) {
      console.error("Error insert messages:", err);
      setContactError(err.message || "Gagal mengirim pesan. Silakan coba lagi atau hubungi admin via WhatsApp.");
    } finally {
      setContactLoading(false);
    }
  };

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");

  // Handle promo - simpan ke Supabase kalau login
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

  // Email subscription - tampil email otomatis dari akun login, bukan input manual
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

  const highlightedProducts = productsPreview.slice(0, 4);
  const activeHighlight = highlightedProducts[highlightIndex] || highlightedProducts[0];

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    const pkg = Number(product.price) >= 4000000 ? "Premium" : Number(product.price) >= 2500000 ? "Deluxe" : "Standard";
    setOrderPrefillPackage(pkg);
    setOrderPromoCode("");
  };

  const openBookingForm = (product = selectedProduct) => {
    if (product) handleSelectProduct(product);
    setShowOrderForm(true);
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
              {/* Tampilkan promo aktif kalau sudah punya */}
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
              <p className="mt-3 text-base text-slate-600">Pilih paket yang diminati, lalu ajukan booking tanpa perlu login.</p>
            </div>
            <button
              onClick={() => {
                if (productsPreview[0]) {
                  openBookingForm(productsPreview[0]);
                  return;
                }
                setShowContact(true);
              }}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:scale-105 hover:shadow-emerald-300/50"
            >
              Ajukan Booking
            </button>
          </div>
          {landingError && (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700">
              {landingError}
            </div>
          )}
          {activeHighlight && (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-emerald-100 bg-slate-950 text-white shadow-lg">
              <div className="grid gap-0 lg:grid-cols-[1.15fr_.85fr]">
                <div className="relative min-h-[280px]">
                  <img
                    src={getProductImage(activeHighlight.category)}
                    alt={activeHighlight.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-70"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent" />
                  <div className="relative z-10 flex min-h-[280px] flex-col justify-end p-8">
                    <p className="text-xs font-bold uppercase tracking-[.24em] text-emerald-200">Highlight Paket</p>
                    <h3 className="mt-3 max-w-xl text-3xl font-black leading-tight">{activeHighlight.title}</h3>
                    <p className="mt-3 text-sm text-white/75">{activeHighlight.category} - {activeHighlight.brand}</p>
                    <p className="mt-4 text-2xl font-black text-emerald-200">{formatRupiah(activeHighlight.price)}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-between gap-6 bg-white p-6 text-slate-900">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-600">Carousel Produk</p>
                    <p className="mt-3 text-sm leading-6 text-slate-600">
                      Gunakan tombol next/prev untuk melihat paket unggulan yang diambil dari tabel products.
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setHighlightIndex((prev) => (prev - 1 + highlightedProducts.length) % highlightedProducts.length)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                      aria-label="Produk sebelumnya"
                    >
                      <FaChevronLeft size={13} />
                    </button>
                    <span className="text-xs font-bold text-slate-500">{highlightIndex + 1} / {highlightedProducts.length}</span>
                    <button
                      type="button"
                      onClick={() => setHighlightIndex((prev) => (prev + 1) % highlightedProducts.length)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition hover:bg-slate-100"
                      aria-label="Produk berikutnya"
                    >
                      <FaChevronRight size={13} />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBookingForm(activeHighlight)}
                    className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
                  >
                    Pilih Paket Ini
                  </button>
                </div>
              </div>
            </div>
          )}
          <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {productsLoading && [1, 2, 3, 4].map((item) => (
              <div key={item} className="overflow-hidden rounded-[2rem] bg-white shadow-md ring-1 ring-slate-100">
                <div className="h-56 animate-pulse bg-slate-200" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />
                  <div className="h-7 w-1/2 animate-pulse rounded bg-slate-200" />
                  <div className="h-10 animate-pulse rounded-xl bg-slate-100" />
                  <div className="h-10 animate-pulse rounded-full bg-slate-200" />
                </div>
              </div>
            ))}
            {!productsLoading && productsPreview.map((product) => {
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
                          handleSelectProduct(product);
                        }}
                        className={`mt-5 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedProduct?.code === product.code
                            ? "bg-slate-900 text-white"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        {selectedProduct?.code === product.code ? "Paket Terpilih" : "Pilih Paket"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section id="portfolio" className="mt-16 rounded-[2.5rem] bg-white p-8 shadow-xl shadow-slate-200/40 ring-1 ring-slate-100">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[.24em] text-emerald-600 font-bold">Portfolio & Campaign</p>
              <h2 className="mt-3 text-4xl font-black text-slate-900">Bukti karya dan aktivitas klien.</h2>
              <p className="mt-3 max-w-2xl text-base text-slate-600">
                Data social proof ini diambil dari tabel campaigns dan otomatis mengikuti data CRM.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {campaignLoading && [1, 2, 3].map((item) => (
              <div key={item} className="rounded-3xl border border-slate-100 bg-slate-50 p-5">
                <div className="h-36 animate-pulse rounded-2xl bg-slate-200" />
                <div className="mt-5 h-4 w-1/2 animate-pulse rounded bg-slate-200" />
                <div className="mt-3 h-6 w-3/4 animate-pulse rounded bg-slate-200" />
                <div className="mt-4 h-12 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
            {!campaignLoading && campaignPreview.map((campaign) => (
              <div key={campaign.campaign_id || campaign.campaignId} className="overflow-hidden rounded-3xl border border-slate-100 bg-slate-50 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <div className="h-44 overflow-hidden">
                  <img
                    src={campaign.image_url || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=900&q=80"}
                    alt={campaign.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <p className="text-[11px] font-bold uppercase tracking-[.24em] text-emerald-600">{campaign.type}</p>
                  <h3 className="mt-2 text-lg font-bold text-slate-900">{campaign.name}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {campaign.description || `Diikuti oleh ${campaign.participants_count || campaign.participantsCount || 0} customer/prospek Delita Dove.`}
                  </p>
                  <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-xs font-bold text-slate-500">
                    <span>{campaign.start_date || campaign.startDate || "-"}</span>
                    <span className="text-emerald-600">{campaign.participants_count || campaign.participantsCount || 0} peserta</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {selectedProduct && (
          <div className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[calc(100%-2rem)] max-w-4xl rounded-3xl border border-emerald-100 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur-md">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[.2em] text-emerald-600">1 Paket Terpilih</p>
                <h3 className="mt-1 text-base font-bold text-slate-900">{selectedProduct.title}</h3>
                <p className="text-sm font-semibold text-slate-500">{formatRupiah(selectedProduct.price)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => openBookingForm(selectedProduct)}
                  className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                >
                  Ajukan Booking
                </button>
              </div>
            </div>
          </div>
        )}

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
              <span className="mt-3 text-sm font-semibold text-emerald-600">admin@sayyeswedding.com</span>
            </a>

            {/* Phone/WhatsApp Card */}
            <a href="https://wa.me/682387398764" target="_blank" rel="noreferrer" className="group flex flex-col items-center text-center p-6 bg-slate-50 border border-slate-200 rounded-3xl hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-300 hover:-translate-y-1">
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

        {/*  Section Newsletter - Email Subscription tampil otomatis kalau login */}
        <section className="mt-12 rounded-[2rem] bg-gradient-to-r from-slate-900 to-slate-800 p-8 shadow-sm ring-1 ring-slate-800 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <FaEnvelope className="text-emerald-400" size={20} />
            <h2 className="text-3xl font-bold text-white">Berlangganan Newsletter Kami</h2>
          </div>
          <p className="mt-3 text-sm text-slate-300 max-w-2xl mx-auto">
            Dapatkan update terbaru seputar paket promo, giveaway, dan tips persiapan pernikahan langsung ke email Anda.
          </p>

          {/*  Kalau sudah login tampil email langsung, bukan input */}
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
                to="/member/login"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-full transition text-sm"
              >
                Login Sekarang
              </Link>
            </div>
          )}
        </section>

        {showContact && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-[2rem] bg-white shadow-2xl ring-1 ring-slate-200 mt-10 mb-10 overflow-hidden">
              {/* Close Button */}
              <button
                onClick={() => {
                  setShowContact(false);
                  setContactErrors({});
                  setContactError("");
                }}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="grid gap-0 lg:grid-cols-2">
                {/* Left Section - Info */}
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 flex flex-col justify-between">
                  <div>
                    <p className="text-sm uppercase tracking-[.24em] text-emerald-700 font-semibold">Hubungi Kami</p>
                    <h2 className="mt-3 text-2xl font-bold text-slate-900">Ada pertanyaan? Kami siap membantu.</h2>
                    <p className="mt-3 text-sm text-slate-600">Isi form di samping untuk mengirim pertanyaan atau inquire tentang paket wedding Anda. Kami akan merespon dalam 24 jam.</p>
                  </div>
                  <div className="mt-6 space-y-5 border-t border-emerald-200 pt-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Email</p>
                      <a href="mailto:admin@sayyeswedding.com" className="mt-2 text-base text-emerald-600 font-semibold hover:text-emerald-700 transition block">admin@sayyeswedding.com</a>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">WhatsApp</p>
                      <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="mt-2 text-base text-emerald-600 font-semibold hover:text-emerald-700 transition block">+62 812-3456-7890</a>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-emerald-700 font-semibold">Lokasi</p>
                      <p className="mt-2 text-sm text-slate-700">Jl. Melati No.12, Bandung</p>
                    </div>
                  </div>
                </div>

                {/* Right Section - Form */}
                <div className="p-8">
                  <p className="text-sm uppercase tracking-[.24em] text-emerald-600 font-semibold mb-6">Form Pesan Sekarang</p>
                  
                  {/* Success Message */}
                  {contactSubmitted && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-start gap-3">
                      <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-emerald-900">Pesan Terkirim!</p>
                        <p className="text-sm text-emerald-700 mt-1">Tim kami akan menghubungi Anda dalam 24 jam. Tutup modal ini.</p>
                      </div>
                    </div>
                  )}

                  {/* Error Alert */}
                  {contactError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-300 rounded-xl flex items-start gap-3">
                      <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-semibold text-red-900">Ada Kesalahan</p>
                        <p className="text-sm text-red-700 mt-1">{contactError}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="text" 
                        value={contactForm.name} 
                        onChange={(e) => {
                          setContactForm({...contactForm, name: e.target.value});
                          if (contactErrors.name) setContactErrors({...contactErrors, name: ""});
                        }} 
                        placeholder="Nama Anda" 
                        disabled={contactLoading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                          contactErrors.name 
                            ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-500" 
                            : "border-slate-200 bg-white focus:ring-emerald-200 focus:border-emerald-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`} 
                      />
                      {contactErrors.name && <p className="text-xs text-red-600 mt-1">{contactErrors.name}</p>}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="email" 
                        value={contactForm.email} 
                        onChange={(e) => {
                          setContactForm({...contactForm, email: e.target.value});
                          if (contactErrors.email) setContactErrors({...contactErrors, email: ""});
                        }} 
                        placeholder="email@example.com" 
                        disabled={contactLoading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                          contactErrors.email 
                            ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-500" 
                            : "border-slate-200 bg-white focus:ring-emerald-200 focus:border-emerald-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`} 
                      />
                      {contactErrors.email && <p className="text-xs text-red-600 mt-1">{contactErrors.email}</p>}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        No. HP <span className="text-red-500">*</span>
                      </label>
                      <input 
                        type="tel" 
                        value={contactForm.phone} 
                        onChange={(e) => {
                          setContactForm({...contactForm, phone: e.target.value});
                          if (contactErrors.phone) setContactErrors({...contactErrors, phone: ""});
                        }} 
                        placeholder="08123456789 atau +628123456789" 
                        disabled={contactLoading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 ${
                          contactErrors.phone 
                            ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-500" 
                            : "border-slate-200 bg-white focus:ring-emerald-200 focus:border-emerald-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`} 
                      />
                      {contactErrors.phone && <p className="text-xs text-red-600 mt-1">{contactErrors.phone}</p>}
                    </div>

                    {/* Date & Location */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">Tanggal Acara</label>
                        <input 
                          type="date" 
                          value={contactForm.eventDate || ""} 
                          onChange={(e) => setContactForm({...contactForm, eventDate: e.target.value})} 
                          disabled={contactLoading}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700 block mb-1.5">Lokasi/Kota</label>
                        <input 
                          type="text" 
                          value={contactForm.location || ""} 
                          onChange={(e) => setContactForm({...contactForm, location: e.target.value})} 
                          placeholder="Misal: Bandung" 
                          disabled={contactLoading}
                          className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                        />
                      </div>
                    </div>

                    {/* Guest Count */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">Jumlah Tamu</label>
                      <input 
                        type="number" 
                        value={contactForm.guestCount || ""} 
                        onChange={(e) => setContactForm({...contactForm, guestCount: e.target.value})} 
                        placeholder="Misal: 500" 
                        disabled={contactLoading}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed" 
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                        Pesan / Pertanyaan <span className="text-red-500">*</span>
                      </label>
                      <textarea 
                        value={contactForm.message} 
                        onChange={(e) => {
                          setContactForm({...contactForm, message: e.target.value});
                          if (contactErrors.message) setContactErrors({...contactErrors, message: ""});
                        }} 
                        placeholder="Tuliskan pertanyaan atau inquire Anda..." 
                        rows={3} 
                        disabled={contactLoading}
                        className={`w-full px-3 py-2.5 border rounded-lg text-sm transition focus:outline-none focus:ring-2 resize-none ${
                          contactErrors.message 
                            ? "border-red-300 bg-red-50 focus:ring-red-200 focus:border-red-500" 
                            : "border-slate-200 bg-white focus:ring-emerald-200 focus:border-emerald-500"
                        } disabled:opacity-50 disabled:cursor-not-allowed`} 
                      />
                      {contactErrors.message && <p className="text-xs text-red-600 mt-1">{contactErrors.message}</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      disabled={contactLoading || contactSubmitted}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition text-sm flex items-center justify-center gap-2"
                    >
                      {contactLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Mengirim...
                        </>
                      ) : (
                        "Kirim Pesan"
                      )}
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
          selectedProduct={selectedProduct}
          memberData={memberData}
          guestEmail={guestEmail}
          promoCode={orderPromoCode}
          onSubmitted={() => setSelectedProduct(null)}
        />
      </main>
    </div>
  );
}
