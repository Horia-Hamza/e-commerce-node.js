import { roles } from "../../middleWare/authentication.js";



export const endPoint = {
    addOrErmove:[roles.User,roles.Admin]
}