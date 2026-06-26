export default function OrdersTable({ currentOrders, currentPage, totalPages, filteredOrdersLength, itemsPerPage, onPrevPage, onNextPage, getPaket }) {
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50">
            <tr>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Pasangan</th>
              <th className="px-6 py-4 font-semibold">Tanggal</th>
              <th className="px-6 py-4 font-semibold">Venue</th>
              <th className="px-6 py-4 font-semibold">Paket</th>
              <th className="px-6 py-4 font-semibold">Telepon</th>
              <th className="px-6 py-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {currentOrders.length > 0 ? (
              currentOrders.map((item) => {
                const idNum = parseInt(item.orderId.replace(/\D/g, '')) || 1;
                const phoneRepeated = idNum.toString().repeat(4).substring(0, 4);
                const phoneFormatted = `+62 812-${phoneRepeated}-${phoneRepeated}`;
                const derivedVenue = item.totalPrice >= 4000000 ? "Garden Paradise" : (item.totalPrice >= 2500000 ? "Grand Ballroom" : "Cozy Intimate");
                const venue = item.venue || derivedVenue;

                return (
                  <tr key={item.orderId} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5 font-semibold text-gray-500">#{idNum}</td>
                    <td className="px-6 py-5 font-medium text-gray-800">{item.customerName}</td>
                    <td className="px-6 py-5 text-gray-500">{item.orderDate}</td>
                    <td className="px-6 py-5 text-gray-500">{venue}</td>
                    <td className="px-6 py-5 text-gray-500">{getPaket(item.totalPrice)}</td>
                    <td className="px-6 py-5 font-medium text-gray-500">{phoneFormatted}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        item.status === 'Completed' ? 'bg-green-100 text-green-600'
                        : item.status === 'Pending' ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                      }`}>
                        {item.status === 'Completed' ? 'Confirmed' : item.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data pesanan yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {filteredOrdersLength > 0 && (
        <div className="p-4 border-t border-gray-50 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
          <span className="text-sm text-gray-500">
            Menampilkan {(currentPage - 1) * itemsPerPage + 1} hingga {Math.min(currentPage * itemsPerPage, filteredOrdersLength)} dari {filteredOrdersLength} pesanan
          </span>
          <div className="flex space-x-2">
            <button 
              onClick={onPrevPage}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Sebelumnya
            </button>
            <button 
              onClick={onNextPage}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </>
  );
}
