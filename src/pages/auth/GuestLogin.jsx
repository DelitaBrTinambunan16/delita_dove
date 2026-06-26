import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa"
import { ImSpinner2 } from "react-icons/im"
import { usersAPI } from "../../services/usersAPI"
import lilyImg from "../../assets/img/lily.jpg"
import { loginGuestUser } from "../../lib/auth"

export default function GuestLogin() {
    const navigate = useNavigate()
    const [loading, setLoading]   = useState(false)
    const [error, setError]       = useState("")
    const [showPass, setShowPass] = useState(false)
    const [dataForm, setDataForm] = useState({ email: "", password: "" })

    const handleChange = (e) =>
        setDataForm({ ...dataForm, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await usersAPI.login(dataForm.email, dataForm.password)

            if (result.length === 0) {
                setError("Email atau Password salah!")
                return
            }

            localStorage.setItem("member", JSON.stringify(result[0]))
            loginGuestUser(dataForm.email)
            navigate("/guest")

        } catch (err) {
            setError("Terjadi kesalahan, coba lagi!")
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-4 font-poppins">
            <div className="w-full max-w-[360px] bg-white rounded-[28px] shadow-[0_15px_40px_rgba(0,0,0,0.10)] overflow-hidden border border-gray-100">

                <div className="h-36 w-full overflow-hidden bg-emerald-50">
                    <img
                        src={lilyImg}
                        className="w-full h-full object-cover object-center"
                        alt="Lily Decoration"
                        onError={(e) => {
                            e.target.parentElement.style.background = "linear-gradient(135deg,#d1fae5,#6ee7b7)"
                            e.target.style.display = "none"
                        }}
                    />
                </div>

                <div className="px-8 pb-8 pt-6">
                    <div className="mb-6 text-center">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Login Member</h2>
                        <p className="text-[#10B981] text-[9px] font-bold mt-1 tracking-[0.2em] uppercase">
                            WeddingDay Organizer
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-2 bg-red-50 border border-red-100 rounded-lg text-red-500 text-[10px] font-bold text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="border-b border-gray-100 focus-within:border-[#10B981] transition-all pb-0.5">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                autoComplete="off"
                                onChange={handleChange}
                                placeholder="email@gmail.com"
                                required
                                disabled={loading}
                                className="w-full py-1.5 bg-transparent focus:outline-none text-xs text-gray-700 placeholder-gray-200"
                            />
                        </div>

                        <div className="border-b border-gray-100 focus-within:border-[#10B981] transition-all pb-0.5">
                            <label className="text-[9px] uppercase tracking-widest text-gray-400 font-bold block">
                                Password
                            </label>
                            <div className="flex items-center">
                                <input
                                    name="password"
                                    type={showPass ? "text" : "password"}
                                    onChange={handleChange}
                                    placeholder="Password kamu"
                                    required
                                    disabled={loading}
                                    className="w-full py-1.5 bg-transparent focus:outline-none text-xs text-gray-700 placeholder-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="text-gray-300 hover:text-[#10B981] transition ml-1"
                                >
                                    {showPass ? <FaRegEye size={12} /> : <FaRegEyeSlash size={12} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#10B981] hover:bg-emerald-600 disabled:opacity-70 text-white py-3 rounded-xl font-bold text-xs shadow-lg shadow-emerald-100 transition-all flex items-center justify-center gap-2 mt-2"
                        >
                            {loading ? <ImSpinner2 className="animate-spin text-sm" /> : "Login"}
                        </button>
                    </form>

                    <p className="text-center text-[10px] text-gray-400 mt-5 font-medium">
                        Belum punya akun?{" "}
                        {/* ✅ Path diperbaiki */}
                        <Link to="/guest/register" className="text-[#10B981] font-bold hover:underline">
                            Daftar di sini
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}