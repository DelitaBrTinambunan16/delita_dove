export default function PageHeader({ title, children }) {
    return (
        <div id="pageheader-container" className="flex items-center justify-between pb-6 pt-2">
            <div id="pageheader-left" className="flex flex-col">
                <span id="page-title" className="text-3xl font-serif text-gray-900">
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