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
  const [categoryImg, setCategoryImg] = useState(null);

  const handleSubmitforCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("categoryImg", categoryImg);
    try {
      setLoading(true);
      let res = await api.post("/category/addCategory", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      showSuccess(res.data.message || "Category added successfully!");
      setName("");
      setCategoryImg(null);
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
      {/* Add Category */}
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Category</h2>

        <form onSubmit={handleSubmitforCategory} className="space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Category Image */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setCategoryImg(e.target.files[0])}
              className="w-full p-2 border rounded-lg bg-gray-50"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* Add Sub-Category */}
      <div className="bg-white shadow-md rounded-xl p-8 max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Add Sub-Category
        </h2>

        <form onSubmit={handleSubmitforSubCategory} className="space-y-5">
          {/* Choose Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Choose Category
            </label>
            <select
              value={categoryname}
              onChange={(e) => setCategoryname(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select from list</option>
              {categoryForD &&
                categoryForD.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Sub-Category Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Sub-Category Name
            </label>
            <input
              type="text"
              placeholder="Enter Sub-Category Name"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Add Sub-Category
          </button>
        </form>
      </div>

      {/* All categories  */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mt-4 mb-8 text-center">
          All Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {categoryForD?.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center hover:shadow-lg transition-all duration-300"
            >
              {/* Category Name */}
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {cat.name}
              </h3>

              {/* Subcategories */}
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {Array.isArray(cat.subCategories) &&
                cat.subCategories.length > 0 ? (
                  cat.subCategories.map((sub, idx) => (
                    <span
                      key={idx}
                      className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {sub}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400 text-sm">
                    No Subcategories
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="bg-blue-100 text-blue-600 font-medium px-4 py-2 rounded-full text-sm hover:bg-blue-200 transition">
                  Edit
                </button>
                <button className="bg-red-100 text-red-600 font-medium px-4 py-2 rounded-full text-sm hover:bg-red-200 transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
