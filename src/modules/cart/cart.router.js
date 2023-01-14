import { Router } from "express";
import { multerValidation, myMulter } from "../../services/multer.js";

import { auth } from "../../middleWare/authentication.js";
import * as cart from './cart.controller/cart.js'
import { endPoint } from "./cart.endPoint.js";
const router = Router()

router.post('/',myMulter(multerValidation.image).array('images',5),auth(endPoint.addOrErmove) ,cart.addToCart)
router.delete('/:cartId',auth(endPoint.addOrErmove) ,cart.deleteCart)
router.put('/:cartId',auth(endPoint.addOrErmove) ,cart.removeFromCart)
router.get('/',auth(endPoint.addOrErmove) ,cart.userCart)

export default router
