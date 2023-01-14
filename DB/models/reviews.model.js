
import { Schema, model, Types } from "mongoose";


const reviewSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },

    productId: {
        type: Types.ObjectId,
        ref: 'Product'
    },
 
 
    message: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: [1, 'minimum rating is 1'],
        max: [5, 'max is 5'],
    },

}, {
    timestamps: true,
})



const reviewModel = model('Review', reviewSchema)
export default reviewModel