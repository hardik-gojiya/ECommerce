import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Profile from "./pages/Profile";
import CategoryProducts from "./pages/CategoryProducts";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { useLogin } from "./context/LoginContext";
import Footer from "./components/Footer";
import OrderDetailsPage from "./pages/Orders/OrderDetailsPage";
import PasswordChangeCard from "./components/PasswordChangeCard";
import AllOrderofOneUser from "./pages/Orders/AllOrderofOneUser";

function App() {
  const { role: userrole } = useLogin();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all-orders-of-user" element={<AllOrderofOneUser />} />
        <Route path="/category/:id" element={<CategoryProducts />} />
        <Route path="/orderdetail/:id" element={<OrderDetailsPage />} />
        <Route path="/updatepassword" element={<PasswordChangeCard />} />

        {/* Admin Routes */}
        {userrole === "admin" || userrole === "master admin" ? (
          <Route path="/admin/*" element={<AdminDashboard />}></Route>
        ) : null}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
