import joi from "joi";
export const createBrand ={
   body:joi.object().required().keys({
    name: joi.string(),
   })
}

export const brand ={
    params: joi.object().required().keys({
        id: joi.string().required().min(24).max(24),
       
    })
 }
