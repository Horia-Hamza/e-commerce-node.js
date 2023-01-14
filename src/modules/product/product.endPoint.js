import { roles } from "../../middleWare/authentication.js";



export const endPoint = {
    create:[roles.Admin,roles.User],
    update:[roles.Admin],
    products: [roles.Admin]
}