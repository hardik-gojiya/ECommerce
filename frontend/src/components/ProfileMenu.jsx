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

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative " ref={menuRef}>
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
          <div className="w-10 h-10 rounded-full bg-gray-500 text-white flex items-center justify-center">
            {name?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </button>

      {open && (
        <div
          onClick={() => {
            setOpen(!open);
          }}
          className="absolute right-0 mt-2 w-40  bg-white text-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-lg z-50"
        >
          <button
            onClick={handleProfile}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 dark:hover:bg-red-600 dark:hover:text-white"
          >
            Logout
          </button>
          {userrole === "admin" ||
            (userrole === "master admin" && (
              <Link
                to="/AdminDashboard"
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Admin DashBoard
              </Link>
            ))}
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
