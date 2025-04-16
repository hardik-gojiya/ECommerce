import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../context/LoginContext";
import ProfileMenu from "./ProfileMenu";

export default function Navbar() {
  const { islogedin, handlelogOut } = useLogin();
  

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-bold text-blue-600 dark:text-white"
        >
          🛍 E-Commerce
        </Link>

        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
          >
            Home
          </Link>
          {islogedin ? (
            <ProfileMenu />
          ) : (
            <div>
              <Link
                to="/login"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-white transition"
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
