import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { islogedin, handlelogOut } = useLogin();

  return (
    <nav className="bg-white sticky top-0 shadow-md p-4 z-50">
  <div className="max-w-7xl mx-auto flex justify-between items-center">
    <Link
      to="/"
      className="text-2xl font-bold text-blue-600 tracking-tight hover:opacity-90 transition"
    >
      🛍 E-Commerce
    </Link>

    <div className="flex items-center gap-6">
      <Link
        to="/"
        className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
      >
        Home
      </Link>

      {islogedin ? (
        <ProfileMenu />
      ) : (
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="text-gray-700 hover:text-blue-600 text-sm font-medium transition-colors"
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
