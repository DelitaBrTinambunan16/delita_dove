

export default function OrderRow({ order }) {
  const cleanId = order.orderId.replace(/\D/g, "");

  return (
    <tr className="hover:bg-gray-50/50 transition group">
      <td className="py-3.5 text-xs font-bold text-gray-400">
        #{cleanId}
      </td>
      <td className="py-3.5 text-xs font-bold text-gray-800">
        {order.customerName}
      </td>
      <td className="py-3.5 text-xs text-gray-400">
        {order.orderDate}
      </td>
      <td className="py-3.5">
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-wider ${statusStyle[order.status]}`}>
          {order.status.toUpperCase()}
        </span>
      </td>
      <td className="py-3.5 text-xs font-bold text-gray-700">
        {fmtRupiah(order.totalPrice)}
      </td>
    </tr>
  );
}