export default function Forgot() {
    return (
        <div>
            <h2 className="text-xl font-semibold text-center mb-4 text-pink-500">
                Forgot Password
            </h2>

            <form>

                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border p-2 mb-3"
                />

                <button
                    type="submit"
                    className="w-full bg-pink-500 text-white p-2"
                >
                    Send Reset Link
                </button>

            </form>
        </div>
    )
}