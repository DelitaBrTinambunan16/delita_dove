import profileImg from "../assets/profile.png";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
} from "@/components/ui/avatar";

export default function ProfileMenu() {
  return (
    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">

      <Avatar size="lg" className="border-2 border-emerald-100 shadow-sm">
        <AvatarImage src={profileImg} alt="Delita Br Tinambunan" />
        <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-sm">
          DB
        </AvatarFallback>
        {/* Badge hijau kecil penanda online */}
        <AvatarBadge className="bg-emerald-500" />
      </Avatar>

      {/* Nama & jabatan */}
      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-gray-800 leading-none">
          Delita Br Tinambunan
        </p>
        <p className="text-[11px] text-gray-400 mt-1">Admin Manager</p>
      </div>
    </div>
  );
}