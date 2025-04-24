import { useState, useRef, useEffect } from "react";
import { useLogin } from "../context/LoginContext";
import { Link, useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const { role: userrole, name, profilepic, handlelogOut } = useLogin();

  const toggleMenu = () => setOpen(!open);

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  const handleProfile = () => {
    navigate("/profile");
    setOpen(false);
  };

  const handleLogout = async () => {
    await handlelogOut();
    navigate("/login");
  };
  const handleOrders = () => {
    navigate("/all-orders-of-user");
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center space-x-2 p-1 rounded-full hover:ring-2 ring-blue-500 transition"
      >
        {profilepic ? (
          <img
            src={profilepic}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          <button
            onClick={handleProfile}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg transition"
          >
            Profile
          </button>
          <button
            onClick={handleOrders}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
          >
            Your Orders
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 transition"
          >
            Logout
          </button>

          {(userrole === "admin" || userrole === "master admin") && (
            <Link
              to="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-b-lg transition"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
