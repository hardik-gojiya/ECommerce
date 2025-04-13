import { Cart } from "../models/Cart.model.js";
import { Order } from "../models/Order.model.js";

const createOrder = async (req, res) => {
  const { shippingAdress } = req.body;
  const user = req.user;
  try {
    const usercart = await Cart.findOne({ user: user }).populate(
      "items.product"
    );
    let totalAmount = 0;

    for (let item of usercart.items) {
      totalAmount += item.product.price * item.quantity;
    }
    if (!shippingAdress) {
      return res.status(400).json({ error: "shipping adress require" });
    }

    const order = new Order({
      user,
      items: usercart.items,
      shippingAdress,
      totalAmount: totalAmount,
    });
    await order.save();
    if (!order) {
      return res.status(400).json({ error: "order not created" });
    }

    return res
      .status(201)
      .json({ message: "order created sucessfully", order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

export { createOrder };
