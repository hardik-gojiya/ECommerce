import mongoose from "mongoose";
import { Category } from "./Category.model.js";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Category,
      required: true,
    },
  },
  { timestamps: true }
);

export const Products = mongoose.model("Products", productSchema);
