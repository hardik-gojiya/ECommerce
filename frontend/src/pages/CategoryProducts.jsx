import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const CategoryProducts = () => {
  const { id } = useParams();
  const { addtoCartHandle } = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");

  const fetchCategoryProducts = async () => {
    try {
      const res = await api.get(`/products/fetchProductByCategory/${id}`);
      setProducts(res.data.products);
    } catch (error) {
      console.error("Error loading category products:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const res = await api.get(`/category/getOneCategories/${id}`);
      setCategory(res.data.category);
    } catch (error) {
      console.error("Error loading category:", error);
    }
  };

  useEffect(() => {
    fetchCategoryProducts();
    fetchCategory();
  }, [id]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
        {category?.name} Products
      </h2>

      {category?.subCategories?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {category.subCategories.map((subCategory, idx) => (
            <Link
              key={idx}
              to={`/SubCategory/${subCategory}`}
              className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full hover:bg-blue-200 transition"
            >
              {subCategory}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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

                <button
                  onClick={(e) => addtoCartHandle(e, product._id)}
                  className="mt-3 w-full py-2 text-sm bg-[#00b894] text-white rounded-lg hover:bg-[#019875] transition"
                >
                  Add to Cart
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProducts;
