import mongoose from "mongoose";
import { User } from "./User.model.js";
import { Products } from "./product.model.js";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: Products,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
      },
    ],
    shippingAdress: {
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
    },
    totalAmount: Number,
    status: {
      type: String,
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Processing",
    },
    paymentMethod: { type: String, default: "Cash on Delivery" },
    paidAt: Date,
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
