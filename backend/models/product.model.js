import mongoose from "mongoose";
import { Category } from "./Category.model.js";
import { Cart } from "./Cart.model.js";

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
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

productSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    try {
      const result = await Cart.updateMany(
        {},
        { $pull: { items: { product: doc._id } } }
      );
      console.log(
        `Deleted product ${doc._id} removed from ${result.modifiedCount} cart(s).`
      );
    } catch (error) {
      console.error("Error while removing product from carts:", error);
    }
  }
});

export const Products = mongoose.model("Products", productSchema);
