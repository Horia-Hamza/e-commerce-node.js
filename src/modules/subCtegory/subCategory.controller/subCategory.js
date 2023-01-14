import {
  create,
  findOne,
  findById,
  updateOne,
  find,
} from "../../../../DB/DBMethods.js";
import { findOneAndUpdateee } from "../../../../DB/DBMethods.js";
import { categoryModel } from "../../../../DB/models/category.model.js";
// import {cloud} from "../../../services/cloudnairy.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { paginate } from "../../../services/pagenation.js";
import { subCategoryModel } from "../../../../DB/models/subCategory.model.js";
import slugify from "slugify";

export const createSubCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    next(new Error("please provide an image", { cause: 400 }));
    // res.json({ message: "please provide an image" });
  } else {
    const { categoryId } = req.params;
    const category = await findById({
      model: categoryModel,
      conditions: { _id: categoryId },
    });
    if (!category) {
      next(
        new Error("can not add sub category without category", {
          cause: 400,
        })
      );
      //   res.json({ message: "can not add sub category without category" });
    } else {
      const { name } = req.body;
      if (!name) {
        next(new Error("name is required", { cause: 400 }));
      } else {
        const { secure_url, public_id } = await cloud.uploader.upload(
          req.file.path,
          {
            folder: `category/${category._id}`,
          }
        );
        const subCategory = await create({
          model: subCategoryModel,
          data: {
            name,
            slug: slugify(name),
            image: secure_url,
            createdBy: req.user._id,
            imagePublic_id: public_id,
            categoryId: category._id,
          },
        });
        if (subCategory) {
          res.status(200).json({ message: "done", subCategory });
        } else {
          await cloud.uploader.destroy(subCategory.imagePublic_id);
          next(new Error("err adding sub category", { cause: 400 }));
          //  res.json({ message: "err adding sub category" });
        }
      }
    }
  }
});

export const updateSubCategory = asyncHandler(async (req, res, next) => {
  const { categoryId, subCategoryId } = req.params;
  if (req.file) {
    const { secure_url, public_id } = await cloud.uploader.upload(
      req.file.path,
      {
        folder: `category/${categoryId}`,
      }
    );
    req.body.image = secure_url;
    req.body.imagePublic_id = public_id;
  }
  if (req.body.name) {
    req.body.slug = slugify(req.body.name);
  }
  req.body.createdBy = req.user._id;

  const subCategory = await findOneAndUpdateee({
    model: subCategoryModel,
    conditions: { _id: subCategoryId, categoryId },
    data: req.body,
    options: { new: false },
  });
  if (!subCategory) {
    await cloud.uploader.destroy(req.body.imagePublic_id);
    next(new Error("can not find subcategory", { cause: 400 }));
  } else {
    await cloud.uploader.destroy(subCategory.imagePublic_id);
    res.status(200).json({ message: "done", subCategory });
  }
});
export const category = asyncHandler(async (req, res, next) => {
  const { subCategoryId } = req.params;
  const populate = [{
      path: "categoryId",
      select: "name createdBy image",
},{
  path : "createdBy",
  select : "userName email"
}];
  // const subCategoriesList = await subCategoriesList.findById(id).populate({
  //   path:"categoryId",
  //   select: "name createdBy image"
  // })
  const subCategory= await findOne({
    model: subCategoryModel,
    conditions: { subCategoryId },
    populate,
  });
  if (!subCategory) {
    next(new Error("can not find sub", { cause: 404 }));
  } else {
    res.status(200).json({ message: "done", subCategory });
  }
});
