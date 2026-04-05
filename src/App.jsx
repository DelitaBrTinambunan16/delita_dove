import UserForm from "./components/Pertemuan3/UserForm";

function App() {
  // Hapus import './App.css' agar tidak bentrok dengan Tailwind
  return (
    <div className="w-full m-0 p-0">
      <UserForm />
    </div>
  );
}

export default App;