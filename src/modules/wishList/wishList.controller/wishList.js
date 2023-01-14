import {
  findByIdAndUpdate,
  findOneAndUpdateee,
} from "../../../../DB/DBMethods.js";
import { productModel } from "../../../../DB/models/product.model.js";
import { userModel } from "../../../../DB/models/user.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";

export const addToWishList = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;
  const product = await findByIdAndUpdate({
    model: productModel,
    conditions: {_id:productId},
  });
  if (!product) {
    return next(new Error("product id is wrong", { cause: 404 }));
  }
  const user = await findOneAndUpdateee({
    model: userModel,
    conditions: { _id: req.user._id },
    data: { $addToSet: { wishlist: productId } },
  });
  res.status(400).json({ message: "done" });
});

export const pullFromWishlist = asyncHandler(async (req, res, next) => {
  const { productId } = req.params;

  const user = await findOneAndUpdateee({
    model: userModel,
    conditions: { _id: req.user._id },
    data: { $pull: { wishlist: productId } },
  });
  res.status(400).json({ message: "done" });
});
