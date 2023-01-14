import { create, find, findOne } from "../../../../DB/DBMethods.js";
import orderModel from "../../../../DB/models/order.model.js"
import reviewModel from "../../../../DB/models/reviews.model.js";

import { asyncHandler } from "../../../services/errorHandling.js";



export const addReview = asyncHandler(
    async (req, res, next) => {

        const { productId } = req.params;
        const matchedOrders = await find({
            model: orderModel,
            filter: { userId: req.user._id, status: 'received' }
        })
        let matched = false
        for (const order of matchedOrders) {
            for (const product of order.products) {
                if (product.productId.toString() == productId) {
                    matched = true
                }
            }
        }

        if (!matched) {
            return next(new Error('in-valid matched product plz make sure of you have bought it before !?s', { cause: 400 }))
        }

        const { rating, message } = req.body

        const checkReviewExist = await findOne({
            model: reviewModel, filter: {
                userId: req.user._id,
                productId
            }
        })
        if (checkReviewExist) {
            return next(new Error('review same product twice is not allowed', { cause: 400 }))

        }
        const reviews = await create({
            model: reviewModel,
            data: {
                rating,
                userId: req.user._id,
                message,
                productId
            }
        })
        return  res.status(201).json({ message: "Done", reviews })
    })