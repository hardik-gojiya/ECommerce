import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [dummyProducts, setDummyProducts] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/getCategories");
      setCategories(res.data.catagories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchHomeProducts = async () => {
    try {
      let res = await api.get("/products/getAllProducts");
      setDummyProducts(res.data.products || []);
    } catch (error) {
      alert(error?.res.error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchHomeProducts();
  }, []);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-blue-50 rounded-xl p-6 text-center shadow-sm mb-10">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">
          Welcome to E-Commerce Store
        </h1>
        <p className="text-gray-600 mb-4">
          Shop the latest trends at the best prices!
        </p>
        <Link
          to="/products"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Browse Products
        </Link>
      </div>

      {/* Categories */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Shop by Category
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
        {categories &&
          categories.map((category) => (
            <Link
              to={`/category/${category._id}`}
              key={category._id}
              className="group block bg-white rounded-lg shadow-md hover:shadow-lg transition"
            >
              <div className="p-3 text-center">
                {/* Font Awesome Icon */}
                <i
                  className={`fas fa-${category.icon} text-4xl text-blue-600 group-hover:text-blue-700 transition`}
                ></i>
                <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition mt-2">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
      </div>

      {/* Featured Products */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Featured Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dummyProducts.map((product) => (
          <Link
            to={`/product/${product._id}`}
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-40 object-cover mb-4 rounded"
            />
            <h3 className="text-lg font-medium text-gray-800">
              {product.name}
            </h3>
            <p className="text-blue-600 font-semibold">{product.price}</p>
            <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Add to Cart
            </button>
          </Link>
        ))}
      </div>
    </div>
  );
}
