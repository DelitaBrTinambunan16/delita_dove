import profileImg from "../assets/profile.png";

export default function ProfileMenu() {
  return (
    <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
      <img
        src={profileImg}
        alt="User Profile"
        className="w-8 h-8 rounded-full object-cover border-2 border-emerald-100 shadow-sm"
      />
      <div className="hidden lg:block">
        <p className="text-sm font-semibold text-gray-800 leading-none">Delita Br Tinambunan</p>
        <p className="text-[11px] text-gray-400 mt-1">Admin Manager</p>
      </div>
    </div>
  );
}
