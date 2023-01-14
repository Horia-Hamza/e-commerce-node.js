import  {Router}  from "express";
import * as brandController from './brand.controller/brand.js'
import { multerValidation, myMulter } from "../../services/multer.js";
import { auth } from "../../middleWare/authentication.js";
import {endPoint} from "./brand.endPoint.js"
import {validation} from '../../middleWare/validaion.js'
import * as validatios from './brand.validation.js'
// import {HME} from "../../services/multer.js"
const router = Router()

router.post('/',auth(),validation(validatios.createBrand),myMulter(multerValidation.image).single('image'),brandController.createBrand)
router.put('/:id',auth(),myMulter(multerValidation.image).single('image'),brandController.updateBrand)
router.get('/',auth(),brandController.brands )

export default router
