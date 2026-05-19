import PageHeader from "../components/PageHeader";
import profileImg from "../assets/profile.png";
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Portfolio() {
  return (
    <div className="p-8 relative">
      <PageHeader title="Portfolio" />

      <div className="max-w-4xl mx-auto mt-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-48 bg-gradient-to-r from-pink-200 to-[#fa2b56]"></div>
          <div className="px-8 pb-8 flex flex-col sm:flex-row items-center sm:items-end -mt-20 sm:-mt-16 space-y-4 sm:space-y-0 sm:space-x-6 relative">
            <img
              src={profileImg}
              alt="Delita Br Tinambunan"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-gray-900 font-serif">Delita Br Tinambunan</h1>
              <p className="text-[#fa2b56] font-medium">Mahasiswi Sistem Informasi</p>
            </div>
            <div className="flex space-x-3">
              <a href="mailto:delita24si@mahasiswa.pcr.ac.id" className="px-5 py-2 bg-[#fa2b56] text-white rounded-xl shadow-md shadow-pink-200 hover:bg-[#e01f46] transition-colors font-medium text-sm inline-block">
                Contact Me
              </a>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Tentang Saya</h2>
              <p className="text-gray-600 leading-relaxed text-sm">
                Halo! Saya Delita, Mahasiswi Sistem Informasi.
                Saya senang belajar hal baru dan aktif dalam organisasi.
                Tahun ini adalah semester 4 saya di Politenik Caltex Riau.
                Dan pada semester 4 ini saya mempunyai projek Pemrograman Framework Lanjutan maka dari itu saya membuat website ini.
              </p>

            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-bold text-gray-800 mb-3">Informasi Kontak & Sosial Media</h2>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">📧</span>
                <span>delita24si@mahasiswa.pcr.ac.id</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">📱</span>
                <span>082387398764</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <span className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">📍</span>
                <span>Pekanbaru, Riau</span>
              </div>
              <div className="pt-2 flex space-x-4">
                <a href="https://www.instagram.com/delitatinambunan?igsh=MWljOGc0NDc5NGN6MQ==#" className="text-gray-400 hover:text-pink-600 transition-colors"><FaInstagram className="text-2xl" /></a>
                <a href="https://www.linkedin.com/in/delita-br-tinambunan-a6aaa739a?utm_source=share_via&utm_content=profile&utm_medium=member_android#" className="text-gray-400 hover:text-blue-600 transition-colors"><FaLinkedin className="text-2xl" /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
