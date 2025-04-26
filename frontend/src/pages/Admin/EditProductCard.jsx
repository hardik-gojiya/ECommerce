import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useLoading } from "../../context/LoadingContext";

function EditProductCard({ product, setEditProduct }) {
  const { setLoading } = useLoading();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState(product.price);
  const [discount, setDiscount] = useState(product.discount);
  const [category, setCategory] = useState(product.category?.name);
  const [brand, setBrand] = useState(product.brand);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("brand", brand);
    formData.append("discount", discount);
    formData.append("category", category);

    try {
      setLoading(true);
      const res = await api.put(
        `/products/updateProduct/${product._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(res.data.message || "Product edited successfully!");
      setEditProduct(null);
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.error ||
          "Something went wrong while editing the product."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-20  w-1/2 bg-transparent backdrop-blur-2xl">
      <div className=" bg-white p-5 border-2 rounded-xl ">
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

          {/* <div
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
        </div> */}
          <button
            onClick={() => setEditProduct(null)}
            className="bg-gray-300 mr-5 px-4 py-2 rounded hover:bg-gray-500 transition"
          >
            cancle
          </button>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Update Product
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProductCard;
