import { Schema, model, Types } from "mongoose";
const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: [true, "userName is required"],
      min: [2, "min letters are 2"],
      max: [20, "max letters are 20"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email must be unique value"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    phone: { type: String },
    role: { type: String, default:"User", enum: ["User","Admin"] },
    active: { type: Boolean, default: true },
    confirmEmail: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    image: { type: String },
    DOB: { type: String },
    code: String,
    active: { type: Boolean, default: false },
    wishlist: [{ type: Types.ObjectId, ref: "Product" }],
  },
  {
    timestamps: true,
  }
);
export const userModel = model("User", userSchema);
