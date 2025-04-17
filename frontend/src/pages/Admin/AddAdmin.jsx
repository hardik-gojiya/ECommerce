import React, { useState } from "react";
import { useToast } from "../../context/ToastContext";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function AddAdmin() {
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res = await api.post(`/user/add-new-admin`, {
        email,
        name,
        password,
        phone,
      });
      showSuccess(res.data.message || "admin added");
      setEmail("");
      setName("");
      setPassword("");
      setPhone("");
    } catch (error) {
      showError(
        error?.response?.data?.error || "somee error occures to add admin"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader />}
      <h2 className="text-2xl font-semibold mb-4">Add Admin</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <input
          type="tel"
          placeholder="mobile no"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Admin
        </button>
      </form>
    </div>
  );
}
