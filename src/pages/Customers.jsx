import { useState, useEffect } from "react";
import { FaUserPlus } from "react-icons/fa";
import PageHeader from "../components/PageHeader";
import FilterBar from "../components/FilterBar";
import CustomerForm from "../components/CustomerForm";
import CustomerTable from "../components/CustomerTable";
import customersData from "../data/customers";

export default function Customers() {
    const [customers, setCustomers] = useState(customersData);
    const [showForm, setShowForm] = useState(false);
    
    // Search & Filter State
    const [searchQuery, setSearchQuery] = useState("");
    const [filterLoyalty, setFilterLoyalty] = useState("All");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [formData, setFormData] = useState({
        customerName: "",
        email: "",
        phone: "",
        loyalty: "Bronze"
    });

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filterLoyalty]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newCustomer = {
            customerId: `CUST0${customers.length + 1}`,
            customerName: formData.customerName,
            email: formData.email,
            phone: formData.phone,
            loyalty: formData.loyalty
        };
        setCustomers([newCustomer, ...customers]);
        setShowForm(false);
        setFormData({ customerName: "", email: "", phone: "", loyalty: "Bronze" });
    }

    const filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              customer.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterLoyalty === "All" || customer.loyalty === filterLoyalty;
        return matchesSearch && matchesFilter;
    });

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
    const currentCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-8 bg-[#F9F7F5] min-h-screen font-poppins">
            {/* HEADER SECTION */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-stone-800">Daftar Pelanggan</h1>
                    <p className="text-sm text-stone-400 font-medium">Manajemen data pasangan pengantin</p>
                </div>
                <button 
                    onClick={() => setShowForm(true)}
                    className="bg-[#10B981] hover:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl shadow-md shadow-emerald-100 transition-all flex items-center gap-2 text-sm"
                >
                    <FaUserPlus /> Tambah Pelanggan
                </button>
            </div>

            <CustomerForm 
              show={showForm} 
              onClose={() => setShowForm(false)} 
              formData={formData} 
              setFormData={setFormData}
              onSubmit={handleSubmit}
            />

            <FilterBar 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterLoyalty={filterLoyalty}
              setFilterLoyalty={setFilterLoyalty}
            />

            <CustomerTable 
              currentCustomers={currentCustomers}
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevPage={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              onNextPage={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            />
        </div>
    );
}