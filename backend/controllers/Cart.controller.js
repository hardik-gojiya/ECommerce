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
    let product = await Products.findById(productid);
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }
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
  const user = req.params.userId;
  try {
    let cart = await Cart.findOne({ user: user }).populate("items.product");
    if (!cart) {
      return res.status(404).json({ cart: [] });
    }
    return res.status(200).json({ cart: cart });
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

const removeItemFromCart = async (req, res) => {
  const user = req.user;
  const productid = req.params.id;
  if (!productid) {
    return res.status(400).json({ error: "productid require" });
  }

  try {
    let userCart = await Cart.findOne({ user: user });

    let findProduct = userCart.items.find((i) => {
      return i.product.toString() === productid;
    });

    if (!findProduct) {
      return res.status(404).json({ error: "product not found" });
    }

    userCart.items.pop({ productid });
    userCart.save();

    return res
      .status(200)
      .json({ message: "item remove successfully", userCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const decreseQunatityOfProductbyOne = async (req, res) => {
  const productid = req.params.id;
  const user = req.user;

  let usercart = await Cart.findOne({ user: user });

  if (!usercart) {
    return res.status(404).json({ error: "cart not find" });
  }

  for (let item of usercart.items) {
    if (item.product.toString() === productid) {
      item.quantity -= 1;
    }
  }

  await usercart.save();
  return res.status(200).json({ message: "qunatity decrese by 1", usercart });
};

const emptyCart = async (req, res) => {
  const user = req.params.userId;
  try {
    let cart = await Cart.findOne({ user: user });
    if (!cart) {
      return res.status(404).json({ error: "cart not found" });
    }
    cart.items = [];
    await cart.save();
    return res.status(200).json({ message: "cart emptied successfully" });
  } catch (error) {
    return res.status(500).json({ error: "internal server error" });
  }
};

export {
  addToCart,
  getCart,
  removeItemFromCart,
  decreseQunatityOfProductbyOne,
  emptyCart,
};
