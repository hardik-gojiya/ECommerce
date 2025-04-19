import React from "react";
import { Link } from "react-router-dom";

function OrderDetailsPage({ setshowselctedOrder, order }) {
  if (!order)
    return (
      <div className="text-center py-10 text-gray-600">
        No order data found.
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-10 mt-10 bg-white rounded-xl shadow-xl relative">
      {/* Close Button */}
      <button
        onClick={() => setshowselctedOrder(null)}
        className="sticky top-20 left-full text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Close
      </button>

      <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">
        Order Details
      </h2>

      {/* Shipping Address */}
      <div className="space-y-2 border-b pb-4">
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
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-gray-700">Order Summary</h3>
        <p>
          <span className="font-medium">Order ID:</span> {order._id}
        </p>
        <p>
          <span className="font-medium">Total Amount:</span> ₹
          {order.totalAmount}
        </p>
        <p>
          <span className="font-medium">Status:</span> {order.status}
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
  );
}

export default OrderDetailsPage;
