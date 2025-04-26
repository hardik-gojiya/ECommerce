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
    <div className="max-w-4xl mx-auto p-6 mt-12 bg-white rounded-2xl shadow-2xl space-y-10 relative">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
        Order Details
      </h2>

      {/* User Description */}
      {order?.userDescription && (
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-1">User Description</h3>
          <p className="text-gray-600">{order.userDescription}</p>
        </div>
      )}

      {/* Shipping Address */}
      <div
        className={`p-5 rounded-xl border shadow-sm ${
          order.status === "Processing"
            ? "bg-teal-50 border-teal-300 text-teal-700"
            : order.status === "Shipped"
            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
            : order.status === "Delivered"
            ? "bg-slate-100 border-slate-300 text-slate-700"
            : order.status === "Cancelled"
            ? "bg-rose-100 border-rose-300 text-rose-700"
            : "bg-gray-50 border-gray-300 text-gray-700"
        }`}
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Shipping Address
        </h3>
        <div className="space-y-1 text-gray-700">
          <p>
            <span className="font-medium">Street:</span>{" "}
            {order.shippingAdress.street}
          </p>
          <p>
            <span className="font-medium">City:</span>{" "}
            {order.shippingAdress.city}
          </p>
          <p>
            <span className="font-medium">State:</span>{" "}
            {order.shippingAdress.state}
          </p>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Ordered Items
        </h3>
        {order.items.map((item) => (
          <Link
            to={`/product/${item.product._id}`}
            key={item._id}
            className="flex items-center gap-4 border rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div className="flex-1">
              <p className="text-lg font-semibold text-gray-900">
                {item.product.name}
              </p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {item.product.description}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                ₹{item.product.price} × {item.quantity}
              </p>
            </div>
            <p className="font-semibold text-blue-600 text-lg whitespace-nowrap">
              ₹{item.product.price * item.quantity}
            </p>
          </Link>
        ))}
      </div>

      {/* Order Summary */}
      <div
        className={`p-5 rounded-xl border shadow-sm ${
          order.status === "Processing"
            ? "bg-teal-50 border-teal-300 text-teal-700"
            : order.status === "Shipped"
            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
            : order.status === "Delivered"
            ? "bg-slate-100 border-slate-300 text-slate-700"
            : order.status === "Cancelled"
            ? "bg-rose-100 border-rose-300 text-rose-700"
            : "bg-gray-50 border-gray-300 text-gray-700"
        }`}
      >
        <h3 className="text-2xl font-semibold text-gray-800 mb-3">
          Order Summary
        </h3>
        <div className="space-y-1 text-gray-700">
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
              className={`capitalize font-medium ${
                order.status === "Processing"
                  ? "text-teal-700"
                  : order.status === "Shipped"
                  ? "text-indigo-700"
                  : order.status === "Delivered"
                  ? "text-slate-700"
                  : order.status === "Cancelled"
                  ? "text-rose-700"
                  : "text-gray-700"
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
      </div>

      {/* Cancel Button */}
      {(order.status === "Processing" ||
        order.status === "Placed" ||
        order.status === "Shipped") && (
        <div className="text-center">
          <button
            onClick={() => cancleOrder()}
            className="text-sm px-5 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );
}

export default OrderDetailsPage;
