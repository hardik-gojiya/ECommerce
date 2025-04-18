import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../../components/Loader";

export default function AddProduct() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [categoryForD, setCategoryForD] = useState(null);

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
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    try {
      setLoading(true);
      const res = await api.post("/products/addproduct", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert(res.data.message || "Product added successfully!");

      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setImage(null);
      setPreviewUrl(null);
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.error ||
          "Something went wrong while adding the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading && <Loader />}
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border rounded"
          placeholder="Product description"
        ></textarea>

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 border rounded"
          required
          min="0"
        />

        <div className="space-y-2">
          <label className="block font-semibold">Choose Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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

          <label className="block font-semibold">Or Enter New Category</label>
          <input
            type="text"
            placeholder="Enter custom category"
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border rounded"
            value={category}
          />
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full p-3 border rounded"
          required
        />

        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="mt-4 w-40 h-40 object-cover rounded"
          />
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
