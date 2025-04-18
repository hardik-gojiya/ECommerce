import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../context/ToastContext";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [dummyProducts, setDummyProducts] = useState([]);
  const { showError } = useToast();

  const fetchHomeProducts = async () => {
    try {
      let res = await api.get("/products/getAllProducts");
      setDummyProducts(res?.data.products || []);
    } catch (error) {
      showError(error?.response?.data?.error || "error to fetch categories");
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/getCategories");
      setCategories(res.data.catagories);
    } catch (error) {
      showError("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHomeProducts();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-blue-50 rounded-xl p-8 text-center shadow-md mb-12">
        <h1 className="text-4xl font-extrabold mb-2 text-blue-700">
          Welcome to E-Commerce Store
        </h1>
        <p className="text-gray-600 mb-6">
          Shop the latest trends at unbeatable prices!
        </p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Browse Products
        </Link>
      </div>

      {/* Categories Section */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
        {categories &&
          categories.map((category) => (
            <Link
              to={`/category/${category._id}`}
              key={category._id}
              className="group block bg-white rounded-xl shadow-md hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <div className="p-6 text-center">
                <i
                  className={`fas fa-${category.icon} text-5xl text-blue-600 group-hover:text-blue-700 transition`}
                ></i>
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition mt-3">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
      </div>

      {/* Featured Products Section */}
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {dummyProducts
          .slice()
          .reverse()
          .map((product) => (
            <Link
              to={`/product/${product._id}`}
              key={product._id}
              className="border rounded-lg p-6 shadow hover:shadow-lg transition bg-white"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover mb-6 rounded-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800">
                {product.name}
              </h3>
              <p className="text-blue-600 font-semibold">{product.price}</p>
              <button className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300">
                Add to Cart
              </button>
            </Link>
          ))}
      </div>
    </div>
  );
}
