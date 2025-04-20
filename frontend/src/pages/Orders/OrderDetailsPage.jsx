import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";

function OrderDetailsPage() {
  const [order, setOrder] = useState(null);
  const { showError, showSuccess } = useToast();
  const orderid = useParams();

  const fetchOrder = async () => {
    try {
      let res = await api.get(`/order/getorderbyid/${orderid.id}`);
      setOrder(res.data.findOrder);
    } catch (error) {
      showError(error?.response?.data?.error || "Error while fetching order");
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const cancleOrder = async () => {
    if (window.confirm("are you sure you want to cancle order?")) {
      try {
        let res = await api.delete(`/order/cancleOrder/${order._id}`);
        showError(res.data.message);
        fetchOrder();
      } catch (error) {
        showError(
          error?.response?.data?.error || "Error while canceling order"
        );
      }
    }
  };

  if (!order)
    return (
      <div className="text-center py-10 text-gray-600">
        No order data found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 mt-10 bg-white rounded-xl shadow-xl relative">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Order Details
      </h2>

      {/* Shipping Address */}
      <div
        className={`space-y-2 border-b p-4 ${
          order.status === "Processing"
            ? "bg-yellow-50 border-yellow-300"
            : order.status === "Shipped"
            ? "bg-blue-50 border-blue-300"
            : order.status === "Delivered"
            ? "bg-green-50 border-green-300"
            : order.status === "Cancelled"
            ? "bg-red-200 text-red-800"
            : "bg-gray-50 border-gray-300"
        }`}
      >
        <h3 className="text-xl font-semibold text-gray-700">
          Shipping Address
        </h3>
        <p>
          <span className="font-medium">Street:</span>{" "}
          {order.shippingAdress.street}
        </p>
        <p>
          <span className="font-medium">City:</span> {order.shippingAdress.city}
        </p>
        <p>
          <span className="font-medium">State:</span>{" "}
          {order.shippingAdress.state}
        </p>
      </div>

      {/* Order Items */}
      <div className="space-y-4 border-b pb-4">
        <h3 className="text-xl font-semibold text-gray-700">Ordered Items</h3>
        {order.items.map((item) => (
          <Link
            to={`/product/${item.product._id}`}
            key={item._id}
            className="flex items-center space-x-4 border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-800">
                {item.product.name}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.product.description}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                ₹{item.product.price} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-blue-600 text-lg">
              ₹{item.product.price * item.quantity}
            </p>
          </Link>
        ))}
      </div>

      {/* Order Summary */}
      <div
        className={`space-y-2 ${
          order.status === "Processing"
            ? "bg-yellow-50 border-yellow-300"
            : order.status === "Shipped"
            ? "bg-blue-50 border-blue-300"
            : order.status === "Delivered"
            ? "bg-green-50 border-green-300"
            : order.status === "Cancelled"
            ? "bg-red-200 text-red-800"
            : "bg-gray-50 border-gray-300"
        } border-b p-4`}
      >
        <h3 className="text-xl font-semibold text-gray-700">Order Summary</h3>
        <p>
          <span className="font-medium">Order ID:</span> {order._id}
        </p>
        <p>
          <span className="font-medium">Total Amount:</span> ₹
          {order.totalAmount}
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`capitalize ${
              order.status === "pending"
                ? "text-yellow-600"
                : order.status === "shipped"
                ? "text-blue-600"
                : order.status === "delivered"
                ? "text-green-600"
                : "text-gray-600"
            }`}
          >
            {order.status}
          </span>
        </p>
        <p>
          <span className="font-medium">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>
        <p>
          <span className="font-medium">Ordered At:</span>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>
      {(order.status === "Processing" || order.status === "Shipped") && (
        <button
          onClick={() => cancleOrder()}
          className="text-sm px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancle order
        </button>
      )}
    </div>
  );
}

export default OrderDetailsPage;
