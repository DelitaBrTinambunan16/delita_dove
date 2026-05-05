import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { FaRegEyeSlash } from "react-icons/fa"
import { ImSpinner2 } from "react-icons/im"

// Import gambar
import lilyImg from "../../assets/img/lily.jpg" 

export default function Login() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [dataForm, setDataForm] = useState({ email: "", password: "" })

    const handleChange = (e) => setDataForm({ ...dataForm, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const res = await axios.post("https://dummyjson.com/user/login", {
                username: dataForm.email,
                password: dataForm.password,
            })
            if (res.status === 200) navigate("/")
        } catch (err) {
            setError("Email atau Password salah!")
        } finally { setLoading(false) }
    }

    return (
     
        <div className="w-full max-w-[360px] mx-auto flex flex-col shadow-[0_15px_40px_rgba(0,0,0,0.08)] rounded-[35px] overflow-hidden bg-white border border-gray-50">
      
            <div className="h-36 w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                <img 
                    src={lilyImg} 
                    className="w-full h-full object-cover" 
                    alt="Lily Decoration"
                    onError={(e) => { e.target.style.display = 'none' }} 
                />
            </div>

            {/* Form Login */}
            <div className="px-8 pb-8 pt-6">
                <div className="mb-6 text-center">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Log in</h2>
                    <p className="text-[#C5A358] text-[9px] font-bold mt-1 tracking-[0.2em] uppercase">Wedding Organizer</p>
                </div>

                {error && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[10px] font-bold text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Input Email (component*/}
                    <div className="relative border-b border-gray-100 focus-within:border-[#C5A358] transition-all">
                        <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">Email Address</label>
                        <input 
                            name="email"
                            type="text"
                            autoComplete="off"
                            onChange={handleChange}
                            placeholder="emilys"
                            className="w-full py-1.5 bg-transparent focus:outline-none text-xs text-gray-700 placeholder-gray-200"
                        />
                    </div>

                    {/* Input Password */}
                    <div className="relative border-b border-gray-100 focus-within:border-[#C5A358] transition-all">
                        <div className="flex justify-between items-center">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold">Password</label>
                            <Link to="/forgot" className="text-[9px] text-gray-400 hover:text-[#C5A358] font-bold">Forgot?</Link>
                        </div>A
                        <div className="relative flex items-center">
                            <input 
                                name="password"
                                type="password"
                                onChange={handleChange}
                                placeholder="emilyspass"
                                className="w-full py-1.5 bg-transparent focus:outline-none text-xs text-gray-700 placeholder-gray-200"
                            />
                            <FaRegEyeSlash className="text-gray-300 cursor-pointer text-xs" />
                        </div>
                    </div>

                    {/* Tombol Login */}
                    <button 
                        disabled={loading}
                        className="w-full bg-[#10B981] hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-2"
                    >
                        {loading ? <ImSpinner2 className="animate-spin text-base" /> : "Log in"}
                    </button>
                </form>

                <p className="text-center text-[10px] text-gray-400 mt-6 font-medium">
                    New here? <Link to="/register" className="text-[#10B981] font-bold hover:underline">Create Account</Link>
                </p>
            </div>
        </div>
    )
}