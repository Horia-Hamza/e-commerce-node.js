import { create, findOne, updateOne, find } from "../../../../DB/DBMethods.js";
import { categoryModel } from "../../../../DB/models/category.model.js";
import { subCategoryModel } from "../../../../DB/models/subCategory.model.js";
import cloudinary from "../../../services/cloudnairy.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import { paginate } from "../../../services/pagenation.js";

export const createCategory = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    next(new Error("please provide an image", { cause: 400 }));
  } else {
    const { name } = req.body;
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: "category",
      }
    );
    const result = await create({
      model: categoryModel,
      data: {
        name,
        image: secure_url,
        createdBy: req.user._id,
        imagePublic_id: public_id,
      },
    });
    res.status(200).json({ message: "done", result });
  }
});

export const updateCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await findOne(categoryModel, { _id: id });
  if (!category) {
    next(new Error("please provide a real id"), { cause: 400 });
  } else {
    if (req.file) {
      const { secure_url } = await cloud.uploader.upload(req.file.path, {
        folder: "category",
      });
      req.body.image = secure_url;
      const result = await updateOne(categoryModel, { _id: id }, req.body);
      await cloud.uploader.destroy(category.imagePublic_id);
      res.status(200).json({ message: "done", result });
    } else {
      
      category.image = req.body.image;
      const result = await updateOne(categoryModel, { _id: id }, req.body);
      res.status(200).json({ message: "done", result });
    }
  }
});

export const getategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const category = await findOne(categoryModel, { id });

  if (!category) {
    next(new Error("please provide a real id"), { cause: 400 });
  } else {
    const result = await findOne(categoryModel, { _id: id }, "", [
      { path: "createdBy", select: "userName email" },
    ]);
    res.status(200).json({ message: "done", result });
  }
});


export const categories = asyncHandler(async (req, res, next) => {
  const { skip, limit } = paginate(req.query.page, req.query.size);
  console.log(skip, limit);
  const populate = [
    {
      path: "createdBy",
      select: "name email",
    }
  ];
  const categories =[]
  const cursor = categoryModel.find({}).skip(skip).limit(limit).populate(populate).cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    console.log(doc); // Prints documents one at a time
    const convertDoc = doc.toObject();
    const subategories = await find({
      model:subCategoryModel,
      conditions:{categoryId:convertDoc._id},
      populate
    })
    convertDoc.subCategoriesList = subategories
    categories.push(convertDoc)
  }
  res.status(200).json({ message: "done", categories });
});
