import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import SearchInput from "./SearchInput";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";

const pageTitles = {
  "/": "Dashboard",
  "/customers": "Data Customer",
  "/orders": "Pemesanan",
  "/products": "Produk",
  "/portfolio": "Portofolio",
  "/auth/login": "Login",
  "/auth/register": "Register",
  "/auth/forgot": "Lupa Password",
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
                <SearchInput />
                <NotificationMenu />
                <ProfileMenu />
            </div>
        </div>
    );
}