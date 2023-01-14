import { roles } from "../../middleWare/authentication.js";



export const endPoint = {
    createSubCategory:[roles.Admin],
    updateSubCategory:[roles.Admin],
    getSubCategories: [roles.Admin]
}