import { Link } from "react-router-dom";

const products = [
  {
    id: 1,
    name: "Gaming Mouse",
    price: "₹1,499",
    image: "https://via.placeholder.com/200x200?text=Mouse",
  },
  {
    id: 2,
    name: "Mechanical Keyboard",
    price: "₹2,899",
    image: "https://via.placeholder.com/200x200?text=Keyboard",
  },
  {
    id: 3,
    name: "Smartphone Stand",
    price: "₹399",
    image: "https://via.placeholder.com/200x200?text=Stand",
  },
  {
    id: 4,
    name: "Bluetooth Speaker",
    price: "₹1,199",
    image: "https://via.placeholder.com/200x200?text=Speaker",
  },
];

export default function Products() {
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-xl p-4 shadow hover:shadow-md transition"
          >
            <Link to={`/product/${product.id}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover mb-4 rounded"
              />
            </Link>

            <h3 className="text-lg font-medium">{product.name}</h3>
            <p className="text-blue-600 font-semibold">{product.price}</p>
            <button className="mt-2 px-4 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
