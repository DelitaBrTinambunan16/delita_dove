import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import SearchInput from "./SearchInput";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";

const pageTitles = {
  "/": "Home",
  "/admin": "Dashboard",
  "/admin/dashboard": "Dashboard",
  "/admin/customers": "Data Customer",
  "/admin/orders": "Pemesanan",
  "/admin/products": "Produk",
  "/admin/portfolio": "Portofolio",
  "/admin/campaign": "Campaign",
  "/admin/message": "Inbox Pesan",
  "/admin/member": "Member",
  "/login": "Login",
  "/register": "Register",
  "/forgot": "Lupa Password",
};

export default function Header() {
    const location = useLocation();

    const title = useMemo(() => {
      const pathname = location.pathname;
      if (pageTitles[pathname]) return pageTitles[pathname];
      const parts = pathname.split("/").filter(Boolean);
      if (!parts.length) return "Dashboard";
      return parts.map((part) => part[0].toUpperCase() + part.slice(1)).join(" / ");
    }, [location.pathname]);
    return (
        <div className="flex items-center justify-between w-full py-2 bg-transparent">
            <h1 className="text-xl font-semibold text-emerald-600">{title}</h1>

            <div className="flex items-center gap-6">
                <a href="/guest" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center justify-center rounded-full border border-emerald-300 bg-emerald-100 px-5 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-200 shadow-sm">
                  Buka Halaman Guest
                </a>
                <SearchInput />
                <NotificationMenu />
                <ProfileMenu />
            </div>
        </div>
    );
}