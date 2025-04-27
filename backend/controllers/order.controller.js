import { Cart } from "../models/Cart.model.js";
import { Order } from "../models/Order.model.js";
import { Products } from "../models/product.model.js";
import { nodeMailerFunc } from "../utils/mailer.util.js";

let statusColor = "#4f46e5";
const statusColorfun = (status) => {
  if (status === "Delivered") {
    statusColor = "green";
  } else if (status === "Cancelled") {
    statusColor = "red";
  } else if (status === "Shipped") {
    statusColor = "orange";
  } else if (status === "Placed") {
    statusColor = "blue";
  } else if (status === "Processing") {
    statusColor = "yellow";
  }
};

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
    let order = await Order.findOne({ _id: orderid })
      .populate("user")
      .populate("items.product");
    if (!order) {
      return res.status(404).json({ error: "order not found" });
    }

    if (req.user._id.toString() != order.user._id.toString()) {
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
    const text = `
      <div style="border:1px solid #ccc; padding:20px; border-radius:8px; background:#fff;">
        <h3 style="color:#4f46e5;">Order ID: ${order._id}</h3>
        <p><strong>User Name:</strong> ${order.user?.name || "N/A"}</p>
        <p><strong>User Email:</strong> ${order.user?.email || "N/A"}</p>
        <p><strong>Phone:</strong> ${order.user?.phone}</p>
        <hr />
        <p style="color:${statusColor};"><strong>Status:</strong> ${
      order.status
    }</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Is Paid:</strong> ${order.ispaid ? "Yes" : "No"}</p>
        <p><strong>Is Delivered:</strong> ${
          order.status === "Delivered" ? "Yes" : "No"
        }</p>
        <hr />
        <h4>Shipping Address:</h4>
        <p><strong>street:</strong> ${order.shippingAdress?.street}</p>
        <p><strong>city, state :</strong> ${order.shippingAdress?.city}, ${
      order.shippingAdress?.state
    }</p>
        <p><strong>postalCode:</strong> ${order.shippingAdress?.postalCode}</p>
        <p><strong>country:</strong> ${order.shippingAdress?.country}</p>
        <hr />
        <h4>Items:</h4>
        <ul>
          ${order.items
            .map(
              (item) => `
            <li>${item.product?.name || "Product"} - ₹${
                item.product?.price
              } × ${item.quantity}</li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
    nodeMailerFunc(
      order?.user?.email,
      `Your order ${order._id} has been Cancelled by You`,
      text
    );
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
    let order = await Order.findById(orderid)
      .populate("user")
      .populate("items.product");
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
    console.log(order);

    // send mail to order user
    const text = `
      <div style="border:1px solid #ccc; padding:20px; border-radius:8px; background:#fff;">
        <h3 style="color:#4f46e5;">Order ID: ${order._id}</h3>
        <p><strong>User Name:</strong> ${order.user?.name || "N/A"}</p>
        <p><strong>User Email:</strong> ${order.user?.email || "N/A"}</p>
        <p><strong>Phone:</strong> ${order.user?.phone}</p>
        <hr />
        <p style="color:${statusColor};"><strong>Status:</strong> ${
      order.status
    }</p>
        <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Is Paid:</strong> ${order.ispaid ? "Yes" : "No"}</p>
        <p><strong>Is Delivered:</strong> ${
          order.status === "Delivered" ? "Yes" : "No"
        }</p>
        <hr />
        <h4>Shipping Address:</h4>
        <p><strong>street:</strong> ${order.shippingAdress?.street}</p>
        <p><strong>city, state :</strong> ${order.shippingAdress?.city}, ${
      order.shippingAdress?.state
    }</p>
        <p><strong>postalCode:</strong> ${order.shippingAdress?.postalCode}</p>
        <p><strong>country:</strong> ${order.shippingAdress?.country}</p>
        <hr />
        <h4>Items:</h4>
        <ul>
          ${order.items
            .map(
              (item) => `
            <li>${item.product?.name || "Product"} - ₹${
                item.product?.price
              } × ${item.quantity}</li>
          `
            )
            .join("")}
        </ul>
      </div>
    `;
    nodeMailerFunc(
      order?.user?.email,
      `Your order ${order._id} has been ${order.status}`,
      text
    );

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
