import React, { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useLoading } from "../../context/LoadingContext";

function EditProductCard({ product, setEditProduct }) {
  const { setLoading } = useLoading();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [discount, setDiscount] = useState(product.discount);
  const [category, setCategory] = useState(product.category?.name || "");
  const [brand, setBrand] = useState(product.brand);
  const [existingImages, setExistingImages] = useState(product.image || []);
  const [newImages, setNewImages] = useState([]);
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
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
  };

  const handleRemoveExistingImage = (idx) => {
    setExistingImages((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleRemoveNewImage = (idx) => {
    setNewImages((prev) => prev.filter((_, index) => index !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("discount", discount);
    formData.append("category", category);

    existingImages.forEach((img) => {
      formData.append("existingImages", img);
    });

    newImages.forEach((img) => {
      formData.append("image", img);
    });

    try {
      setLoading(true);
      const res = await api.put(
        `/products/updateProduct/${product._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(res.data.message || "Product edited successfully!");
      setEditProduct(null);
    } catch (error) {
      console.error(error);
      alert(
        error?.response?.data?.error ||
          "Something went wrong while editing the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-5 bg-transparent backdrop-blur-2xl">
      <div className="bg-white p-6 border-2 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Edit Product</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Fields */}
          <div>
            <label className="block font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 border rounded"
              required
            />
          </div>

          <div>
            <label className="block font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border rounded"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 border rounded"
                required
              />
            </div>
            <div>
              <label className="block font-semibold">Discount</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full p-3 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold">Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="block font-semibold">Choose Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded"
            >
              <option value="">Select from list</option>
              {categoryForD?.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>

            <label className="block font-semibold">Or Enter New Category</label>
            <input
              type="text"
              placeholder="Custom category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block font-semibold mb-2">
              Upload New Image(s)
            </label>
            <div
              onClick={() => fileInputRef.current.click()}
              className="border-dashed border-4 border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-100"
            >
              <p className="text-gray-600">
                Click to select or drag and drop images
              </p>
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>

          {/* Preview Section */}
          {(existingImages.length > 0 || newImages.length > 0) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {existingImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={img}
                    alt={`existing-${idx}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}

              {newImages.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`new-${idx}`}
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(idx)}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={() => setEditProduct(null)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProductCard;
