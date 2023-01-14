import joi from "joi";
export const createProduct ={
   body:joi.object().required().keys({
    name: joi.string().required(),
    colors: joi.array(),
    descreption: joi.string().required(),
    totalAmount: joi.number().required(),
    price: joi.number().required(),
    discount:joi.number(),
    size: joi.array(),
    categoryId: joi.string().required().min(24).max(24),
    subCategoryId: joi.string().required().min(24).max(24),
    brandId: joi.string().required().min(24).max(24)
   })
}

export const signin ={
    body:joi.object().required().keys({
     email: joi.string().email().required(),
     password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{3,}$/)).required()    
    })
 }

 export const token = {
    params: joi.object().required().keys({
        token: joi.string().required(),
    })
}
 