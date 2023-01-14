import {
    create,
    findOne,
    findById,
    updateOne,
    find,
    findOneAndUpdateee
  } from "../../../../DB/DBMethods.js";
  import {brandModel} from '../../../../DB/models/brand.model.js'
//   import { findOneAndUpdateee } from "../../../../DB/DBMethods.js";
  // import {cloud} from "../../../services/cloudnairy.js";
  import { asyncHandler } from "../../../services/errorHandling.js";
  import { paginate } from "../../../services/pagenation.js";
  import slugify from "slugify";
  
  export const createBrand= asyncHandler(async (req, res, next) => {
        const { name } = req.body;
        if (!name) {
          next(new Error("name is required", { cause: 400 }));
        } else {
          const { secure_url, public_id } = await cloud.uploader.upload(
            req.file.path,
            {
              folder: `Brand`,
            }
          );
          const brand = await create({
            model: brandModel,
            data: {
              name,
              slug: slugify(name),
              image: secure_url,
              createdBy: req.user._id,
              imagePublic_id: public_id,
            },
          });
          if (brand) {
            res.status(200).json({ message: "done", brand });
          } else {
            await cloud.uploader.destroy(brand.imagePublic_id);
            next(new Error("err adding brand", { cause: 400 }));
            //  res.json({ message: "err adding sub brand" });
          }
    
      
    }
  });
  
  export const updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.file) {
      const { secure_url, public_id } = await cloud.uploader.upload(
        req.file.path,
        {
          folder: `Brand`,
        }
      );
      req.body.image = secure_url;
      req.body.imagePublic_id = public_id;
    }
    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }
    req.body.createdBy = req.user._id;
  
    const brand = await findOneAndUpdateee({
      model: brandModel,
      conditions: { _id: id },
      data: req.body,
      options: { new: false },
    });
    if (!brand) {
      await cloud.uploader.destroy(req.body.imagePublic_id);
      next(new Error("can not find brand", { cause: 400 }));
    } else {
      await cloud.uploader.destroy(brand.imagePublic_id);
      res.status(200).json({ message: "done", brand });
    }
  });

export const brands = asyncHandler(async ( req,res,next)=>{
  const {page,size} = req.query
  const {skip , limit} =  paginate(size,page)
  const populate = [{
    path:"createdBy",
    slect: "userName email"
  }]

  const brands = await find ({
    model:brandModel,
    limit,
    skip,
    select:'name slug image',
    populate,
  })
  res.status(200).json({message:"done" , brands})
})
  