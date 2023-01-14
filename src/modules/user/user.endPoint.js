import { roles } from "../../middleWare/authentication.js";



export const endPoint = {
    userById:[roles.Admin],
    updateCategory:[roles.Admin],
    getCategories: [roles.Admin],
    softDelete: [roles.Admin]
    
}