import { useEffect, useState } from "react";
import { useLogin } from "../context/LoginContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { Link } from "react-router-dom";
import OrderPage from "./OrderPage";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { userId, name, email, phone, address } = useLogin();
  const { showSuccess, showError } = useToast();
  const [cartItems, setCartItems] = useState([]);
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

  const [orders] = useState([
    {
      orderId: "ORD123",
      date: "2024-04-01",
      items: [
        { name: "Laptop", quantity: 1 },
        { name: "Mouse Pad", quantity: 2 },
      ],
      total: 55000,
      status: "Delivered",
    },
    {
      orderId: "ORD124",
      date: "2024-04-01",
      items: [
        { name: "Laptop", quantity: 1 },
        { name: "Mouse Pad", quantity: 2 },
      ],
      total: 55000,
      status: "Delivered",
    },
  ]);

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
    } catch (error) {
      showError(error?.response?.data?.error || "error to increase quantity");
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      let res = await api.delete(`/cart/decreseQunatityOfProductbyOne/${id}`);
      // showSuccess(res.data.message || "decreasse successfully");
    } catch (error) {
      showError(error?.response?.data?.error || "error to decreasse quantity");
    }
  };

  const buyCart = () => {
    setShowOrderModal(true);
  };

  const removeItem = async (productid) => {
    try {
      let res = await api.delete(`/cart/removeItemFromCart/${productid}`);
      showSuccess(res.data.message);
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
    const fetchUserCart = async () => {
      try {
        const res = await api.get(`/cart/getCart/${userId}`);
        setCartItems(res.data.cart.items || []);
      } catch (error) {
        showError(error?.response?.data?.status || "Failed to fetch cart");
      }
    };

    if (userId) fetchUserCart();
  }, [userId, increaseQuantity, decreaseQuantity]);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 space-y-12">
  {/* Profile Form */}
  <div className="bg-white rounded-xl shadow-lg p-8">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
      Profile
    </h2>
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Phone</label>
        <input
          type="text"
          name="phone"
          value={user.phone}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2 text-gray-700">Address</label>
        <textarea
          name="address"
          value={user.address}
          onChange={handleChange}
          className="w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>
      <button
        type="submit"
        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-300"
      >
        Update Profile
      </button>
    </form>
  </div>

  {/* Cart Section */}
  <div className="bg-white rounded-xl shadow-lg p-8" id="cart">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Your Cart</h2>
    {cartItems.length === 0 ? (
      <p className="text-center text-gray-600">Your cart is empty.</p>
    ) : (
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between border-b pb-4">
            <img
              src={item.product.image}
              alt={item.product.name}
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1 ml-6">
              <h4 className="text-lg font-semibold text-gray-800">{item.product.name}</h4>
              <p className="text-sm text-gray-600">₹{item.product.price} × {item.quantity}</p>
              <div className="flex space-x-4 mt-3">
                <button
                  disabled={item.quantity === 1}
                  onClick={() => decreaseQuantity(item.product._id)}
                  className="text-sm px-3 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition"
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
                  onClick={() => removeItem(item.product._id.toString())}
                  className="text-sm px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="text-md font-semibold text-blue-600">
              ₹{item.product.price * Number(item.quantity)}
            </p>
          </div>
        ))}
        <div className="text-right font-bold text-lg mt-6 text-gray-800">
          Total: ₹{getCartTotal()}
        </div>
      </div>
    )}
    {cartItems.length > 0 && (
      <div className="text-right mt-6">
        <button
          onClick={buyCart}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-all duration-300"
        >
          Buy Cart
        </button>
      </div>
    )}
  </div>

  {/* Orders Section */}
  <div className="bg-white rounded-xl shadow-lg p-8" id="order">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Your Orders</h2>
    {orders.length === 0 ? (
      <p className="text-center text-gray-600">You have no orders yet.</p>
    ) : (
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.orderId} className="border rounded-xl p-6 bg-gray-50 space-y-4">
            <div className="flex justify-between text-sm text-gray-700 font-medium">
              <span>Order ID: {order.orderId}</span>
              <span>{order.date}</span>
            </div>
            <ul className="text-sm text-gray-600 list-disc ml-5">
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.name} × {item.quantity}
                </li>
              ))}
            </ul>
            <div className="flex justify-between mt-4 font-semibold text-gray-800">
              <span>Status: {order.status}</span>
              <span>Total: ₹{order.total}</span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  {showOrderModal && <OrderPage setShowOrderModal={setShowOrderModal} />}
</div>

  );
}
