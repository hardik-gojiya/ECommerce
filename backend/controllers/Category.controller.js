import { Category } from "../models/Category.model.js";

const addCategory = async (req, res) => {
  const { name } = req.body;
  const user = req.user;

  if (user.role != "admin") {
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
    await category.save();
    return res
      .status(201)
      .json({ message: "category added succesfully", category });
  } catch (error) {
    console.log("errro while add category ", error);
    return res.status(500).json({ error: "internal server error " });
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

export { addCategory, getAllCategories };
