import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";

const CategoryProducts = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await api.get(`/products/fetchProductByCategory/${id}`);
        setProducts(res.data.products);
        setCategoryName(res.data.categoryName || "Category");
      } catch (error) {
        console.error("Error loading category products:", error);
      }
    };

    fetchCategoryProducts();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {categoryName} Products
      </h2>

      {products.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {products
            .slice()
            .reverse()
            .map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition bg-white dark:bg-gray-900"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-4 rounded"
                />
                <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-blue-600 font-semibold">₹{product.price}</p>
                <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  Add to Cart
                </button>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
