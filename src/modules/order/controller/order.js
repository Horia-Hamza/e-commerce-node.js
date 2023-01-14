import { create, findById, findOne, updateOne } from "../../../../DB/DBMethods.js";
import couponModel from "../../../../DB/models/coupon.model.js";
import orderModel from "../../../../DB/models/order.model.js";
import {productModel} from "../../../../DB/models/product.model.js"
import { asyncHandler } from "../../../services/errorHandling.js";




export const placeOrder = asyncHandler(async (req, res, next) => {

    const { products, address, phone, couponId } = req.body;
    const EditProductList = []
    let calcAll = 0

    for (const product of products) {
        const checkProduct = await findOne({
            model: productModel,
            filter: { _id: product.productId }
        })
        if (checkProduct) {
            if (checkProduct.stock >= product.quantity) {
                const savedObj = {
                    productId: checkProduct._id,
                    quantity: product.quantity,
                    unitPrice: checkProduct.finalPrice,
                    total: (checkProduct.finalPrice * product.quantity)
                }
                calcAll = calcAll + savedObj.total
                EditProductList.push(savedObj)
            }
        }
    }


    const orderObj = {
        products: EditProductList,
        totalPrice: calcAll,
        finalPrice: calcAll,
        userId: req.user._id,
        address,
        phone
    }

    if (couponId) {
        const coupon = await findOne({
            model: couponModel,
            filter: { _id: couponId, usedBy: { $nin: req.user._id } }
        })
        if (!coupon) {
            return next(new Error("in-valid coupon id", { cause: 404 }))
        }
        orderObj.couponId = couponId
        orderObj.finalPrice = orderObj.finalPrice - (orderObj.finalPrice * (coupon.amount / 100))
    }


    const order = await create({
        model: orderModel,
        data: orderObj
    })

    if (order) {
        if (order.couponId) {
            await updateOne({
                model: couponModel,
                filter: { _id: order.couponId },
                data: { $addToSet: { usedBy: req.user._id } }
            })
        }
        return res.status(201).json({ message: "Done", order })
    } else {
        return next(new Error("fail to place you order please tray again", { cause: 400 }))
    }
})