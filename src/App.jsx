import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import ProductDetail from "./pages/ProdukDetail";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Loading from "./components/Loading";
import RequireAuth from "./components/RequireAuth";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Orders = lazy(() => import("./pages/Orders"));
const Customers = lazy(() => import("./pages/Customers"));
const Produk = lazy(() => import("./pages/Produk"));
const Portfolio = lazy(() => import("./pages/Portfolio"));
const Campaign = lazy(() => import("./pages/Campaign"));
const Message = lazy(() => import("./pages/Message"));
const Guest = lazy(() => import("./pages/Guest"));
const Member = lazy(() => import("./pages/Member"));
const GuestLayout = lazy(() => import("./layouts/GuestLayout"));

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const GuestLogin = lazy(() => import("./pages/auth/GuestLogin"));
const GuestRegister = lazy(() => import("./pages/auth/GuestRegister"));

const Forgot = lazy(() => import("./pages/auth/Forgot"));

const Error400 = lazy(() => import("./pages/Error400"));
const Error401 = lazy(() => import("./pages/Error401"));
const Error403 = lazy(() => import("./pages/Error403"));
const NotFound = lazy(() => import("./pages/NotFound"));

const GuestMember = lazy(() => import("./pages/GuestMember"));

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* PUBLIC GUEST LAYOUT */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Navigate to="/guest" replace />} />
          <Route path="/guest" element={<Guest />} />
          <Route path="/member" element={<GuestMember />} />
        </Route>

        {/* ADMIN LAYOUT */}
        <Route path="/admin" element={<RequireAuth><MainLayout /></RequireAuth>}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="portfolio" element={<Portfolio />} />
          <Route path="member" element={<Member />} />
          <Route path="products" element={<Produk />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="campaign" element={<Campaign />} />
          <Route path="message" element={<Message />} />
        </Route>

        {/* AUTH LAYOUT */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Guest login route intentionally removed from header; registration remains. */}
          <Route path="/member/register" element={<GuestRegister />} />
          <Route path="/member/login" element={<GuestLogin />} />
          <Route path="/forgot" element={<Forgot />} />
        </Route>

        {/* ERROR PAGES (FULL SCREEN) */}
        <Route path="/error-400" element={<Error400 />} />
        <Route path="/error-401" element={<Error401 />} />
        <Route path="/error-403" element={<Error403 />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
