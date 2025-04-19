import React, { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api.js";

export default function OrderTracking() {
  const [orderId, setOrderId] = useState("");
  const [orders, setOrders] = useState(null);
  const { showError } = useToast();

  const handleTrack = () => {
    // API to get order tracking
    alert(`Tracking order: ${orderId}`);
  };

  useEffect(() => {
    const getAllOrderForAdmin = async () => {
      try {
        let res = await api.get(`/order/getAllOrderforAdmin`);
        setOrders(res.data);

        if (!res) {
          showError("error to fetch all orders for admin");
        }
      } catch (error) {
        showError(error?.response?.data?.error);
      }
    };
    getAllOrderForAdmin();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Track Orders</h2>
      <div className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
        />
        <button
          onClick={handleTrack}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Track Order
        </button>
      </div>
      {orders && orders.length > 0 && (
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {[...orders].reverse().map((order) => (
            <div
              key={order._id}
              className="border border-gray-300 p-5 rounded shadow-md bg-white "
            >
              <h3 className="text-xl font-bold mb-2">Order ID: {order._id}</h3>

              <p>
                <strong>User ID:</strong> {order.user}
              </p>
              <p>
                <strong>Status:</strong> {order.status}
              </p>
              <p>
                <strong>Total Amount:</strong> ₹{order.totalAmount}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
              <p>
                <strong>Is Paid:</strong> {order.isPaid ? "Yes" : "No"}
              </p>
              <p>
                <strong>Is Delivered:</strong>{" "}
                {order.isDelivered ? "Yes" : "No"}
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
                <p>
                  <strong>Phone:</strong> {order.shippingAdress?.phone}
                </p>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold mb-1">Items:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {order.items.map((item, idx) => (
                    <li key={idx}>
                      {item.product?.name || "Product"} - ₹{item.product?.price}{" "}
                      × {item.quantity}
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
