import CreativeServiceList from "./Pertemuan4/CreativeServiceList.jsx";
import CreativeAdmin from "./Pertemuan4/CreativeAdmin.jsx";

function App() {
  return (
    <div className="w-full m-0 p-0 bg-slate-50 min-h-screen font-sans">
      <div className="py-10">
        <h1 className="text-3xl font-black text-center text-slate-900 mb-2 tracking-tight">
          DIGITAL BOOKSTORE PORTAL
        </h1>
        <div className="w-20 h-1 bg-indigo-600 mx-auto rounded-full mb-10"></div>
        
        {/* Guest View Section */}
        <div className="mb-16">
          <div className="bg-indigo-600 text-white px-6 py-2 w-fit mx-auto rounded-full text-sm font-bold shadow-lg mb-6">
            PUBLIC PORTAL (GUEST VIEW)
          </div>
          <CreativeServiceList />
        </div>

        {/* Admin View Section */}
        <div className="mt-20">
          <div className="bg-slate-800 text-white px-6 py-2 w-fit mx-auto rounded-full text-sm font-bold shadow-lg mb-6">
            INVENTORY SYSTEM (ADMIN VIEW)
          </div>
          <CreativeAdmin />
        </div>
      </div>
    </div>
  );
}

export default App;