import { createContext, useContext, useEffect, useState } from "react";
import { useLogin } from "./LoginContext";
import api from "../services/api";
import { useToast } from "./ToastContext";
import { useLoading } from "./LoadingContext";
import { useNavigate } from "react-router-dom";

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const navigate = useNavigate();
  const { userId } = useLogin();
  const { showSuccess, showError } = useToast();
  const { setLoading } = useLoading();
  const [cartItems, setCartItems] = useState([]);

  const fetchUserCart = async () => {
    try {
      const res = await api.get(`/cart/getCart/${userId}`);
      if (!res) {
        return;
      }
      setCartItems(res.data.cart.items || []);
    } catch (error) {
      console.log(error?.response?.data?.error || "Failed to fetch cart");
    }
  };

  const addtoCartHandle = async (e, id, quantity) => {
    e.preventDefault();
    if (!quantity) {
      quantity = 1;
    }

    try {
      setLoading(true);
      const res = await api.post(`/cart/addToCart`, {
        productid: id,
        quantity: quantity,
      });
      fetchUserCart();
      showSuccess(
        <div>
          <p>{res.data.message || "Product added successfully!"}</p>
          <button
            className="text-blue-700 underline text-sm hover:text-blue-900"
            onClick={() => {
              navigate("/profile#cart");
            }}
          >
            Go to Cart
          </button>
        </div>
      );
    } catch (error) {
      showError(error?.response?.data?.error || "Failed to add to cart");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = async (id) => {
    try {
      let res = await api.post(`/cart/addToCart`, {
        productid: id,
        quantity: 1,
      });
      fetchUserCart();
    } catch (error) {
      showError(error?.response?.data?.error || "error to increase quantity");
    }
  };

  const decreaseQuantity = async (id) => {
    try {
      let res = await api.delete(`/cart/decreseQunatityOfProductbyOne/${id}`);
      // showSuccess(res.data.message || "decreasse successfully");
      fetchUserCart();
    } catch (error) {
      showError(error?.response?.data?.error || "error to decreasse quantity");
    }
  };

  const removeItem = async (productid) => {
    try {
      if (!window.confirm("Are you sure you want to empty the cart?")) {
        return;
      }
      setLoading(true);
      let res = await api.delete(`/cart/removeItemFromCart/${productid}`);
      showSuccess(res.data.message);
      fetchUserCart();
    } catch (error) {
      showError(error?.response?.data?.error || "error to remove item");
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  const getCartItemsCount = () => cartItems.length;

  const emptyCart = async () => {
    try {
      if (!window.confirm("Are you sure you want to empty the cart?")) {
        return;
      }
      setLoading(true);
      let res = await api.delete(`/cart/emptyCart/${userId}`);
      showSuccess(res.data.message || "Cart emptied successfully");
      fetchUserCart();
    } catch (error) {
      showError(error?.response?.data?.error || "error to empty cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserCart();
    }
    getCartItemsCount();
  }, [userId]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        getCartTotal,
        getCartItemsCount,
        emptyCart,
        addtoCartHandle,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
