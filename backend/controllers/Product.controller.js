import { Products } from "../models/product.model.js";
import { Category } from "../models/Category.model.js";

const addProduct = async (req, res) => {
  const { name, description, price, category } = req.body;

  const user = req.user;
  if (user.role != "admin") {
    return res.status(400).json({ error: "only admin can add product" });
  }

  try {
    var findcategory = await Category.findOne({ name: category });

    if (!findcategory) {
      findcategory = new Category({
        name: category,
      });
      await findcategory.save();
    }

    const product = new Products({
      name,
      description,
      price,
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

export { addProduct, fetchAllProducts, getProductById };
