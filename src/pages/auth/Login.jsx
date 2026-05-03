import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BsFillExclamationDiamondFill } from "react-icons/bs"
import { ImSpinner2 } from "react-icons/im"
import { FaUser, FaLock } from "react-icons/fa"

export default function Login() {
    const navigate = useNavigate() 
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [dataForm, setDataForm] = useState({
        email: "",
        password: "",
    })

    const handleChange = (evt) => {
        const { name, value } = evt.target
        setDataForm({
            ...dataForm,
            [name]: value,
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        setLoading(true)
        setError(false)

        axios
            .post("https://dummyjson.com/user/login", {
                username: dataForm.email,
                password: dataForm.password,
            })
            .then((response) => {
                if (response.status !== 200) {
                    setError(response.data.message);
                    return; 
                }
                navigate("/");
            })
            .catch((err) => {
                if (err.response) {
                    setError(err.response.data.message || "An error occurred");
                } else {
                    setError(err.message || "An unknown error occurred");
                }
            })
            .finally(() => {
                setLoading(false); 
            });
    }

    const errorInfo = error ? (
        <div className="bg-red-50 mb-6 p-4 text-sm font-medium text-red-600 rounded-xl flex items-center border border-red-100">
            <BsFillExclamationDiamondFill className="text-red-500 mr-3 text-xl flex-shrink-0" />
            {error}
        </div>
    ) : null

    const loadingInfo = loading ? (
        <div className="bg-pink-50 mb-6 p-4 text-sm font-medium text-pink-700 rounded-xl flex items-center border border-pink-100">
            <ImSpinner2 className="mr-3 text-xl animate-spin text-[#fa2b56]" />
            Sedang menyiapkan dashboard...
        </div>
    ) : null

    return (
        <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-2 text-center font-bold">
                Welcome Back
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
                Login to your admin account
            </p>

            {errorInfo}
            {loadingInfo}

            <form onSubmit={handleSubmit} className="w-full">
                <div className="mb-5">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            name="email"
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#fa2b56] focus:ring-2 focus:ring-[#fa2b56]/20 transition-all placeholder-gray-400 text-gray-700 font-medium"
                            placeholder="Email Address (emilys)"
                        />
                    </div>
                </div>
                <div className="mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            onChange={handleChange}
                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-[#fa2b56] focus:ring-2 focus:ring-[#fa2b56]/20 transition-all placeholder-gray-400 text-gray-700 font-medium"
                            placeholder="Password (emilyspass)"
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#fa2b56] to-pink-500 hover:from-[#e01f46] hover:to-pink-600 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg shadow-pink-200 disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    )
}