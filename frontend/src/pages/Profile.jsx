import { useEffect, useState } from "react";
import { useLogin } from "../context/LoginContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

export default function Profile() {
  const [loading, setLoading] = useState(false);
  const { userId, name, email, phone, address } = useLogin();
  const { showSuccess, showError } = useToast();
  const [cartItems, setCartItems] = useState([]);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        const res = await api.get(`/cart/getCart/${userId}`);
        console.log(res);
        setCartItems(res.data.cart.items || []);
      } catch (error) {
        showError(error?.response?.data?.status || "Failed to fetch cart");
      }
    };

    if (userId) fetchUserCart();
  }, [userId]);

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

  const increaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };
  const buyCart = () => {
    // You can replace this with API call to backend
    const confirmBuy = window.confirm(
      "Are you sure you want to buy all items?"
    );
    if (confirmBuy) {
      console.log("Purchasing the cart:", cartItems);
      alert("Thank you for your purchase!");
      setCartItems([]); // Clear the cart
    }
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getCartTotal = () =>
    cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 space-y-10">
      {/* Profile Form */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full p-2 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Phone
            </label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full p-2 rounded border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Address
            </label>
            <textarea
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full p-2 rounded border"
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Update Profile
          </button>
        </form>
      </div>

      {/* Cart Section */}
      <div className="bg-white rounded-xl shadow p-6" id="cart">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Your Cart
        </h2>
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.product._id}
                className="flex items-center justify-between border-b pb-3"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 ml-4">
                  <h4 className="text-lg font-medium text-gray-800">
                    {item.product.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ₹{item.product.price} × {item.quantity}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => decreaseQuantity(item.product._id)}
                      className="text-sm px-2 py-1 bg-yellow-400 text-white rounded"
                    >
                      -
                    </button>
                    <button
                      onClick={() => increaseQuantity(item.product._id)}
                      className="text-sm px-2 py-1 bg-green-500 text-white rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-sm px-2 py-1 bg-red-500 text-white rounded"
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
            <div className="text-right font-bold text-lg mt-4 text-gray-800">
              Total: ₹{getCartTotal()}
            </div>
          </div>
        )}
        {cartItems.length > 0 && (
          <div className="text-right mt-6">
            <button
              onClick={buyCart}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg font-medium"
            >
              Buy Cart
            </button>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <div className="bg-white rounded-xl shadow p-6" id="order">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Your Orders
        </h2>
        {orders.length === 0 ? (
          <p className="text-center text-gray-600">You have no orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.orderId}
                className="border rounded p-4 bg-gray-50 space-y-2"
              >
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
                <div className="flex justify-between mt-2 font-semibold text-gray-800">
                  <span>Status: {order.status}</span>
                  <span>Total: ₹{order.total}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
