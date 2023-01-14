import { Router } from "express";
import { auth } from "../../middleWare/authentication.js";
import { endPoint } from "./coupon.endPoint.js";
import * as coupon from './controller/coupon.js'
const router = Router({ mergeParams: true })

router.get('/', coupon.coupons)
router.post('/', auth(endPoint.create), coupon.createCoupon)
router.put('/:id', auth(endPoint.update), coupon.updateCoupon)
router.patch('/:id', auth(endPoint.delete), coupon.deleteCoupon)



export default router