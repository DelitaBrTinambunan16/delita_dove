export default function PageHeader({ title, description, children }) {
    return (
        <div id="pageheader-container" className="flex flex-col gap-1 pb-2 pt-1 md:flex-row md:items-center md:justify-between">
            <div id="pageheader-left" className="flex flex-col gap-1">
                <span id="page-title" className="text-2xl font-bold font-poppins text-stone-800">
                    {title}
                </span>
                {description && (
                    <p className="text-sm font-medium font-poppins text-stone-400">
                        {description}
                    </p>
                )}
            </div>
            {children && (
                <div id="pageheader-right">
                    {children}
                </div>
            )}
        </div>
    );
}