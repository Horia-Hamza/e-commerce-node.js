import { Schema, model, Types } from "mongoose";


const couponSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'email must be unique value'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']
    },
    createdBy: {
        type: Types.ObjectId,
        required: [true, 'createdBy is required'],
        ref: 'User'
    },
    deletedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User'
    },
    deleted: { type: Boolean, default: false },
    amount: {
        type: Number,
        min: [1, 'minimum amount 1%'],
        max: [100, 'max amount 100%'],
        required: true
    },
    usedBy: {
        type: [{
            type: Types.ObjectId,
            ref: 'User'
        }]
    },
    expireDate: String
}, {
    timestamps: true,
})




const couponModel = model('Coupon', couponSchema)
export default couponModel