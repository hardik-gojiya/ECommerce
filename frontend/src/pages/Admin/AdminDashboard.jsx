import React, { useState } from "react";
import {
  FaBars,
  FaUserCog,
  FaBox,
  FaClipboardList,
  FaPlusCircle,
} from "react-icons/fa";
import { ImCross } from "react-icons/im";
import AddProduct from "./AddProduct";
import DeleteProduct from "./DeleteProduct";
import AddCategory from "./AddCategory";
import AddAdmin from "./AddAdmin";
import OrderTracking from "./OrderTracking";
import { useLogin } from "../../context/LoginContext";
import { useToast } from "../../context/ToastContext";

function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("addProduct");
  const [showSidebar, setShowSidebar] = useState(false);
  const { role: userrole } = useLogin();

  const handleNav = () => setShowSidebar(!showSidebar);

  return (
    <div className="flex flex-col md:flex-row min-h-screen ">
      {/* Mobile Nav Toggle */}
      <div className="bg-blue-900 text-white md:hidden p-4 flex justify-between items-center sticky top-20">
        <h1 className="text-xl font-bold">Admin Dashboard</h1>
        <button onClick={handleNav} className="text-white z-21 text-2xl">
          {showSidebar ? <ImCross /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-blue-900  w-full md:w-64 text-white p-5 space-y-6 absolute  md:relative z-20 transition-transform duration-300 ease-in-out ${
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <ul className="space-y-6">
          <li>
            <button
              onClick={() => {
                setActiveSection("addProduct");
                setShowSidebar(false);
              }}
              className="flex items-center space-x-3 hover:bg-blue-700 p-3 rounded w-full"
            >
              <FaPlusCircle /> <span>Add Product</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setActiveSection("deleteProduct");
                setShowSidebar(false);
              }}
              className="flex items-center space-x-3 hover:bg-blue-700 p-3 rounded w-full"
            >
              <FaBox /> <span>Delete Product</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => {
                setActiveSection("addCategory");
                setShowSidebar(false);
              }}
              className="flex items-center space-x-3 hover:bg-blue-700 p-3 rounded w-full"
            >
              <FaClipboardList /> <span>Add Category</span>
            </button>
          </li>
          {userrole === "master admin" && (
            <li>
              <button
                onClick={() => {
                  setActiveSection("addAdmin");
                  setShowSidebar(false);
                }}
                className="flex items-center space-x-3 hover:bg-blue-700 p-3 rounded w-full"
              >
                <FaUserCog /> <span>Add Admin</span>
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => {
                setActiveSection("orderTracking");
                setShowSidebar(false);
              }}
              className="flex items-center space-x-3 hover:bg-blue-700 p-3 rounded w-full"
            >
              <FaClipboardList /> <span>Track Orders</span>
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 mt-4 h-[700px] overflow-y-scroll">
        {activeSection === "addProduct" && <AddProduct />}
        {activeSection === "deleteProduct" && <DeleteProduct />}
        {activeSection === "addCategory" && <AddCategory />}
        {activeSection === "addAdmin" && <AddAdmin />}
        {activeSection === "orderTracking" && <OrderTracking />}
      </div>
    </div>
  );
}

export default AdminDashboard;
