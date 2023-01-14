import { productModel } from "../../../../DB/models/product.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { paginate } from "../../../services/pagenation.js";
import cloudinary from "../../../services/cloudnairy.js";
import {
  create,
  findById,
  findOne,
  findOneAndUpdateee,
  find,
} from "../../../../DB/DBMethods.js";
import slugify from "slugify";
import { userModel } from "../../../../DB/models/user.model.js";
import { subCategoryModel } from "../../../../DB/models/subCategory.model.js";
import { brandModel } from "../../../../DB/models/brand.model.js";

export const createProduct = asyncHandler(async (req, res, next) => {
  const user = await findById({
    model: userModel,
    conditions: req.user._id,
  });
  if (!user) {
    next(new Error("can not find user", { cause: 404 }));
  } else {
    if (!req.files?.length) {
      next(new Error("images are required", { cause: 400 }));
    } else {
      const { name, totalAmount, price, subCategoryId, categoryId, brandId } =
        req.body;
      if (!name) {
        next(new Error("product name is required", { cause: 400 }));
      } else {
        req.body.slug = slugify(name);
        req.body.stock = totalAmount;
        req.body.finalPrice = price - price * ((req.body.discount || 0) / 100);
        console.log({ finalPrice: req.body.finalPrice });
        const category = await findOne({
          model: subCategoryModel,
          conditions: { _id: subCategoryId, categoryId },
        });
        if (!category) {
          next(new Error("sub or category ids in valid", { cause: 404 }));
        }
        const brand = await findOne({
          model: brandModel,
          conditions: { _id: brandId },
        });
        if (!brand) {
          next(new Error("brand id in valid", { cause: 404 }));
        }
        const images = [];
        const imagesIds = [];
        for (const file of req.files) {
          const { secure_url, public_id } = await cloudinary.uploader.upload(
            file.path,
            { folder: `products${name}` }
          );
          images.push(secure_url);
          imagesIds.push(public_id);
        }
        req.body.images = images;
        req.body.imagesPublic_ids = imagesIds;
        req.body.createdBy = req.user._id;
        const product = await create({
          model: productModel,
          data: req.body,
        });
        res.status(201).json({ message: "done", product });
      }
    }
  }
});

export const updateProduct = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const product = await findById({
    model: productModel,
    conditions: id,
  });
  if (!product) {
    next(new Error("can not find product", { cause: 404 }));
  } else {
    const {
      name,
      totalAmount,
      price,
      discount,
      subCategoryId,
      categoryId,
      brandId,
    } = req.body;
    if (req.body.name) {
      req.body.slug = slugify(name);
    }
    if (req.body.totalAmount) {
      req.body.stock = totalAmount - product.soldItems;
    }
    if (price && discount) {
      req.body.finalPrice = price - price * (discount / 100);
    }
    if (price) {
      req.body.finalPrice = price - price * (product.discount / 100);
    }
    if (discount) {
      req.body.finalPrice = product.price - product.price * (discount / 100);
    }

    req.body.finalPrice = price - price * ((req.body.discount || 0) / 100);
    if (subCategoryId && categoryId) {
      const category = await findOne({
        model: subCategoryModel,
        conditions: { _id: subCategoryId, categoryId },
      });
      if (!category) {
        next(new Error("sub or category ids in valid", { cause: 404 }));
      }
    }
    if (brandId) {
      const brand = await findOne({
        model: brandModel,
        conditions: { _id: brandId },
      });
      if (!brand) {
        next(new Error("brand id in valid", { cause: 404 }));
      }
    }
    if (req.files?.length) {
      const images = [];
      const imagesIds = [];
      for (const file of req.files) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(
          file.path,
          { folder: `products${name}` }
        );
        images.push(secure_url);
        imagesIds.push(public_id);
      }

      req.body.images = images;
      req.body.imagesPublic_ids = imagesIds;
      req.body.updatedBy = req.user._id;
    }
    const updatedProduct = await findOneAndUpdateee({
      model: productModel,
      conditions: { id },
      data: req.body,
      options: { new: false },
    });
    if (!updatedProduct) {
      for (const image of req.body.imagesPublic_ids) {
        await cloudinary.uploader.destroy(image);
      }
      next(new Error("fail to update product", { cause: 400 }));
    } else {
      for (const image of product.imagesPublic_ids) {
        await cloudinary.uploader.destroy(image);
      }
      res.status(201).json({ message: "done", updatedProduct });
    }
  }
});
const populate = [
  {
    path: "createdBy",
    select: "userName email image",
  },
  { path: "categoryId" },
  { path: "subCategoryId" },
  { path: "brandId" },
];
export const products = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate({
    skip: req.query.page,
    limit: req.query.size,
  });
  const products = await find({
    model: productModel,
    populate,
    skip,
    limit,
  });
  res.status(200).json({ message: "done", products });
});
