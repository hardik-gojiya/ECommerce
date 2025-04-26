import { useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";
import { useLoading } from "../../context/LoadingContext";

export default function Register() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { setLoading } = useLoading();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    address: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const validatePassword = (password) => {
    const lengthCheck = password.length >= 8;
    const uppercaseCheck = /[A-Z]/.test(password);
    const lowercaseCheck = /[a-z]/.test(password);
    const numberCheck = /[0-9]/.test(password);
    const specialCharCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      lengthCheck,
      uppercaseCheck,
      lowercaseCheck,
      numberCheck,
      specialCharCheck,
      isValid:
        lengthCheck &&
        uppercaseCheck &&
        lowercaseCheck &&
        numberCheck &&
        specialCharCheck,
    };
  };
  const passwordRules = validatePassword(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordRules.isValid) {
      showError("Password does not meet the required criteria.");
      return;
    }
    try {
      setLoading(true);
      const res = await api.post("/user/register", formData);
      showSuccess(res?.data?.message || "Registered successfully");
      navigate("/login");
    } catch (error) {
      showError(error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Register</h2>

        {["name", "email", "phone", "address", "password"].map((field) => (
          <input
            key={field}
            type={field === "password" ? "password" : "text"}
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            className="w-full p-2 border rounded"
            onChange={handleChange}
            required
          />
        ))}

        <ul className="text-sm text-gray-600 space-y-1 mt-2">
          <h3>Password Validation : </h3>
          <li
            className={
              passwordRules.lengthCheck ? "text-green-600" : "text-red-600"
            }
          >
            • At least 8 characters
          </li>
          <li
            className={
              passwordRules.uppercaseCheck ? "text-green-600" : "text-red-600"
            }
          >
            • At least one uppercase letter
          </li>
          <li
            className={
              passwordRules.lowercaseCheck ? "text-green-600" : "text-red-600"
            }
          >
            • At least one lowercase letter
          </li>
          <li
            className={
              passwordRules.numberCheck ? "text-green-600" : "text-red-600"
            }
          >
            • At least one number
          </li>
          <li
            className={
              passwordRules.specialCharCheck ? "text-green-600" : "text-red-600"
            }
          >
            • At least one special character
          </li>
        </ul>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
