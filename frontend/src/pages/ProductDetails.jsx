import { useParams } from "react-router-dom";
import api from "../services/api";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";
import OrderPage from "./Orders/OrderPage";

export default function ProductDetails() {
  const { showSuccess, showError } = useToast();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const addtoCartHandle = async (id) => {
    try {
      setLoading(true);
      const res = await api.post(`/cart/addToCart`, {
        productid: id,
        quantity: 1,
      });
      showSuccess(res.data.message);
    } catch (error) {
      showError(error?.response?.data?.error || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const fetchOneProduct = async () => {
    try {
      const res = await api.get(`/products/getProductById/${id}`);
      setProduct(res.data.product || null);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };

  const buyProductHandle = async (id) => {
    setShowOrderModal(true);
  };
  const handlePlaceOneProductOrder = async (shippingInfo) => {
    if (window.confirm("are you sure you want to place this order")) {
      try {
        setLoading(true);
        let res = await api.post(
          `/order/createOrderforOneProduct/${product._id}`,
          { shippingAdress: shippingInfo, quantity }
        );
        showSuccess(res.data.message);
        setShowOrderModal(false);
      } catch (error) {
        showError(error?.response?.data?.error || "error to place order");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOneProduct();
  }, [id]);

  if (loading) return <Loader />;

  if (!product) {
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Product not found.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-10 items-start">
        <div className="w-full md:w-1/2">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-auto object-cover rounded-xl shadow-md"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {product.name}
            </h1>
            <div className="space-y-1 mb-2">
              <p className="text-2xl font-semibold text-blue-600">
                ₹{product.price}{" "}
                <span className="text-sm text-gray-600">per item</span>
              </p>
            </div>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
            <p className="text-sm text-gray-600 mt-3">
              Category:{" "}
              <span className="font-medium text-gray-800">
                {product.category?.name || "Unknown"}
              </span>
            </p>
          </div>
          <div className="flex space-x-3 mt-3">
            <button
              disabled={quantity === 1}
              onClick={() => setQuantity(quantity - 1)}
              className="text-sm px-3 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
            >
              -
            </button>
            <span className="font-medium text-gray-800">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="text-sm px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              +
            </button>
            {quantity > 1 && (
              <p className="text-lg font-medium text-gray-800">
                Total:{" "}
                <span className="text-green-600 font-bold">
                  ₹{product.price * quantity}
                </span>
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              disabled={loading}
              onClick={() => addtoCartHandle(product._id)}
              className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition font-semibold disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={() => buyProductHandle(product._id)}
              className="px-6 py-2 rounded-xl bg-green-600 text-white hover:bg-green-700 transition font-semibold"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
      {showOrderModal && (
        <OrderPage
          setShowOrderModal={setShowOrderModal}
          handlePlaceOrder={handlePlaceOneProductOrder}
        />
      )}
    </div>
  );
}
