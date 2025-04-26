import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LoginProvider } from "./context/LoginContext.jsx";
import { ToastProvider } from "./context/ToastContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { LoadingProvider } from "./context/LoadingContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <LoadingProvider>
        <ToastProvider>
          <LoginProvider>
            <CartProvider>
              <App />
            </CartProvider>
          </LoginProvider>
        </ToastProvider>
      </LoadingProvider>
    </BrowserRouter>
  </StrictMode>
);
