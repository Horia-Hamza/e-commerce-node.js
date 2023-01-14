import joi from "joi";
export const createCategory ={
   body:joi.object().required().keys({
    name: joi.string(),
   })
}

export const category ={
    params: joi.object().required().keys({
        id: joi.string().required().min(24).max(24),
    })
 }

 