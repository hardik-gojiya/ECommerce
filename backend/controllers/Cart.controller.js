import { Cart } from "../models/Cart.model.js";
import { Products } from "../models/product.model.js";

const addToCart = async (req, res) => {
  const { productid, quantity } = req.body;
  const user = req.user;

  if (!productid && !user) {
    return res.status(400).json({ error: "some error occured" });
  }

  try {
    let cart = await Cart.findOne({ user: user }).populate("items");
    if (!cart) {
      cart = new Cart({
        user: user,
        items: [
          {
            product: productid,
            quantity: quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (i) => i.product.toString() === productid
      );
      if (!existingItem) {
        cart.items.push({ product: productid, quantity: quantity });
      } else {
        existingItem.quantity += 1;
      }
    }
    await cart.save();
    return res
      .status(200)
      .json({ message: "item added successfully to cart", cart });
  } catch (error) {
    console.log("error while add item to cart", error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getCart = async (req, res) => {
  const user = req.params.id;
  let cart = await Cart.findOne({ user: user }).populate("items.product");
  if (!cart) {
    console.log("cart not found");
  }
  return res.status(200).json(cart);
};

export { addToCart, getCart };
