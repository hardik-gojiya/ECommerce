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
import { useLogin } from "./context/LoginContext";

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
        <Route path="/product/:id" element={<ProductDetails />} />
        {userrole === "admin" ||
          (userrole === "master admin" && (
            <Route path="/AdminDashboard" element={<AdminDashboard />} />
          ))}
      </Routes>
    </Router>
  );
}

export default App;
