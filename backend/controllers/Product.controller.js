import { Products } from "../models/product.model.js";
import { Category } from "../models/Category.model.js";
import {
  deleteFromClodinary,
  uploadOnClodinary,
} from "../utils/Cloudinary.util.js";

const addProduct = async (req, res) => {
  const { name, description, price, discount, category, brand } = req.body;
  const localfiles = req.files;

  if (!name || !description || !price || !category || !req.files) {
    return res.status(400).json({ error: "all fields are require" });
  }

  const user = req.user;
  if (user.role === "user") {
    return res.status(400).json({ error: "only admin can add product" });
  }

  try {
    let findcategory = await Category.findOne({ name: category });

    if (!findcategory) {
      findcategory = new Category({
        name: category,
      });
      await findcategory.save();
    }
    let uploadedImages = [];
    for (const file of localfiles) {
      const cloudinaryurl = await uploadOnClodinary(file.path);
      if (!cloudinaryurl) {
        return res.status(400).json({ error: "errro while uploading image" });
      }
      uploadedImages.push(cloudinaryurl);
    }

    const product = new Products({
      name,
      description,
      price,
      discount,
      brand,
      image: uploadedImages,
      category: findcategory,
    });
    if (!product) {
      return res.status(400).json({ error: "error while adding project" });
    }
    product.save();

    return res
      .status(201)
      .json({ message: "Product added succesfully", product });
  } catch (error) {
    console.log("error while add product", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const products = await Products.find().populate("category");
    res.json({ products: products });
  } catch (error) {
    console.log("error while fatching products", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getProductById = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ error: "Id require" });
  }

  try {
    const product = await Products.findById(id).populate("category");
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
    res.json({ product: product });
  } catch (error) {
    console.log("error while fatching product by id", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const updateProduct = async (req, res) => {
  const productid = req.params.id;
  const {
    name,
    description,
    price,
    category,
    discount,
    brand,
    existingImages,
  } = req.body;

  if (req.user.role === "user") {
    return res.status(400).json({ error: "only admin can update product" });
  }

  try {
    let product = await Products.findById(productid);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    const retainedImages = Array.isArray(existingImages)
      ? existingImages
      : existingImages
      ? [existingImages]
      : [];

    const newUploadUrls = [];
    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const cloudurl = await uploadOnClodinary(file.path);
        if (!cloudurl) {
          return res.status(400).json({ error: "Error while uploading image" });
        }
        newUploadUrls.push(cloudurl);
      }
    }

    const imageToDelete = product.image.filter(
      (url) => !retainedImages.includes(url)
    );
    for (let oldimg of imageToDelete) {
      await deleteFromClodinary(oldimg);
    }

    product.image = [...retainedImages, ...newUploadUrls];

    product.name = name;
    product.description = description;
    product.price = price;
    product.discount = discount;
    product.brand = brand;

    let findcategory = await Category.findOne({ name: category });

    if (!findcategory) {
      findcategory = new Category({
        name: category,
      });
      await findcategory.save();
    }

    product.category = findcategory;
    await product.save();
    return res
      .status(200)
      .json({ message: "product updated sccussesfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  const productid = req.params.id;

  const user = req.user;
  if (user.role === "user") {
    return res.status(400).json({ error: "only admin can delete product" });
  }

  const product = await Products.findByIdAndDelete(productid);
  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }
  return res.status(200).json({ error: "product deleted successfully" });
};

const fetchProductByCategory = async (req, res) => {
  const categoryid = req.params.id;

  let category = await Category.findById(categoryid);
  if (!category) {
    return res.status(404).json({ error: "category not found" });
  }

  let products = await Products.find({ category: category });
  if (!products) {
    return res.json(404).json({ error: "no product found of this category" });
  }
  return res
    .status(200)
    .json({ categoryName: category.name, products: products });
};

export {
  addProduct,
  fetchAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  fetchProductByCategory,
};
