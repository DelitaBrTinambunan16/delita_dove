import { Routes, Route } from "react-router-dom"
import { Suspense, lazy } from "react"

import MainLayout from "./layouts/MainLayout"
import AuthLayout from "./layouts/AuthLayout"
import Loading from "./components/Loading"

const Dashboard = lazy(() => import("./pages/Dashboard"))
const Orders = lazy(() => import("./pages/Orders"))
const Customers = lazy(() => import("./pages/Customers"))
const Portfolio = lazy(() => import("./pages/Portfolio"))

const Login = lazy(() => import("./pages/auth/Login"))
const Register = lazy(() => import("./pages/auth/Register"))
const Forgot = lazy(() => import("./pages/auth/Forgot"))

const Error400 = lazy(() => import("./pages/Error400"))
const Error401 = lazy(() => import("./pages/Error401"))
const Error403 = lazy(() => import("./pages/Error403"))
const NotFound = lazy(() => import("./pages/NotFound"))

export default function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>

                {/* MAIN LAYOUT */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/customers" element={<Customers />} />
                    <Route path="/portfolio" element={<Portfolio />} />

                </Route>

                {/* AUTH LAYOUT */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot" element={<Forgot />} />
                </Route>

                {/* ERROR PAGES (FULL SCREEN) */}
                <Route path="/error-400" element={<Error400 />} />
                <Route path="/error-401" element={<Error401 />} />
                <Route path="/error-403" element={<Error403 />} />
                <Route path="*" element={<NotFound />} />

            </Routes>
        </Suspense>
    )
}