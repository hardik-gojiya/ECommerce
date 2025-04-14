import mongoose from "mongoose";
import { Category } from "./Category.model.js";
import { type } from "os";

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
    image: {
      type: String,
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
