import { Error } from "mongoose";
import {
  create,
  findById,
  findOne,
  findOneAndUpdateee,
  findOneAndDelete,
} from "../../../../DB/DBMethods.js";
import { cartModel } from "../../../../DB/models/cart.model.js";
import { productModel } from "../../../../DB/models/product.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import cloudinary from "../../../services/cloudnairy.js";
import slugify from "slugify";

export const addToCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { productId, name, price, quantity, discount } = req.body;
  if (!req.files?.length) {
    next(new Error("images are required", { cause: 400 }));
  } else {
    if (!name) {
      next(new Error("product name is required", { cause: 400 }));
    }
    let finalPrice = price - price * ((discount || 0) / 100);
    const imagesArr = [];
    const imagesIdsArr = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        { folder: `cart/products${productId}` }
      );
      imagesArr.push(secure_url);
      imagesIdsArr.push(public_id);
    }
    let cart = await findOne({
      model: cartModel,
      conditions: { userId: _id },
    });

    if (!cart) {
      const createCart = await create({
        model: cartModel,
        data: {
          products: {
            productId,
            name,
            slug: slugify(name),
            images: imagesArr,
            imagesPublic_ids: imagesIdsArr,
            quantity,
            finalPrice,
          },
          userId: _id,
        },
      });
      return res.status(201).json({ message: "done", createCart });
    } else {
      if (cart) {
        //cart exists for user
        let itemIndex = cart.products.findIndex(
          (p) => {console.log(p);p.productId == productId}
        );

        if (itemIndex > -1) {
          //product exists in the cart, update the quantity
          let productItem = cart.products[itemIndex];
          productItem.quantity = quantity;
          cart.products[itemIndex] = productItem;
        } else {
          //product does not exists in cart, add new item
          cart.products.push({
            productId,
            name,
            slug: slugify(name),
            images: imagesArr,
            imagesPublic_ids: imagesIdsArr,
            quantity,
            finalPrice,
          });
        }
        cart = await cart.save();
        return res.status(201).send(cart);
      }
    }
  }
});

export const userCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;

  const cart = await findOne({
    model: cartModel,
    conditions: { userId: _id },
  });
  res.status(200).json({ message: "done", cart });
});

export const removeFromCart = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  const { cartId } = req.params;
  const { productId } = req.body;

  const cart = await findOne({
    model: cartModel,
    conditions: { _id: cartId, userId: _id },
  });
  if (!cart) {
    return next(new Error("user hasn't any cart yet", { cause: 404 }));
  }
  let deletedProducct = "";
  // test
  cartModel.deleteOne({ $where:{ products:{$elemMatch:{ _id: "63c024ba6cc7fb8bc233dc58" } } } })
  // test
    let exist = false;
    for (let i = 0; i < cart.products.length; i++) {
      if (productId == cart.products[i].productId.toString()) {
        deletedProducct = cart.products[i].productId.toString();
        console.log({ deletedProducct });
        // cart.products.pull(product);
        exist = true;
      }
      if (!exist) {
        return next(new Error("product id dont match", { cause: 404 }));
      }
  
  }
  const result = await findOneAndUpdateee({
    model: cartModel,
    conditions: { _id: cart._id, userId: _id },
    data: { $pull: { products: deletedProducct } },
    options: { new: true },
  });

  res.status(400).json({ message: "done", result });
});

export const deleteCart = asyncHandler(async (req, res, next) => {
  const { cartId } = req.params;

  const cart = await findOne({
    model: cartModel,
    conditions: { _id: cartId, userId: req.user._id },
  });
  if (!cart) {
    return next(
      new Error("user dosent have any products in the cart yet", { cause: 404 })
    );
  } else {
    const deleteCart = await findOneAndDelete({
      model: cartModel,
      conditions: { _id: cart._id, userId: req.user._id },
    });
    res.status(200).json({ message: "Done", deleteCart });
  }
});
