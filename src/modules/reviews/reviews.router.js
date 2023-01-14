import { Router } from "express";
import { auth } from "../../middleWare/authentication.js";
import * as reviews from './controller/reviews.js'
import { endPoint } from "./reviews.endPoint.js";
const router = Router({ mergeParams: true })




router.post('/', auth(endPoint.addReview), reviews.addReview)




export default router