import { userModel } from "./models/user.model.js";
import { categoryModel } from "./models/category.model.js";
import { subCategoryModel } from "./models/subCategory.model.js";

export const find =async ({model,conditions={},options={},limit=10,skip=0,select='',populate=[]})=>{
    const result = await model.find(conditions,options).skip(skip).limit(limit).select(select).populate(populate)
    return result 
}

export const findOne =async ({model,conditions={},select="",populate=[]})=>{
    const result = await model.findOne(conditions).select(select).populate(populate)
    return result 
}
export const findById =async ({model,conditions={},select="",populate=[]})=>{
    const result = await model.findById(conditions).select(select).populate(populate)
    return result 
}

export const updateOne =async ({model,conditions={},data={},select="",populate=[]})=>{
    const result = await model.updateOne(conditions,data).select(select).populate(populate)
    return result 
}
export const findOneAndUpdateee =async ({model,conditions={},data,options={},select="",populate=[]})=>{
    const result = await model.findOneAndUpdate(conditions, data, options).select(select).populate(populate)
    return result 
}
export const findByIdAndUpdate =async ({model,conditions={},data,options={},select="",populate=[]})=>{
    const result = await model.findByIdAndUpdate(conditions, data, options).select(select).populate(populate)
    return result 
}
export const findOneAndDelete =async ({model,conditions={},options={},select="",populate=[]})=>{
    const result = await model.findOneAndDelete(conditions, options).select(select).populate(populate)
    return result 
}
export const create =async ({model,data})=>{
    const result = await model.create(data)
    return result 
}
