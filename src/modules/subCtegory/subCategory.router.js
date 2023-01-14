import  {Router}  from "express";
import * as subCategoryController from './subCategory.controller/subCategory.js'
import { multerValidation, myMulter } from "../../services/multer.js";
import { auth } from "../../middleWare/authentication.js";
import {endPoint} from "./subCategory.endPoint.js"
import {validation} from '../../middleWare/validaion.js'
import * as validatios from './subCategory.validation.js'
import {HME} from "../../services/multer.js"
const router = Router({mergeParams:true})

router.post('/',auth(endPoint.createSubCategory),validation(validatios.createSubCategory),myMulter(multerValidation.image).single('image'),subCategoryController.createSubCategory)
router.put('/:subCategoryId',auth(endPoint.updateSubCategory),myMulter(multerValidation.image).single('image'),subCategoryController.updateSubCategory)
router.get('/:subCategoryId',subCategoryController.category )

export default router
