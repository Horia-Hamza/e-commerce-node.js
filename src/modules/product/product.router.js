import  {Router}  from "express";
import { multerValidation, myMulter } from "../../services/multer.js";
import { auth } from "../../middleWare/authentication.js";
import * as ProductController from "./product.controller/product.js"
import {endPoint} from "./product.endPoint.js"
import {validation} from '../../middleWare/validaion.js'
import * as validatios from './product.validation.js'
import  wishListRouter  from "../wishList/wishList.router.js";
const router = Router()
router.use('/:productId/wishlist', wishListRouter)
// router.use('/:productId/cart', cartRouter)

router.post('/',myMulter(multerValidation.image).array('images',5),validation(validatios.createProduct),auth(endPoint.create),ProductController.createProduct)
router.put('/:id',auth(endPoint.update),myMulter(multerValidation.image).array('images',5),ProductController.updateProduct)
router.get('/',ProductController.products )


export default router
