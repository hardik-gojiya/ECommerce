import { useParams } from "react-router-dom";
import api from "../services/api";
import { useState, useEffect } from "react";
import { useToast } from "../context/ToastContext";
import OrderPage from "./Orders/OrderPage";
import { useCart } from "../context/CartContext";
import { useLoading } from "../context/LoadingContext";
import { useLogin } from "../context/LoginContext";
import EditProductCard from "./Admin/EditProductCard";

export default function ProductDetails() {
  const { role: userrole } = useLogin();
  const { showSuccess, showError } = useToast();
  const { loading, setLoading } = useLoading();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { addtoCartHandle } = useCart();
  const [currIndImg, setCurrIndImg] = useState(0);
  const [editProduct, setEditProduct] = useState(null);

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

  const handlePlaceOneProductOrder = async (shippingInfo, userDescription) => {
    if (window.confirm("are you sure you want to place this order")) {
      try {
        setLoading(true);
        let res = await api.post(
          `/order/createOrderforOneProduct/${product._id}`,
          { shippingAdress: shippingInfo, quantity, userDescription }
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

  const changeImage = () => {
    currIndImg === product.image.length - 1
      ? setCurrIndImg(0)
      : setCurrIndImg(currIndImg + 1);
  };

  if (!product) {
    return (
      <p className="text-center mt-10 text-red-500 text-lg">
        Product not found.
      </p>
    );
  }

  const handleDelete = async (id) => {
    if (window.confirm("are you sure you want to delete this product")) {
      try {
        setLoading(true);
        let res = await api.delete(`/products/deleteProduct/${id}`);
        showSuccess(res.data.message || "Product deleted successfully!");
        fetchOneProduct();
      } catch (error) {
        showError(error?.response?.data.error || "Error deleting product.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 md:gap-12">
        {/* Image Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center gap-4">
          <div className="w-full overflow-hidden rounded-2xl shadow-lg">
            <img
              src={product.image[currIndImg]}
              alt={product.name}
              className="w-full h-[300px] md:h-[400px] object-contain transition-all duration-300"
            />
          </div>
          {product.image.length > 1 && (
            <button
              onClick={changeImage}
              className="px-4 py-1 rounded-md bg-gray-200 hover:bg-gray-300 transition"
            >
              Next Image &rarr;
            </button>
          )}
        </div>

        {/* Info Section */}
        <div className="w-full md:w-1/2 space-y-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.name}
            </h1>
            <p className="text-lg md:text-2xl mt-1">
              {product.discount > 0 ? (
                <>
                  <span className="text-blue-500 font-bold mr-2">
                    ₹{product.finalPrice}
                  </span>
                  <span className="line-through text-gray-500 text-base">
                    ₹{product.price}
                  </span>
                  <span className="ml-2 text-green-600 text-sm font-medium">
                    ({product.discount}% OFF)
                  </span>
                </>
              ) : (
                <span className="text-blue-600 font-semibold">
                  ₹{product.price}
                </span>
              )}
              <span className="text-sm text-gray-500 font-normal"> / item</span>
            </p>
            <p className="text-gray-700 mt-4">{product.description}</p>
            <p className="text-sm text-gray-500 mt-3">
              Category:{" "}
              <span className="text-gray-800 font-medium">
                {product.category?.name || "Unknown"}
              </span>
            </p>
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-4">
            <button
              disabled={quantity === 1}
              onClick={() => setQuantity(quantity - 1)}
              className="px-3 py-1 rounded-md bg-yellow-400 text-white hover:bg-yellow-500 transition disabled:opacity-50"
            >
              -
            </button>
            <span className="text-lg font-medium text-gray-800">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 rounded-md bg-green-500 text-white hover:bg-green-600 transition"
            >
              +
            </button>
          </div>

          {/* Total if > 1 */}
          {quantity > 1 && (
            <p className="text-base font-medium text-gray-800">
              Total:{" "}
              <span className="text-green-600 font-bold">
                ₹{product.finalPrice * quantity}
              </span>
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-4">
            <button
              disabled={loading}
              onClick={(e) => addtoCartHandle(e, product._id, quantity)}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium transition disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              onClick={() => buyProductHandle(product._id)}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 font-medium transition"
            >
              Buy Now
            </button>
          </div>
          {userrole != "user" && (
            <div className="flex justify-between">
              <button
                onClick={() => setEditProduct(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showOrderModal && (
        <OrderPage
          setShowOrderModal={setShowOrderModal}
          handlePlaceOrder={handlePlaceOneProductOrder}
        />
      )}

      {editProduct && (
        <EditProductCard
          product={editProduct}
          setEditProduct={setEditProduct}
        />
      )}
    </div>
  );
}
