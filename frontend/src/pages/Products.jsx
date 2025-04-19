import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import Loader from "../components/Loader";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      let res = await api.get("/products/getAllProducts");
      setProducts(res?.data?.products || []);
    } catch (error) {
      showError(error?.response?.data?.error || "error to fetch products");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const addToCartHandle = async (id) => {
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

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {loading && <Loader />}
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
          .slice()
          .reverse()
          .map((product) => (
            <div
              key={product._id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
              </Link>

              <h3 className="text-lg font-medium">{product.name}</h3>
              <p className="text-blue-600 font-semibold">₹{product.price}</p>
              <button
                onClick={() => addToCartHandle(product._id)}
                className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
