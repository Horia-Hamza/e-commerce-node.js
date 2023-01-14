import { roles } from "../../middleWare/authentication.js";



export const endPoint = {
    createCategory:[roles.Admin],
    updateCategory:[roles.Admin],
    getCategories: [roles.Admin]
}