import SearchInput from "./SearchInput";
import NotificationMenu from "./NotificationMenu";
import ProfileMenu from "./ProfileMenu";

export default function Header() {
    return (
        <div className="flex items-center justify-between w-full py-2 bg-transparent">
            <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>

            <div className="flex items-center gap-6">
                <SearchInput />
                <NotificationMenu />
                <ProfileMenu />
            </div>
        </div>
    );
}