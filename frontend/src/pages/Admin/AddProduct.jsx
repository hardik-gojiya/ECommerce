import React, { useEffect, useRef, useState } from "react";
import api from "../../services/api";
import { useLoading } from "../../context/LoadingContext";

export default function AddProduct() {
  const { loading, setLoading } = useLoading();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState(0);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [image, setImage] = useState([]);
  const [categoryForD, setCategoryForD] = useState(null);
  const [subcategoryForD, setSubCategoryForD] = useState(null);
  const fileInputRef = useRef();

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

  const handleClickDropZone = () => {
    fileInputRef.current.click(); // open file explorer
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImage((prev) => [...prev, ...files]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    );
    setImage((prev) => [...prev, ...files]);
  };

  const handleRemoveImage = (index) => {
    setImage((prev) => prev.filter((_, i) => i !== index));
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
    formData.append("subCategory", subCategory);
    for (let i = 0; i < image.length; i++) {
      formData.append("image", image[i]);
    }

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

  const fetchSubCategory = async () => {
    try {
      const res = await api.get(`/category/getSubCategoriesbyname/${category}`);
      setSubCategoryForD(res.data.subCategories);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };
  useEffect(() => {
    fetchSubCategory();
  }, [category]);
  console.log(subcategoryForD);

  return (
    <div>
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
        <input
          type="number"
          placeholder="discount"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-3 border rounded"
        />

        {/* category */}
        <div className="space-y-2">
          <label className="block font-semibold">Choose Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value), fetchSubCategory();
            }}
            className="w-full p-3 border rounded"
          >
            <option value="">Select from list</option>
            {categoryForD &&
              categoryForD.map((cat, idx) => (
                <option key={idx} value={cat.name}>
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

        {/*sub category */}
        <div className="space-y-2">
          <label className="block font-semibold">Choose Sub Category</label>
          <select
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full p-3 border rounded"
          >
            <option value="">Select from list</option>
            {subcategoryForD &&
              subcategoryForD.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
          </select>

          <label className="block font-semibold">
            Or Enter New Sub Category
          </label>
          <input
            type="text"
            placeholder="Enter custom category"
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full p-3 border rounded"
            value={subCategory}
          />
        </div>

        <div
          onClick={handleClickDropZone}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-dashed border-4 border-gray-400 rounded-lg p-6 text-center mb-4 cursor-pointer hover:bg-gray-100"
        >
          <p className="text-gray-600">Click or drag and drop images here</p>

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {image?.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {image?.map((img, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    className="w-full h-32 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(idx);
                    }}
                    className="absolute  top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700"
                  >
                    ❌
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
