import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";
import { useLoading } from "../../context/LoadingContext";

export default function AddCategory() {
  const { setLoading } = useLoading();
  const [name, setName] = useState("");
  const [categoryname, setCategoryname] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const { showError, showSuccess } = useToast();
  const [categoryForD, setCategoryForD] = useState(null);

  const handleSubmitforCategory = async (e) => {
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

  const handleSubmitforSubCategory = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let res = await api.post("/category/addSubCategories", {
        categoryname,
        subCategory,
      });
      showSuccess(res.data.message || "Sub Category added successfully!");
      setName("");
    } catch (error) {
      showError(error?.response.data.error || "Error adding category.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/category/getCategories");
      setCategoryForD(res.data.catagories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [categoryForD]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Add Category</h2>
      <form onSubmit={handleSubmitforCategory} className="space-y-4">
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

      <h2 className="text-2xl font-bold mt-4 mb-4">Add Sub-Category</h2>
      <form onSubmit={handleSubmitforSubCategory} className="space-y-4">
        <label className="block font-semibold">Choose Category</label>
        <select
          value={categoryname}
          onChange={(e) => setCategoryname(e.target.value)}
          className="w-full p-3 border rounded"
        >
          <option value="">Select from list</option>
          {categoryForD &&
            categoryForD.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Category Name"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          className="w-full p-3 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Sub-Category
        </button>
      </form>
    </div>
  );
}
