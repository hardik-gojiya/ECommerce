import React, { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api.js";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState(null);
  const { showError, showSuccess } = useToast();

  const fetchOrders = async () => {
    try {
      let res = await api.get(`/order/getAllOrderforAdmin`);
      setOrders(res.data);
    } catch (error) {
      showError(error?.response?.data?.error || "Failed to fetch orders");
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/order/changeStatusofOrderByAdmin`, {
        orderid: orderId,
        status: newStatus,
      });
      showSuccess("Order status updated");
      fetchOrders();
    } catch (error) {
      showError(error?.response?.data?.error || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = () => {
    if (!orders) return [];
    return orders.filter((order) => order._id.includes(orderId));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-200 text-yellow-800";
      case "Shipped":
        return "bg-blue-200 text-blue-800";
      case "Delivered":
        return "bg-green-200 text-green-800";
      case "Cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-full">
      <h2 className="text-2xl font-semibold mb-4">Track Orders</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />
      </div>

      {orders && orders.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {filteredOrders()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="border border-gray-300 p-5 rounded shadow-md bg-white"
              >
                <h3 className="font-bold mb-2 text-indigo-700">
                  Order ID: {order._id}
                </h3>

                <div className="mb-2">
                  <p>
                    <strong>User Name:</strong> {order.user?.name || "N/A"}
                  </p>
                  <p>
                    <strong>User Email:</strong> {order.user?.email || "N/A"}
                  </p>
                  <p>
                    <strong>User ID:</strong> {order.user?._id}
                  </p>
                  <p>
                    <strong>Phone:</strong> {order.user?.phone}
                  </p>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                  <strong>Status:</strong>
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className="border border-gray-300 rounded p-1 ml-2"
                  >
                    <option value="Processing">Processing</option>
                    <option value="Placed">Placed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <p>
                  <strong>Total Amount:</strong> ₹{order.totalAmount}
                </p>
                <p>
                  <strong>Payment Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Is Paid:</strong> {order.ispaid ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Is Delivered:</strong>{" "}
                  {order.status === "Delivered" ? "Yes" : "No"}
                </p>

                <div className="mt-3">
                  <h4 className="font-semibold">Shipping Address:</h4>
                  <p>{order.shippingAdress?.name}</p>
                  <p>{order.shippingAdress?.street}</p>
                  <p>
                    {order.shippingAdress?.city}, {order.shippingAdress?.state}
                  </p>
                  <p>{order.shippingAdress?.postalCode}</p>
                  <p>{order.shippingAdress?.country}</p>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold mb-1">Items:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        {item.product?.name || "Product"} - ₹
                        {item.product?.price} × {item.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      )}

      {orders?.length === 0 && (
        <p className="mt-6 text-gray-500">No orders found.</p>
      )}
    </div>
  );
}
