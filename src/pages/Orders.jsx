import { useState, useEffect } from "react";
import PageHeader from "../components/PageHeader";
import OrderForm from "../components/OrderForm";
import OrderFilterBar from "../components/OrderFilterBar";
import OrdersTable from "../components/OrdersTable";
import ordersData from "../data/orders.json";

export default function Orders() {
    const [orders, setOrders] = useState(ordersData);
    const [showForm, setShowForm] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        customerName: "",
        status: "Pending",
        paket: "Premium",
        orderDate: ""
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterStatus]);

    const getPaket = (price) => {
        if (price >= 4000000) return "Premium";
        if (price >= 2500000) return "Deluxe";
        return "Standard";
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        let price = 1000000;
        if (formData.paket === "Premium") price = 4000000;
        if (formData.paket === "Deluxe") price = 2500000;

        const newOrder = {
            orderId: `ORD0${orders.length + 1}`,
            customerName: formData.customerName,
            status: formData.status,
            totalPrice: price,
            orderDate: formData.orderDate || new Date().toISOString().split('T')[0]
        };
        setOrders([newOrder, ...orders]);
        setShowForm(false);
        setFormData({ customerName: "", status: "Pending", paket: "Premium", orderDate: "" });
    }

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              order.orderId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === "All" || order.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-8 relative font-poppins bg-[#F9F7F5] min-h-screen">
            <PageHeader title="Pemesanan" description="Kelola semua pesanan wedding di satu tempat">
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center gap-2 text-sm"
                >
                    + Tambah Pesanan
                </button>
            </PageHeader>

            <OrderForm show={showForm} onClose={() => setShowForm(false)} formData={formData} setFormData={setFormData} onSubmit={handleSubmit} getPaket={getPaket} />

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-4">
                <OrderFilterBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} filterStatus={filterStatus} setFilterStatus={setFilterStatus} filteredOrdersLength={filteredOrders.length} />
                <OrdersTable currentOrders={currentOrders} currentPage={currentPage} totalPages={totalPages} filteredOrdersLength={filteredOrders.length} itemsPerPage={itemsPerPage} onPrevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))} onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} getPaket={getPaket} />
            </div>
        </div>
    );
}