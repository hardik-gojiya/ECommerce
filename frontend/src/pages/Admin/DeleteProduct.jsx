import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import Loader from "../../components/Loader";
import { useLogin } from "../../context/LoginContext";
import { useToast } from "../../context/ToastContext";

export default function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userId } = useLogin();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let res = await api.get("/products/getAllProducts");
        setProducts(res.data.products);
      } catch (error) {
        if (error.response) {
          showError(
            `Error: ${
              error.response.data.message || "Failed to fetch products"
            }`
          );
        } else {
          showError("An error occurred while fetching products.");
        }
      }
    };
    fetchProducts();
  }, [products]);

  const handleDelete = async (id) => {
    if (window.confirm("are you sure you want to delete this product")) {
      try {
        setLoading(true);
        let res = await api.delete(`/products/deleteProduct/${id}`);
        showSuccess(res.data.message || "Product deleted successfully!");
      } catch (error) {
        showError(error?.response?.data.error || "Error deleting product.");
      } finally {
        setLoading(false);
      }
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
              <p className="text-blue-600 font-semibold">{product.price}</p>

              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete Product
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}
