import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { useLogin } from "../../context/LoginContext";
import { useToast } from "../../context/ToastContext";
import { useLoading } from "../../context/LoadingContext";
import EditProductCard from "./EditProductCard";

export default function DeleteProduct() {
  const [products, setProducts] = useState([]);
  const { setLoading } = useLoading();
  const { userId } = useLogin();
  const { showSuccess, showError } = useToast();
  const [EditProduct, setEditProduct] = useState(null);
  const [searchid, setSearchid] = useState("");

  const fetchProducts = async () => {
    try {
      let res = await api.get("/products/getAllProducts");
      setProducts(res.data.products);
    } catch (error) {
      if (error.response) {
        showError(
          `Error: ${error?.response?.data?.error || "Failed to fetch products"}`
        );
      } else {
        showError("An error occurred while fetching products.");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("are you sure you want to delete this product")) {
      try {
        setLoading(true);
        let res = await api.delete(`/products/deleteProduct/${id}`);
        showSuccess(res.data.message || "Product deleted successfully!");
        fetchProducts();
      } catch (error) {
        showError(error?.response?.data.error || "Error deleting product.");
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredProducts = products.filter((product) =>
    product._id.includes(searchid)
  );

  const handleEdit = async (product) => {
    setEditProduct(product);
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <input
        type="text"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        value={searchid}
        onChange={(e) => setSearchid(e.target.value)}
        placeholder="search product by id"
      />
      {EditProduct && (
        <EditProductCard
          product={EditProduct}
          setEditProduct={setEditProduct}
        />
      )}
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts
          .slice()
          .reverse()
          .map((product) => (
            <div
              key={product._id}
              className="border rounded-xl p-4 shadow hover:shadow-md transition"
            >
              <Link to={`/product/${product._id}`}>
                <img
                  src={product.image[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-medium">{product.name}</h3>
                <p className="text-lg md:text-2xl mt-1">
                  {product.discount > 0 ? (
                    <>
                      <span className="text-blue-500 font-bold mr-2">
                        ₹{parseInt(product.finalPrice)}
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
                  <span className="text-sm text-gray-500 font-normal">
                    {" "}
                    / item
                  </span>
                </p>
              </Link>

              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(product)}
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
            </div>
          ))}
      </div>
    </div>
  );
}
