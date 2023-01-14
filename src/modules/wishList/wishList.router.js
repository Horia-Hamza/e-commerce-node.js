import { Router } from "express";
import * as wishListController from './wishList.controller/wishList.js'
import { auth } from "../../middleWare/authentication.js";
import {endPoint} from './wishList.endPoint.js'
const router = Router({mergeParams:true})
router.patch('/add',auth(endPoint.addOrErmove),wishListController.addToWishList)
router.patch('/remove',auth(endPoint.addOrErmove),wishListController.pullFromWishlist)
export default router 