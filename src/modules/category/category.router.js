import  {Router}  from "express";
import * as categoryContrlller from './category.controller/category.js'
import { multerValidation, myMulter } from "../../services/multer.js";
import { auth } from "../../middleWare/authentication.js";
import {endPoint} from "./category.endPoint.js"
import {validation} from '../../middleWare/validaion.js'
import * as validatios from './category.validation.js'
import  subCategoryRouter  from "../subCtegory/subCategory.router.js";
const router = Router()
router.use('/:categoryId/subcategory',subCategoryRouter)
router.post('/',auth(),validation(validatios.createCategory),myMulter(multerValidation.image).single('image'),categoryContrlller.createCategory)
router.put('/:id',auth(endPoint.updateCategory),validation(validatios.category),myMulter(multerValidation.image).single('image'),categoryContrlller.updateCategory)
router.get('/:id',auth(),categoryContrlller.getategory)
router.get('/',auth(endPoint.getCategories),categoryContrlller.categories)

export default router
