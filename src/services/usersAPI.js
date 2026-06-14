import axios from 'axios'

// ✅ Pakai URL dan API_KEY dari Supabase project kamu sendiri
const API_URL = "https://lynvsmtpnnkluxmwgcay.supabase.co/rest/v1/users"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bnZzbXRwbm5rbHV4bXdnY2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjIwMTQsImV4cCI6MjA5NjkzODAxNH0.iwoBAbGWz8Mgf6bmXtVdlXWXy89uNG1imYalKr-cYqc"

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const usersAPI = {

    // ✅ Ambil semua user — dipakai di halaman admin Customers
    async fetchUsers() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    // ✅ Login — cari user berdasarkan email & password
    async login(email, password) {
        const response = await axios.get(
            `${API_URL}?email=eq.${email}&password=eq.${password}`,
            { headers }
        )
        return response.data
    },

    // ✅ Register — tambah user baru, return data yang baru dibuat
    async register(data) {
        const response = await axios.post(API_URL, data, {
            headers: {
                ...headers,
                Prefer: "return=representation",
            },
        })
        return response.data
    },

    // ✅ Ambil satu user berdasarkan id
    async getUserById(id) {
        const response = await axios.get(
            `${API_URL}?id=eq.${id}`,
            { headers }
        )
        return response.data[0]
    },

    // ✅ Update user — untuk simpan complaint, promo_code, dll
    async updateUser(id, data) {
        const response = await axios.patch(
            `${API_URL}?id=eq.${id}`,
            data,
            {
                headers: {
                    ...headers,
                    Prefer: "return=representation",
                },
            }
        )
        return response.data[0]
    },
}