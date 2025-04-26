import { Link, useNavigate } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import ProfileMenu from "./ProfileMenu";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { islogedin } = useLogin();
  const navigate = useNavigate();
  const { getCartItemsCount } = useCart();

  return (
    <nav className="bg-[#fefefe] shadow-md sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold text-[#00b894] tracking-tight hover:opacity-80 transition"
        >
          🛍 E-Shop
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-sm font-medium text-[#2b2d42] hover:text-[#00b894] transition"
          >
            Home
          </Link>

          {/* Cart Icon */}

          {islogedin ? (
            <>
              <div className="relative">
                <button
                  onClick={() => {
                    navigate("/profile#cart");
                  }}
                  className="text-[#2b2d42] hover:text-[#00b894] transition"
                  aria-label="cart"
                  title="Go to Cart"
                >
                  <FaShoppingCart className="w-5 h-5" />
                  {getCartItemsCount() > 0 && (
                    <span className="absolute -top-2  -right-2 bg-transparent backdrop-blur-2xl rounded-full px-1.5 py-0.5 text-xs font-semibold shadow-md">
                      {getCartItemsCount()}
                    </span>
                  )}
                </button>
              </div>
              <ProfileMenu />
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-[#2b2d42] hover:text-[#00b894] transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium text-white bg-[#00b894] px-4 py-1.5 rounded-lg hover:bg-[#019170] transition"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
