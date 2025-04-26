import { Cart } from "../models/Cart.model.js";
import { Order } from "../models/Order.model.js";
import { Products } from "../models/product.model.js";

const createOrderForCart = async (req, res) => {
  const { userDescription, shippingAdress } = req.body;
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
      userDescription,
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

const createOrderForOneProduct = async (req, res) => {
  const user = req.user;
  const productid = req.params.id;
  let { shippingAdress, quantity, userDescription } = req.body;
  if (!shippingAdress) {
    return res.status(400).json({ error: "shipping adress require" });
  }
  if (!quantity) {
    quantity = 1;
  }

  try {
    const product = await Products.findOne({ _id: productid });
    if (!product) {
      return res.status(404).json({ error: "product not found" });
    }

    const order = new Order({
      user: user,
      items: [
        {
          product: product,
          quantity: quantity,
        },
      ],
      userDescription,
      shippingAdress,
      totalAmount: product.price * quantity,
    });

    if (!order) {
      return res.status(400).json({ error: "error while creating order" });
    }
    await order.save();
    return res
      .status(201)
      .json({ message: "order created successfully", order });
  } catch (error) {
    console.log(error);
    return res.status(505).json({ error: "Internal server error" });
  }
};

const getAllOrderforAdmin = async (req, res) => {
  const loginuser = req.user;
  if (loginuser.role === "user") {
    return res.status(400).json({ error: "only admin can see all orders" });
  }
  try {
    const orders = await Order.find()
      .populate("items.product")
      .populate("user", "-password");
    if (!orders) {
      return res.status(404).json({ error: "no order was found" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getAllOrderOfOneUser = async (req, res) => {
  const userid = req.params.id;

  if (req.user._id.toString() != userid.toString()) {
    return res.status(400).json({ error: "you can see only your orders" });
  }

  const orders = await Order.find({ user: req.user }).populate("items.product");

  if (!orders) {
    return res.status(404).json({ error: "no Order Found" });
  }
  return res.status(200).json({ message: "orders fetch successfully", orders });
};

const cancleOrder = async (req, res) => {
  const orderid = req.params.id;

  try {
    let order = await Order.findOne({ _id: orderid });
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }

    if (req.user._id.toString() != order.user.toString()) {
      return res.status(400).json({ error: "you can cancle only your orders" });
    }

    if (order.status === "Delivered") {
      return res.status(400).json({ error: "your order is delivered" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ error: "you already cancle this order" });
    }

    order.status = "Cancelled";
    await order.save();
    return res.status(200).json({ message: "order Cancelled", order });
  } catch (error) {
    console.log(error);
    return res.status(505).json({ error: "Internal server error" });
  }
};

const changeStatusofOrderByAdmin = async (req, res) => {
  const { orderid, status } = req.body;
  if (req.user === "user") {
    return res
      .status(400)
      .json({ error: "only admin can change status of orders" });
  }
  try {
    let order = await Order.findById(orderid);
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }
    if (order.status === "Delivered") {
      return res.status(400).json({ error: "order is Delivered" });
    }
    if (order.status === "Cancelled") {
      return res.status(400).json({ error: "order is cancelled" });
    }
    if (status === "Delivered") {
      order.ispaid = true;
      order.paidAt = new Date();
    }
    order.status = status;
    await order.save();
    return res
      .status(200)
      .json({ message: "status changed sucessfully", order });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "internal server error" });
  }
};

const getOneOrderById = async (req, res) => {
  const orderid = req.params.id;

  try {
    let findOrder = await Order.findById(orderid).populate("items.product");
    if (!findOrder) {
      return res.status(404).json({ error: "order not found" });
    }
    return res.status(200).json({ findOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server Error" });
  }
};

export {
  createOrderForCart,
  createOrderForOneProduct,
  getAllOrderOfOneUser,
  cancleOrder,
  getAllOrderforAdmin,
  changeStatusofOrderByAdmin,
  getOneOrderById,
};
