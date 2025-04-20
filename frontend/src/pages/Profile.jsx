import { useEffect, useState } from "react";
import { useLogin } from "../context/LoginContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { Link } from "react-router-dom";
import OrderPage from "./Orders/OrderPage";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { userId, name, email, phone, address } = useLogin();
  const { showSuccess, showError } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    setUser({ name, email, phone, address });
  }, [name, email, phone, address]);

  const fetchUserCart = async () => {
    try {
      const res = await api.get(`/cart/getCart/${userId}`);
      if (!res) {
        return;
      }
      setCartItems(res.data.cart.items || []);
    } catch (error) {
      console.log(error?.response?.data?.error || "Failed to fetch cart");
    }
  };

  const fetchAllOrderOfUser = async () => {
    try {
      let res = await api.get(`/order/getAllOrderOfUser/${userId}`);
      setOrders(res.data.orders || []);
    } catch (error) {
      return;
    }
  };

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await api.put(`/user/edit-user-profile/${userId}`, user);
      showSuccess(res.data.message);
    } catch (error) {
      showError(error?.response.data.error);
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (id) => {
    try {
      let res = await api.post(`/cart/addToCart`, {
        productid: id,
        quantity: 1,
      });
      fetchUserCart();
    } catch (error) {
      showError(error?.response?.data?.error || "error to increase quantity");
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      let res = await api.delete(`/cart/decreseQunatityOfProductbyOne/${id}`);
      // showSuccess(res.data.message || "decreasse successfully");
      fetchUserCart();
    } catch (error) {
      showError(error?.response?.data?.error || "error to decreasse quantity");
    }
  };

  const removeItem = async (productid) => {
    try {
      let res = await api.delete(`/cart/removeItemFromCart/${productid}`);
      showSuccess(res.data.message);
      fetchUserCart();
    } catch (error) {
      showError(error?.response?.data?.error || "error to remove item");
    }
  };

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  useEffect(() => {
    if (userId) {
      fetchUserCart(), fetchAllOrderOfUser();
    }
  }, [userId]);

  const buyCart = () => {
    setShowOrderModal(true);
  };

  const handlePlaceCartOrder = async (shippingInfo) => {
    if (window.confirm("are you sure want to place order?")) {
      try {
        let res = await api.post(`/order/createOrderforCart`, {
          shippingAdress: shippingInfo,
        });
        showSuccess(res?.data.message);
        setShowOrderModal(false);
      } catch (error) {
        showError(error?.response?.data.error || "error to place your order");
      }
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Sticky Section Navigation */}
        <div className="sticky top-14 z-10 bg-gradient-to-r from-indigo-50 to-purple-100 border-b py-4 flex gap-8 justify-center text-indigo-700 font-bold shadow-md">
          <a
            href="#updateprofile"
            className="hover:underline hover:text-indigo-900 transition"
          >
            Profile
          </a>
          <a
            href="#cart"
            className="hover:underline hover:text-indigo-900 transition"
          >
            Cart
          </a>
          <a
            href="#order"
            className="hover:underline hover:text-indigo-900 transition"
          >
            Orders
          </a>
        </div>

        {/* Profile Form */}
        <div
          className="bg-gradient-to-tr from-pink-100 to-yellow-100 rounded-2xl shadow-2xl p-10 scroll-mt-24"
          id="updateprofile"
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center text-purple-800 border-b-2 border-purple-300 pb-2">
            ✨ Profile Settings
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {["name", "email", "phone"].map((field) => (
              <div key={field}>
                <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
                  {field}
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={user[field]}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">
                Address
              </label>
              <textarea
                name="address"
                value={user.address}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-semibold shadow-lg transition-all duration-300"
            >
              Update Profile
            </button>
          </form>
        </div>

        {/* Cart Section */}
        <div
          className="bg-gradient-to-br from-indigo-50 via-pink-50 to-yellow-100 rounded-2xl shadow-xl p-10 scroll-mt-24"
          id="cart"
        >
          <h2 className="text-3xl font-extrabold mb-8 text-center text-indigo-700 border-b-2 border-indigo-200 pb-2">
            🛒 Your Cart
          </h2>
          {cartItems.length === 0 ? (
            <p className="text-center text-gray-600">Your cart is empty.</p>
          ) : (
            <div className="space-y-6">
              {cartItems
                .filter((item) => item.product)
                .map((item) => (
                  <div
                    key={item.product._id}
                    className="flex flex-col md:flex-row items-center md:items-start justify-between border-b pb-4 gap-4 bg-white rounded-xl p-4 shadow-sm"
                  >
                    <Link to={`/product/${item.product._id}`}>
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-xl"
                      />
                    </Link>
                    <div className="flex-1 md:ml-6 w-full">
                      <h4 className="text-lg font-bold text-indigo-800">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        ₹{item.product.price} × {item.quantity}
                      </p>
                      <div className="flex space-x-3 mt-3">
                        <button
                          disabled={item.quantity === 1}
                          onClick={() => decreaseQuantity(item.product._id)}
                          className="text-sm px-3 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
                        >
                          -
                        </button>
                        <button
                          onClick={() => increaseQuantity(item.product._id)}
                          className="text-sm px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            removeItem(item.product._id.toString())
                          }
                          className="text-sm px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <p className="text-md font-semibold text-indigo-600 whitespace-nowrap">
                      ₹{item.product.price * item.quantity}
                    </p>
                  </div>
                ))}
              <div className="text-right font-bold text-lg mt-6 text-indigo-800">
                Total: ₹{getCartTotal()}
              </div>
            </div>
          )}
          {cartItems.length > 0 && (
            <div className="text-right mt-6">
              <button
                onClick={buyCart}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Buy Cart"}
              </button>
            </div>
          )}
        </div>

        {/* Orders Section */}
        <div
          className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 scroll-mt-24 w-full max-w-4xl mx-auto"
          id="order"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-4">
            Your Orders
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
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
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
                        <span className="text-green-600">
                          ₹{order.totalAmount}
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
            </div>
          )}
        </div>

        {/* Order Modal */}
        {showOrderModal && (
          <OrderPage
            setShowOrderModal={setShowOrderModal}
            handlePlaceOrder={handlePlaceCartOrder}
          />
        )}
      </div>
    </>
  );
}
