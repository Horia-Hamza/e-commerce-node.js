import joi from "joi";
export const createSubCategory ={
   body:joi.object().required().keys({
    name: joi.string(),
   })
}

export const subCategory ={
    params: joi.object().required().keys({
        id: joi.string().required().min(24).max(24),
        categoryId: joi.string().required().min(24).max(24),
    })
 }
