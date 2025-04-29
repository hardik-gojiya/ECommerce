import { Category } from "../models/Category.model.js";
import { uploadOnClodinary } from "../utils/Cloudinary.util.js";

const addCategory = async (req, res) => {
  const { name } = req.body;
  const categoryImg = req.file;
  const user = req.user;

  if (user.role === "user") {
    return res.status(400).json({ error: "only admin can add category" });
  }

  try {
    let category = await Category.findOne({ name });
    if (category) {
      return res.status(400).json({ error: "category already exists" });
    }

    category = new Category({
      name,
    });
    if (categoryImg) {
      let cloudinaryImage = await uploadOnClodinary(categoryImg.path);
      if (!cloudinaryImage) {
        return res.status(400).json({ error: "error while uploading image" });
      }
      category.categoryImage = cloudinaryImage;
    }
    await category.save();
    return res
      .status(201)
      .json({ message: "category added succesfully", category });
  } catch (error) {
    console.log("errro while add category ", error);
    return res.status(500).json({ error: "internal server error " });
  }
};

const addSubCategory = async (req, res) => {
  const { categoryname, subCategory } = req.body;
  const user = req.user;

  if (user.role === "user") {
    return res.status(400).json({ error: "only admin can add category" });
  }

  try {
    let category = await Category.findOne({ name: categoryname });
    if (!category) {
      return res.status(400).json({ error: "category does not exists" });
    }

    if (category.subCategories.includes(subCategory)) {
      return res.status(400).json({ error: "sub category already exists" });
    }

    category.subCategories.push(subCategory);
    await category.save();
    return res.status(201).json({
      message: "sub category added succesfully",
      category,
    });
  } catch (error) {
    console.log("errro while add sub category ", error);
    return res.status(500).json({ error: "internal server error " });
  }
};



const fetchOneCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }
    return res.status(200).json({ category });
  } catch (error) {
    console.log("error while fetch category", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const catagories = await Category.find();
    if (!catagories) {
      return res.status(404).json({ error: "no catagories found " });
    }
    return res.send({ catagories: catagories });
  } catch (error) {
    console.log("error while fetch catgories", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getSubCategory = async (req, res) => {
  const id = req.params.id;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ error: "category not found" });
    }
    return res.status(200).json({ subCategories: category.subCategories });
  } catch (error) {
    console.log("error while fetch sub category", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getSubCategoryByName = async (req, res) => {
  const category = req.params.category;
  try {
    const findcategory = await Category.findOne({ name: category });
    if (!findcategory) {
      return res.status(404).json({ error: "category not found" });
    }
    return res.status(200).json({ subCategories: findcategory.subCategories });
  } catch (error) {
    console.log("error while fetch sub category", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export {
  addCategory,
  getAllCategories,
  addSubCategory,
  fetchOneCategory,
  getSubCategory,
  getSubCategoryByName,
};
