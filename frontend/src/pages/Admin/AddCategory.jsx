import React, { useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useLoading } from "../../context/LoadingContext";

export default function AddCategory() {
  const { setLoading } = useLoading();
  const [name, setName] = useState("");
  const { showError, showSuccess } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await api.post("/category/addCategory", { name });
      showSuccess(res.data.message || "Category added successfully!");
      setName("");
    } catch (error) {
      showError(error?.response.data.error || "Error adding category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Category
        </button>
      </form>
    </div>
  );
}
