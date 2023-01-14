import { Schema, model, Types } from "mongoose";
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      min: [2, "min letters are 2"],
      max: [20, "max letters are 20"],
      lowercase: true,
      unique: true,
      trim: true,
    },
    slug: String,
    descreption: String,
    stock: { type: Number, default: 0 },
    totalAmount:{type:Number,default:0},
    soldItems:{type:Number,default:0},
    price: { type: Number, default: 1 },
    discount: { type: Number, default: 0 },
    finalPrice: { type: Number, default: 1 },
    colors: [String],
    size: { type: [String], enum: ["s", "m", "l", "xl"] },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not add category without owner"],
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    isDeleted: {
        type: Boolean,
        default: false,
      },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: [true, "can not add product without Category"],
    },
    subCategoryId: {
      type: Types.ObjectId,
      ref: "SubCategory",
      required: [true, "can not add product without subCategory"],
    },
    brandId: {
      type: Types.ObjectId,
      ref: "brand",
      required: [true, "can not add product without brand"],
    },
    images: { type: [String], required: [true, "images are required"] },

    // cover: {
    //   type: String,
    //   required: [true, "cover is required"],
    // },
    imagesPublic_ids: [String],
  },
  {
    timestamps: true,
  }
);
export const productModel = model("Product", productSchema);
