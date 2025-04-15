import { Products } from "../models/product.model.js";
import { Category } from "../models/Category.model.js";
import {
  deleteFromClodinary,
  uploadOnClodinary,
} from "../utils/Cloudinary.util.js";

const addProduct = async (req, res) => {
  const { name, description, price, category } = req.body;
  const localfilepath = req.file?.path;

  const user = req.user;
  if (user.role != "admin") {
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
    const cloudinaryurl = await uploadOnClodinary(localfilepath);
    if (!cloudinaryurl) {
      return res.status(400).json({ error: "errro while uploading image" });
    }

    const product = new Products({
      name,
      description,
      price,
      image: cloudinaryurl,
      category: findcategory,
    });
    if (!product) {
      return res.status(400).json({ error: "Product added succesfully" });
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
    res.json(products);
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
    res.json(product);
  } catch (error) {
    console.log("error while fatching product by id", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const updateProduct = async (req, res) => {
  const productid = req.params.id;
  const { name, description, price, category } = req.body;
  const newimage = req.file?.path;

  if (req.user.role != "admin") {
    return res.status(400).json({ error: "only admin can update product" });
  }

  try {
    let product = await Products.findById(productid);

    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    if (newimage) {
      let oldimg = product.image;

      let newcloudimgurl = await uploadOnClodinary(newimage);
      if (!newcloudimgurl) {
        return res.status(400).json({ error: "error while upload image" });
      }
      product.image = newcloudimgurl;
      await deleteFromClodinary(oldimg);
    }

    product.name = name;
    product.description = description;
    product.price = price;

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
      .json({ message: "procuct updated sccussesfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const deleteProduct = async (req, res) => {
  const productid = req.params.id;

  const user = req.user;
  if (user.role != "admin") {
    return res.status(400).json({ error: "only admin can delete product" });
  }

  const product = await Products.findByIdAndDelete(productid);
  if (!product) {
    return res.status(404).json({ error: "product not found" });
  }
  return res.status(200).json({ error: "product deleted successfully" });
};

export {
  addProduct,
  fetchAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
