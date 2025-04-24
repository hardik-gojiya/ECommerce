import React, { use, useEffect, useState } from "react";
import { useLogin } from "../../context/LoginContext";
import api from "../../services/api";
import { Link } from "react-router-dom";

function AllOrderofOneUser() {
  const [orders, setOrders] = useState([]);
  const { userId } = useLogin();

  const fetchAllOrderOfUser = async () => {
    try {
      let res = await api.get(`/order/getAllOrderOfUser/${userId}`);
      setOrders(res.data.orders || []);
    } catch (error) {
      return;
    }
  };
  useEffect(() => {
    fetchAllOrderOfUser();
  }, [userId]);

  return (
    <div
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8 scroll-mt-24"
      id="order"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 border-b pb-4 mb-6">
        📦 Your Orders
      </h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500 text-base">
          You have no orders yet.
        </p>
      ) : (
        <div className="space-y-6">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <Link
                to={`/orderdetail/${order._id}`}
                key={order._id}
                className={`block border border-gray-200 rounded-xl p-5 sm:p-6 ${
                  order.status === "pending"
                    ? "bg-yellow-100 hover:bg-yellow-200"
                    : order.status === "shipped"
                    ? "bg-blue-100 hover:bg-blue-200"
                    : order.status === "delivered"
                    ? "bg-green-100 hover:bg-green-200"
                    : "bg-gray-50 hover:shadow-md"
                } transition-all duration-200 space-y-4`}
              >
                {/* Order ID and Date */}
                <div className="flex flex-col sm:flex-row justify-between text-sm sm:text-base text-gray-700 font-medium gap-1 sm:gap-0">
                  <span className="break-all">Order ID: {order._id}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>

                {/* Item List */}
                <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                  {order.items.map((item, index) => (
                    <li key={index}>
                      <span className="font-medium text-gray-800">
                        {item.product.name}
                      </span>{" "}
                      × {item.quantity}
                    </li>
                  ))}
                </ul>

                {/* Status and Total */}
                <div className="flex flex-col sm:flex-row justify-between mt-2 text-sm sm:text-base font-semibold text-gray-800 gap-1 sm:gap-0">
                  <span>
                    Status:{" "}
                    <span
                      className={`capitalize ${
                        order.status === "Processing"
                          ? "text-yellow-600"
                          : order.status === "Shipped"
                          ? "text-blue-600"
                          : order.status === "Delivered"
                          ? "text-green-600"
                          : order.status === "Cancelled"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {order.status}
                    </span>
                  </span>
                  <span>
                    Total:{" "}
                    <span className="text-green-600">₹{order.totalAmount}</span>
                  </span>
                </div>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

export default AllOrderofOneUser;
