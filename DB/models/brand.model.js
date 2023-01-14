import { Schema, model,Types } from "mongoose";
const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      min: [2, "min letters are 2"],
      max: [20, "max letters are 20"],
      lowercase: true,
      unique:true
    },
    slug: String,
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "can not at subcategory without owner"],
    },
    updatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },
    imagePublic_id:String,
    image: {
      type: String,
      required: [true, "image is required"],
    },
  },
  {
    timestamps: true,
  }
);
export const brandModel = model("brand", brandSchema);
