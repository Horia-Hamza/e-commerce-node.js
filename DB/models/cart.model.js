import { Schema, model, Types } from "mongoose";
const cartSchema = new Schema(
  {
    userId: {
        type: Types.ObjectId,
        required: [true, 'userId is required'],
        unique: [true, 'only one cart is valid per each  user'],
        ref: 'User'
    },
    products: {
        type: [
            {
                productId: {
                    type:String,
                    required: [true, "productID  is required"],
                    unique: [true, 'can not add the same product twice'],
                },
                quantity: {
                    type: Number,
                    default: 1,
                    required: [true, "productID  is required"],
                    min: [1, 'minimum is 1']
                },
                name: {
                    type: String,
                    required: [true, "name is required"],
                    min: [2, "min letters are 2"],
                    max: [20, "max letters are 20"],
                    lowercase: true,
                    unique: true,
                    trim: true,
                  },
                  slug: {type:String},
                  price: { type: Number, default: 1 },
                  discount: { type: Number, default: 0 },
                  finalPrice: { type: Number, default: 1 },
                  images: { type: [String], required: [true, "images are required"] },
                  imagesPublic_ids: [String],

            },
            
        ]
    },
    active: {
        type: Boolean,
        default: true
      },
      modifiedOn: {
        type: Date,
        default: Date.now
      }
  },
  { timestamps: true }
);
export const cartModel = model('Cart',cartSchema)
