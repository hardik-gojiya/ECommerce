import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { useLogin } from "../context/LoginContext";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { useLoading } from "../context/LoadingContext";

function PasswordChangeCard() {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const { setLoading } = useLoading();
  const { userId } = useLogin();
  const [newpassword, setNewPassword] = useState("");
  const [newconfirmpassword, setNewconfirmPassword] = useState("");
  const [oldpassword, setOldPassword] = useState("");

  const handleChangePass = async (e) => {
    e.preventDefault();

    if (newpassword !== newconfirmpassword) {
      showError("New password and confirm password do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post(`/user/update-profile-password/${userId}`, {
        oldpassword,
        newpassword,
      });
      showSuccess(res.data.message || "pasword change sucessfully");
      setNewPassword("");
      setNewconfirmPassword("");
      setOldPassword("");
      navigate("/profile");
    } catch (error) {
      showError(error?.response?.data?.error || "Error updating password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Change Password
        </h1>
        <form onSubmit={handleChangePass} className="space-y-4">
          <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
            new password
          </label>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
            confirm new password
          </label>
          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newconfirmpassword}
            onChange={(e) => setNewconfirmPassword(e.target.value)}
            required
          />
          <label className="block text-sm font-medium mb-2 text-gray-700 capitalize">
            old password
          </label>
          <input
            type="password"
            placeholder="Enter old password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={oldpassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition duration-200"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default PasswordChangeCard;
