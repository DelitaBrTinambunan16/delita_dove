export default function PageHeader({ title, children }) {
    return (
        <div id="pageheader-container" className="flex items-center justify-between pb-2 pt-1">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-xl font-serif text-gray-900">
                    {title}
                </span>
            </div>
            {children && (
                <div id="pageheader-right">
                    {children}
                </div>
            )}
        </div>
    );
}