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
      const res = await api.get("/products/getAllProducts");
      setProducts(res?.data?.products || []);
    } catch (error) {
      showError(error?.response?.data?.error || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const addToCartHandle = async (id) => {
    try {
      setLoading(true);
      const res = await api.post("/cart/addToCart", {
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

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {loading && <Loader />}
      <h1 className="text-3xl font-bold mb-8 text-[#00b894]">All Products</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products
          .slice()
          .reverse()
          .map((product) => (
            <div
              key={product._id}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-44 object-cover mb-3 rounded-md"
                />
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.name}
                </h3>
                <p className="text-[#00b894] font-bold mt-1">
                  ₹{product.price}
                </p>
              </Link>

              <button
                onClick={() => addToCartHandle(product._id)}
                className="mt-3 w-full py-2 text-sm bg-[#00b894] text-white rounded-lg hover:bg-[#019875] transition"
              >
                Add to Cart
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
