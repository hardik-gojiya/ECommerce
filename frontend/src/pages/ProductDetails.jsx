import { useParams } from "react-router-dom";
import api from "../services/api";
import { useState, useEffect } from "react";
import Loader from "../components/Loader";
import { useToast } from "../context/ToastContext";

export default function ProductDetails() {
  const { showSuccess, showError } = useToast();

  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const addtoCartHandle = async (id) => {
    try {
      setLoading(true);
      let res = await api.post(`/cart/addToCart`, {
        productid: id,
        quantity: 1,
      });
      showSuccess(res.data.message);
    } catch (error) {
      showError(error?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };
  const fetchOneProduct = async () => {
    try {
      const res = await api.get(`/products/getProductById/${id}`);
      setProduct(res.data.product || []);
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  };
  const buyProductHandle = async (id) => {
    alert(id);
  };

  useEffect(() => {
    fetchOneProduct();
  }, [id]);

  if (!product) {
    return <p className="text-center mt-10 text-red-500">Product not found.</p>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
      {loading && <Loader />}
      <img
        src={product.image}
        alt={product.name}
        className="w-full md:w-1/2 object-cover rounded-lg shadow"
      />
      <div className="flex flex-col justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">
            {product.name}
          </h2>
          <p className="text-xl text-blue-600 font-semibold mb-2">
            ₹{product.price}
          </p>
          <p className="text-gray-600 mb-4 dark:text-gray-300">
            {product.description}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Category:{" "}
            <span className="font-medium text-gray-700 dark:text-white">
              {product.category?.name || "Unknown"}
            </span>
          </p>
        </div>
        <button
          onClick={() => addtoCartHandle(product._id)}
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add to Cart
        </button>
        <button
          onClick={() => buyProductHandle(product._id)}
          className="mt-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Buy
        </button>
      </div>
    </div>
  );
}
