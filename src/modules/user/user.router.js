import  {Router}  from "express";
import * as userController from './user.controller/user.js';
import { auth } from "../../middleWare/authentication.js";
import {endPoint} from './user.endPoint.js'
const router = Router()

router.get('/',auth(endPoint.userById),userController.profile)
router.get('/:id',auth(endPoint.userById),userController.userById)
router.patch('/softDelete',userController.softDelete)

export default router