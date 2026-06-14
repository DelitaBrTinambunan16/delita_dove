import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getGuestLoggedUserEmail, isGuestLoggedIn } from "../lib/auth";
import { FaUserShield, FaStar, FaGift, FaExclamationTriangle, FaCheckCircle, FaComments } from "react-icons/fa";
import customersData from "../data/customers.json";

export default function GuestMember() {
  const [isLogged, setIsLogged] = useState(true);
  const [email, setEmail] = useState("");
  const [memberData, setMemberData] = useState(null);
  const [localComplaints, setLocalComplaints] = useState([]);

  useEffect(() => {
    if (!isGuestLoggedIn()) {
      setIsLogged(false);
    } else {
      const loggedEmail = getGuestLoggedUserEmail() || "";
      setEmail(loggedEmail);
      
      const found = customersData.find((c) => c.email === loggedEmail) || {
        customerName: loggedEmail.split("@")[0] || "Member",
        loyalty: "Bronze",
        campaignDiikuti: "-",
        complaints: [],
        adminNotes: ""
      };
      setMemberData(found);

      // Load complaints from localStorage
      try {
        const stored = JSON.parse(localStorage.getItem("guestComplaints") || "{}");
        if (stored[loggedEmail]) {
          setLocalComplaints(stored[loggedEmail]);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  if (!isLogged) {
    return <Navigate to="/guest" replace />;
  }

  if (!memberData) return null;

  const name = memberData.customerName;
  const allComplaints = [...(memberData.complaints || []), ...localComplaints];

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
          </div>
          <div className="flex flex-col items-center justify-center bg-amber-50 rounded-2xl px-6 py-4 border border-amber-100">
            <FaUserShield className="text-amber-500 text-3xl mb-2" />
            <span className="text-amber-700 font-bold uppercase tracking-wider text-xs">{memberData.loyalty} Member</span>
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
                  <button className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-emerald-700 transition">Gunakan</button>
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

      </div>
    </div>
  );
}
