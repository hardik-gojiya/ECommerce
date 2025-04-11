import { Products } from "../models/product.model.js";

const addProduct = async (req, res) => {
  const { name, description, price } = req.body;

  const user = req.user;
  if (user.role != "admin") {
    return res.status(400).json({ error: "only admin can add product" });
  }

  try {
    const product = new Products({
      name,
      description,
      price,
    });
    if (!product) {
      return res.status(400).json({ error: "Product added succesfully" });
    }
    product.save();

    return res.status(201).json({ message: "Product added succesfully" });
  } catch (error) {
    console.log("error while add product", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export { addProduct };
