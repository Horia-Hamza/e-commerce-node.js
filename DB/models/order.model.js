
import { Schema, model, Types } from "mongoose";


const orderSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        required: [true, 'userId is required'],
        ref: 'User'
    },
 
    products: {
        type: [
            {
                productId: {
                    type: Types.ObjectId,
                    ref: 'Product',
                    required: [true, "productID  is required"],
                    unique: [true, 'can not add the same  product twice'],

                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: [true, "productID  is required"],
                    min: [1, 'minimum is 1']
                },
                unitPrice: {
                    type: Number,
                    min: [0, 'minimum price is 0']
                }
            }
        ]
    },
    address: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'minimum price is 0']
    },
    couponId: {
        type: Types.ObjectId,
        ref: 'Coupon'
    },
    finalPrice: {
        type: Number,
        required: true,
        min: [0, 'minimum price is 0']
    },
    status: {
        type: String,
        default: "placed",
        enum: ['placed', 'underReview', 'onWay', 'received', 'reject']
    },
}, {
    timestamps: true,
})



const orderModel = model('order', orderSchema)
export default orderModel