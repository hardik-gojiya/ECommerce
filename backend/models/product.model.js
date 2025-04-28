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
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
    },
    image: {
      type: [String],
      default: [],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: String,
    },
    brand: {
      type: String,
    },
  },
  { timestamps: true }
);
productSchema.pre("save", function (next) {
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

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
