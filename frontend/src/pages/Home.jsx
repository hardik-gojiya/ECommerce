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
      const res = await api.get("/products/getAllProducts");
      setDummyProducts(res?.data.products || []);
    } catch (error) {
      showError(error?.response?.data?.error || "Error fetching products");
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/getCategories");
      setCategories(res.data.catagories);
    } catch (error) {
      showError("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHomeProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-400 text-white p-12 rounded-3xl text-center shadow-xl mb-16">
        <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
          Discover Your Style
        </h1>
        <p className="text-xl font-light mb-6">
          Explore trendy collections and unbeatable prices.
        </p>
        <Link
          to="/products"
          className="bg-white text-purple-600 font-bold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
        >
          Shop Now
        </Link>
      </div>

      {/* Categories */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10 relative inline-block before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-16 before:h-1 before:bg-purple-600">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              to={`/category/${category._id}`}
              key={category._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <i
                  className={`fas fa-${category.icon} text-purple-600 text-2xl`}
                ></i>
              </div>
              <h3 className="text-md font-semibold text-gray-700">
                {category.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12 relative inline-block before:absolute before:-bottom-2 before:left-1/2 before:-translate-x-1/2 before:w-20 before:h-1 before:bg-pink-500">
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
                className="relative bg-white rounded-2xl shadow-md hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                {/* New Badge */}
                <span className="absolute top-3 left-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10 shadow">
                  NEW
                </span>

                {/* Product Image with Hover Zoom */}
                <div className="overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4 flex flex-col justify-between h-48">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {product.name}
                    </h3>
                    <p className="text-pink-600 font-bold text-lg mt-1">
                      ₹ {product.price}
                    </p>
                  </div>
                  <button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium px-4 py-2 rounded-xl hover:opacity-90 transition">
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
