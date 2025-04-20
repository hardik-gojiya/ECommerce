import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-[#f9fdfa] border-t border-gray-200 text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-[#00b894] mb-3 block hover:opacity-90 transition"
          >
            🛍 E-Commerce
          </Link>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your favorite destination for stylish, high-quality products at the best prices.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-[#00b894] transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" className="hover:text-[#00b894] transition-colors">
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-[#00b894] transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-[#00b894] transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Contact</h4>
          <p className="text-sm">✉️ support@ecommerce.com</p>
          <p className="text-sm">📞 +91 98765 43210</p>
          <p className="text-sm">📍 Mumbai, India</p>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="text-lg font-semibold mb-3 text-gray-800">Follow Us</h4>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="hover:text-[#3b5998] transition">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-[#E1306C] transition">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-[#1DA1F2] transition">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-[#0077B5] transition">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="bg-[#f0fdfc] text-center py-4 text-sm text-gray-600">
        © {new Date().getFullYear()} <span className="text-[#00b894] font-semibold">E-Commerce</span>. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
