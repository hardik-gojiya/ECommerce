import axios from "axios";
import { useToast } from "../context/ToastContext";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  withCredentials: true,
});

export const fetchProducts = async ({ setProducts }) => {
  const { showSuccess, showError } = useToast();

  try {
    let res = await api.get("/products/getAllProducts");
    setProducts(res.data.products || []);
  } catch (error) {
    if (error.response) {
      showError(
        `Error: ${error.response.data.message || "Failed to fetch products"}`
      );
    } else {
      showError("An error occurred while fetching products.");
    }
  }
};

export const fetchOneProduct = async ({ id, setProduct, setLoading }) => {
  try {
    const res = await api.get(`/products/getProductById/${id}`);
    setProduct(res.data.product);
  } catch (error) {
    console.error("Error fetching product:", error);
  } finally {
    setLoading(false);
  }
};

export default api;
