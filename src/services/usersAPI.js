const API_URL = "https://lynvsmtpnnkluxmwgcay.supabase.co/rest/v1/member"
const API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5bnZzbXRwbm5rbHV4bXdnY2F5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEzNjIwMTQsImV4cCI6MjA5NjkzODAxNH0.iwoBAbGWz8Mgf6bmXtVdlXWXy89uNG1imYalKr-cYqc"
import axios from 'axios'

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
}

export const usersAPI = {

    // Ambil semua member — untuk halaman admin
    async fetchUsers() {
        const response = await axios.get(API_URL, { headers })
        return response.data
    },

    // Login member — cek email & password di tabel member
    async login(email, password) {
        const response = await axios.get(
            `${API_URL}?email=eq.${email}&password=eq.${password}`,
            { headers }
        )
        return response.data
    },

    // Register member baru
    async register(data) {
        const response = await axios.post(API_URL, data, {
            headers: {
                ...headers,
                Prefer: "return=representation",
            },
        })
        return response.data
    },

    // Ambil data member by id
    async getUserById(id) {
        const response = await axios.get(
            `${API_URL}?id=eq.${id}`,
            { headers }
        )
        return response.data[0]
    },

    // Update data member (promo_code, complaint, dll)
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

    // Hapus member berdasarkan id
    async deleteUser(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers })
    },
}