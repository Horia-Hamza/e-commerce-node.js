import { roles } from "../../middleWare/authentication.js";



export const endPoint = {
    createBrand:[roles.Admin],
    updateBrand:[roles.Admin],
    getSubBrands: [roles.Admin]
}