import  Router  from "express";
import * as authRouter from './auth.controller/register.js'
import {validation}from '../../middleWare/validaion.js'
import * as validators from './auth.validation.js'
const router = Router()
//signup
router.post('/signup',authRouter.signup)
//confirm email
router.get('/confirmEmail/:token',validation(validators.token),authRouter.confirmEmail)
router.get('/rfToken/:token',validation(validators.token),authRouter.refreshToken)
router.post('/requestCode',authRouter.requestCode)
router.post('/forgetPass',authRouter.forgetPass)

//signin
router.post('/signin',validation(validators.signin),authRouter.signin)


export default router