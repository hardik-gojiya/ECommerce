import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import CategoryProducts from "./pages/CategoryProducts";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AddProduct from "./pages/Admin/AddProduct";
import DeleteProduct from "./pages/Admin/DeleteProduct";
import AddCategory from "./pages/Admin/AddCategory";
import AddAdmin from "./pages/Admin/AddAdmin";
import OrderTracking from "./pages/Admin/OrderTracking";
import { useLogin } from "./context/LoginContext";
import Footer from "./components/Footer";
import OrderDetailsPage from "./pages/Orders/OrderDetailsPage";

function App() {
  const { role: userrole } = useLogin();

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/orderdetail/:id" element={<OrderDetailsPage />} />

        {/* Admin Routes */}
        {userrole === "admin" || userrole === "master admin" ? (
          <Route path="/admin/*" element={<AdminDashboard />}></Route>
        ) : null}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
