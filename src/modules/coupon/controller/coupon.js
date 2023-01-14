import { create, find, findByIdAndUpdate, findOne } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/models/coupon.model.js";
import { asyncHandler } from "../../../services/errorHandling.js";

export const createCoupon = asyncHandler(
    async (req, res, next) => {
        const { name } = req.body
        const coupon = await findOne({
            model: couponModel,
            filter: { name }
        })
        if (coupon) {
            return next(new Error('Duplicated name', { cause: 409 }))
        }
        req.body.createdBy = req.user._id
        const savedCoupon = await create({
            model: couponModel,
            data: req.body
        })
        return res.status(201).json({ message: "Done", savedCoupon })
    }
)


export const updateCoupon = asyncHandler(
    async (req, res, next) => {
        req.body.updatedBy = req.user._id
        const coupon = await findByIdAndUpdate({
            model: couponModel,
            filter: req.params.id,
            data: req.body,
            options: { new: true }
        })
        return res.status(200).json({ message: "Done", coupon })
    }
)


export const deleteCoupon = asyncHandler(
    async (req, res, next) => {
        const coupon = await findByIdAndUpdate({
            model: couponModel,
            filter: req.params.id,
            data: { deletedBy: req.user._id, deleted: true },
            options: { new: true }
        })
        return res.status(200).json({ message: "Done", coupon })
    }
)


export const coupons = asyncHandler(
    async (req, res, next) => {
        const coupon = await find({
            model: couponModel,
            filter: { deleted: false },
        })
        return res.status(200).json({ message: "Done", coupon })
    }
)



