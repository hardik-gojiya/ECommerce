import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

function SubCategoryProducts() {
  const [products, setProducts] = useState([]);
  const { subCategory } = useParams();
  const { addtoCartHandle } = useCart();

  const fetchproducts = async () => {
    try {
      const res = await api.get(
        `/products/fetchProductBySubCategory/${subCategory}`
      );
      setProducts(res.data.products || []);
    } catch (error) {
      showError("Error fetching products");
    }
  };
  useEffect(() => {
    fetchproducts();
  }, [subCategory]);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{subCategory}:</h1>
      {products.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No products found.</p>
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
                          ₹{product.finalPrice}
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
}

export default SubCategoryProducts;
