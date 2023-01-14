import authRouter from './auth/register.router.js'
import userRouter from './user/user.router.js'
import subCategoryRouter from './subCtegory/subCategory.router.js'
import categoryRouter from './category/category.router.js'
import brandRouter from './brand/brand.router.js'
import productRouter from './product/product.router.js'
import cartRouter from './cart/cart.router.js'
import reviewsRouter from './reviews/reviews.router.js'
import orderRouter from './order/order.router.js'
import couponRouter from './coupon/coupon.router.js'

import { connectDB } from "../../DB/connection.js";
import { globalError } from "../services/errorHandling.js";
import morgan from 'morgan'
import express from "express";

export const appRouter = (app)=>{
    app.use(express.json());

    const baseUrl = process.env.BASEURL;

    if (process.env.MOOD) {
        app.use(morgan('dev'))
        } else {
        app.use(morgan('tiny'))
        }

app.use(`${baseUrl}/auth`, authRouter);
app.use(`${baseUrl}/user`, userRouter);
app.use(`${baseUrl}/category`,categoryRouter);
app.use(`${baseUrl}/subcategory`, subCategoryRouter);
app.use(`${baseUrl}/brand`,brandRouter);
app.use(`${baseUrl}/product`, productRouter);
app.use(`${baseUrl}/cart`, cartRouter);
app.use(`${baseUrl}/reviews`, reviewsRouter)
app.use(`${baseUrl}/coupon`, couponRouter)
app.use(`${baseUrl}/order`, orderRouter)

app.use("*", (req, res) => {
  res.status(200).send("page not found");
});

//global handling Error
app.use(globalError);
connectDB();
}
